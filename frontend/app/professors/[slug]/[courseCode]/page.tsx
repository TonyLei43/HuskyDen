'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
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
  slug: string;
  department: {
    code: string;
    name: string;
  } | null;
  avgRating: number | null;
  reviews: Review[];
}

const GET_PROFESSOR_BY_SLUG = gql`
  query GetProfessorBySlug($slug: String!) {
    professor(slug: $slug) {
      id
      name
      slug
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

function ProfessorCourseContent() {
  const params = useParams();
  const slug = params.slug as string;
  const courseCode = decodeURIComponent(params.courseCode as string);
  
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessor();
  }, [slug]);

  const fetchProfessor = async () => {
    try {
      setLoading(true);
      const data: any = await graphqlClient.request(GET_PROFESSOR_BY_SLUG, { slug });
      
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

  // Filter reviews by course
  const courseReviews = professor?.reviews.filter(review => 
    review.course.code === courseCode
  ) || [];

  // Calculate course-specific stats
  const courseStats = courseReviews.length > 0 ? {
    avgRating: courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length,
    avgWorkload: courseReviews.reduce((sum, r) => sum + r.workload, 0) / courseReviews.length,
    avgDifficulty: courseReviews.reduce((sum, r) => sum + r.difficulty, 0) / courseReviews.length,
  } : null;

  // Get course info from first review
  const courseInfo = courseReviews.length > 0 ? courseReviews[0].course : null;

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
      <Link href={`/course/${encodeURIComponent(courseCode)}`} 
            className="mb-4 inline-block hover:underline transition-colors" 
            style={{ color: '#4b2e83' }}>
        ← Back to {courseCode}
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{professor.name}</h1>
          {professor.department && (
            <p className="text-lg text-gray-600">{professor.department.name}</p>
          )}
          {courseInfo && (
            <div className="mt-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                {courseInfo.code} - {courseInfo.title}
              </h2>
            </div>
          )}
        </div>

        {courseStats ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Stats for {courseCode}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg p-4" style={{ backgroundColor: '#f5f3f9' }}>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-2xl font-bold" style={{ color: '#4b2e83' }}>
                  {courseStats.avgRating.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Based on {courseReviews.length} {courseReviews.length === 1 ? 'review' : 'reviews'}</p>
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

            {/* Individual rating bars */}
            <div className="mt-6 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">Rating</span>
                  <span className="text-sm text-gray-600">
                    {courseStats.avgRating.toFixed(1)}<span className="text-gray-400">/ 5</span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(courseStats.avgRating / 5) * 100}%`,
                      backgroundColor: getRatingColor(courseStats.avgRating),
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">Workload</span>
                  <span className="text-sm text-gray-600">
                    {courseStats.avgWorkload.toFixed(1)}<span className="text-gray-400">/ 5</span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(courseStats.avgWorkload / 5) * 100}%`,
                      backgroundColor: '#85754d',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">Difficulty</span>
                  <span className="text-sm text-gray-600">
                    {courseStats.avgDifficulty.toFixed(1)}<span className="text-gray-400">/ 5</span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(courseStats.avgDifficulty / 5) * 100}%`,
                      backgroundColor: '#85754d',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-gray-500">No reviews yet for {courseCode}.</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Reviews ({courseReviews.length})
        </h2>
        {courseReviews.length === 0 ? (
          <p className="text-gray-500">
            No reviews yet for {courseCode}. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4">
            {courseReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
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

export default function ProfessorCoursePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><p className="text-center text-gray-500">Loading professor...</p></div>}>
      <ProfessorCourseContent />
    </Suspense>
  );
}

