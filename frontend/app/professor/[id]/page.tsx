'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { graphqlClient } from '@/lib/graphql';
import { gql } from 'graphql-request';

interface Review {
  id: string;
  rating: number;
  workload: number;
  difficulty: number;
  comment: string;
  course: {
    id: string;
    code: string;
    title: string;
  };
  createdAt: string;
}

interface Professor {
  id: string;
  name: string;
  department: {
    code: string;
    name: string;
  } | null;
  avgRating: number | null;
  reviews: Review[];
}

const GET_PROFESSOR = gql`
  query GetProfessor($id: Int!) {
    professor(id: $id) {
      id
      name
      department {
        code
        name
      }
      avgRating
      reviews {
        id
        rating
        workload
        difficulty
        comment
        course {
          id
          code
          title
        }
        createdAt
      }
    }
  }
`;

function ProfessorContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseCode = searchParams.get('course');
  
  const professorId = parseInt(params.id as string);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState<string | null>(courseCode);

  useEffect(() => {
    fetchProfessor();
  }, [professorId]);

  const fetchProfessor = async () => {
    try {
      setLoading(true);
      const data: any = await graphqlClient.request(GET_PROFESSOR, { id: professorId });
      
      if (data && data.professor) {
        setProfessor(data.professor);
      } else {
        setProfessor(null);
      }
    } catch (error: any) {
      console.error('Error fetching professor:', error);
      setProfessor(null);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating: number | null): string => {
    if (rating === null || rating === undefined || isNaN(rating)) return '#898989';
    if (rating >= 4.5) return '#1D830D';
    if (rating >= 4.0) return '#75C337';
    if (rating >= 3.0) return '#F58B0E';
    return '#D32F2F';
  };

  // Filter reviews by course if filterCourse is set
  const filteredReviews = professor?.reviews.filter(review => 
    !filterCourse || review.course.code === filterCourse
  ) || [];

  // Calculate course-specific stats if filtering by course
  const courseStats = filterCourse && filteredReviews.length > 0 ? {
    avgRating: filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length,
    avgWorkload: filteredReviews.reduce((sum, r) => sum + r.workload, 0) / filteredReviews.length,
    avgDifficulty: filteredReviews.reduce((sum, r) => sum + r.difficulty, 0) / filteredReviews.length,
  } : null;

  // Get unique courses this professor has taught
  const coursesTaught = professor ? 
    Array.from(new Set(professor.reviews.map(r => r.course.code)))
      .map(code => {
        const review = professor.reviews.find(r => r.course.code === code);
        return review ? review.course : null;
      })
      .filter(c => c !== null) as Array<{ id: string; code: string; title: string }>
    : [];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading professor...</p>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Professor not found</p>
        <Link href="/professors" className="text-purple-600 hover:underline">
          Back to professors
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={courseCode ? `/course/${encodeURIComponent(courseCode)}` : '/professors'} 
            className="mb-4 inline-block hover:underline transition-colors" 
            style={{ color: '#4b2e83' }}>
        ← Back {courseCode ? 'to course' : 'to professors'}
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{professor.name}</h1>
          {professor.department && (
            <p className="text-lg text-gray-600">{professor.department.name}</p>
          )}
        </div>

        {filterCourse ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Stats for {filterCourse}
              </h2>
              <button
                onClick={() => setFilterCourse(null)}
                className="text-sm text-gray-600 hover:underline"
              >
                Show all courses
              </button>
            </div>
            {courseStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg p-4" style={{ backgroundColor: '#f5f3f9' }}>
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <p className="text-2xl font-bold" style={{ color: '#4b2e83' }}>
                    {courseStats.avgRating.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: '#f5f3e9' }}>
                  <p className="text-sm text-gray-600 mb-1">Average Workload</p>
                  <p className="text-2xl font-bold" style={{ color: '#85754d' }}>
                    {courseStats.avgWorkload.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: '#f5f3e9' }}>
                  <p className="text-sm text-gray-600 mb-1">Average Difficulty</p>
                  <p className="text-2xl font-bold" style={{ color: '#85754d' }}>
                    {courseStats.avgDifficulty.toFixed(1)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg p-4" style={{ backgroundColor: '#f5f3f9' }}>
              <p className="text-sm text-gray-600 mb-1">Overall Rating</p>
              <p className="text-2xl font-bold" style={{ color: '#4b2e83' }}>
                {professor.avgRating ? professor.avgRating.toFixed(1) : 'N/A'}
              </p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: '#f5f3e9' }}>
              <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
              <p className="text-2xl font-bold" style={{ color: '#85754d' }}>
                {professor.reviews.length}
              </p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: '#f5f3e9' }}>
              <p className="text-sm text-gray-600 mb-1">Courses Taught</p>
              <p className="text-2xl font-bold" style={{ color: '#85754d' }}>
                {coursesTaught.length}
              </p>
            </div>
          </div>
        )}

        {coursesTaught.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Courses Taught</h3>
            <div className="flex flex-wrap gap-2">
              {coursesTaught.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setFilterCourse(course.code)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    filterCourse === course.code
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={
                    filterCourse === course.code
                      ? { backgroundColor: '#4b2e83' }
                      : {}
                  }
                >
                  {course.code}
                </button>
              ))}
              {filterCourse && (
                <button
                  onClick={() => setFilterCourse(null)}
                  className="px-3 py-1 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  All Courses
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Reviews {filterCourse ? `for ${filterCourse}` : ''} ({filteredReviews.length})
        </h2>
        {filteredReviews.length === 0 ? (
          <p className="text-gray-500">
            {filterCourse 
              ? `No reviews yet for ${filterCourse}. Be the first to review!`
              : 'No reviews yet. Be the first to review!'
            }
          </p>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Link
                      href={`/course/${encodeURIComponent(review.course.code)}`}
                      className="font-semibold text-gray-900 hover:underline"
                      style={{ color: '#4b2e83' }}
                    >
                      {review.course.code} - {review.course.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-lg" style={{ color: '#b7a57a' }}>
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-600">Workload: </span>
                    <span className="font-semibold">{review.workload}/5</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Difficulty: </span>
                    <span className="font-semibold">{review.difficulty}/5</span>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 mt-3">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfessorPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><p className="text-center text-gray-500">Loading professor...</p></div>}>
      <ProfessorContent />
    </Suspense>
  );
}

