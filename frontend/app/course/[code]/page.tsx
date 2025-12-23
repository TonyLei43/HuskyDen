'use client';

import { useState, useEffect } from 'react';
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
  professor: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  department: {
    code: string;
    name: string;
  };
  avgRating: number | null;
  avgWorkload: number | null;
  avgDifficulty: number | null;
  reviews: Review[];
}

interface ProfessorStats {
  id: string;
  name: string;
  slug: string;
  numReviews: number;
  avgRating: number;
  avgWorkload: number;
  avgDifficulty: number;
  mostHelpfulReview: Review | null;
}

const GET_COURSE = gql`
  query GetCourse($code: String!) {
    course(code: $code) {
      id
      code
      title
      description
      department {
        code
        name
      }
      avgRating
      avgWorkload
      avgDifficulty
      reviews {
        id
        rating
        workload
        difficulty
        comment
        professor {
          id
          name
          slug
        }
        createdAt
      }
    }
  }
`;

export default function CoursePage() {
  const params = useParams();
  // Decode URL-encoded course code (e.g., "STAT%20220" -> "STAT 220")
  // useParams already decodes, but we'll ensure it's decoded properly
  const rawCode = params.code as string;
  let code: string;
  try {
    // Try decoding in case it's double-encoded
    code = decodeURIComponent(rawCode);
  } catch {
    // If decoding fails, use as-is
    code = rawCode;
  }
  code = code.trim();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [code]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      console.log('Fetching course with code:', code);
      // Ensure code is properly decoded and trimmed
      const decodedCode = decodeURIComponent(code).trim();
      console.log('Decoded code:', decodedCode);
      
      const data: any = await graphqlClient.request(GET_COURSE, { code: decodedCode });
      console.log('GraphQL response:', data);
      
      if (data && data.course) {
        setCourse(data.course);
      } else {
        console.error('Course not found in response for code:', decodedCode);
        console.error('Response data:', data);
        setCourse(null);
      }
    } catch (error: any) {
      console.error('Error fetching course:', error);
      console.error('Error details:', error.response?.errors || error.message);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Process reviews to get professor statistics
  const getProfessorStats = (): ProfessorStats[] => {
    if (!course || !course.reviews) return [];
    
    const professorMap = new Map<string, {
      id: string;
      name: string;
      slug: string;
      reviews: Review[];
    }>();

    // Group reviews by professor
    course.reviews.forEach((review) => {
      if (review.professor) {
        const profId = review.professor.id;
        if (!professorMap.has(profId)) {
          professorMap.set(profId, {
            id: profId,
            name: review.professor.name,
            slug: review.professor.slug || profId,
            reviews: [],
          });
        }
        professorMap.get(profId)!.reviews.push(review);
      }
    });

    // Calculate stats for each professor
    const stats: ProfessorStats[] = Array.from(professorMap.values()).map((prof) => {
      const reviews = prof.reviews;
      const numReviews = reviews.length;
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;
      const avgWorkload = reviews.reduce((sum, r) => sum + r.workload, 0) / numReviews;
      const avgDifficulty = reviews.reduce((sum, r) => sum + r.difficulty, 0) / numReviews;
      
      // Find most helpful review (highest rating, or first one with comment)
      const mostHelpfulReview = reviews.find(r => r.comment && r.comment.length > 0) || reviews[0] || null;

      return {
        id: prof.id,
        name: prof.name,
        slug: prof.slug,
        numReviews,
        avgRating,
        avgWorkload,
        avgDifficulty,
        mostHelpfulReview,
      };
    });

    // Sort by last name (default)
    return stats.sort((a, b) => {
      const aLastName = a.name.split(' ').pop() || '';
      const bLastName = b.name.split(' ').pop() || '';
      return aLastName.localeCompare(bLastName);
    });
  };

  const getRatingColor = (rating: number | null): string => {
    if (rating === null || rating === undefined || isNaN(rating)) return '#898989'; // Gray for N/A
    if (rating >= 4.5) return '#1D830D'; // Green
    if (rating >= 4.0) return '#75C337'; // Light green
    if (rating >= 3.0) return '#F58B0E'; // Orange
    return '#D32F2F'; // Red
  };

  const formatRating = (rating: number | null): string => {
    if (rating === null || rating === undefined || isNaN(rating)) return 'N/A';
    return rating.toFixed(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center" style={{ color: '#6b7280' }}>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center" style={{ color: '#6b7280' }}>Course not found</p>
        <Link href="/" className="text-purple-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <Link href="/" className="mb-4 inline-block hover:underline transition-colors" style={{ color: '#4b2e83' }}>
          ← Back to courses
        </Link>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold" style={{ color: '#111827' }}>{course.code}</h1>
          <p className="text-lg" style={{ color: '#4b5563' }}>{course.department.name}</p>
        </div>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1f2937' }}>
          {course.title}
        </h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#1f2937' }}>Course Description</h3>
          {course.description ? (
            <p className="leading-relaxed whitespace-pre-wrap" style={{ color: '#374151' }}>{course.description}</p>
          ) : (
            <p className="italic" style={{ color: '#6b7280' }}>No description available for this course.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg p-4" style={{ backgroundColor: '#f5f3f9' }}>
            <p className="text-sm mb-1" style={{ color: '#4b5563' }}>Average Rating</p>
            <p className="text-2xl font-bold" style={{ color: '#4b2e83' }}>
              {course.avgRating ? course.avgRating.toFixed(1) : 'N/A'}
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: '#f5f3e9' }}>
            <p className="text-sm mb-1" style={{ color: '#4b5563' }}>Average Workload</p>
            <p className="text-2xl font-bold" style={{ color: '#85754d' }}>
              {course.avgWorkload ? course.avgWorkload.toFixed(1) : 'N/A'}
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: '#f5f3e9' }}>
            <p className="text-sm mb-1" style={{ color: '#4b5563' }}>Average Difficulty</p>
            <p className="text-2xl font-bold" style={{ color: '#85754d' }}>
              {course.avgDifficulty ? course.avgDifficulty.toFixed(1) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Professors Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold" style={{ color: '#111827' }}>
            Professors Who Taught This Course
          </h2>
        </div>
        
        {(() => {
          const professorStats = getProfessorStats();
          
          if (professorStats.length === 0) {
            return (
              <p style={{ color: '#6b7280' }}>No professors found for this course yet.</p>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {professorStats.map((prof, index) => (
                <div
                  key={prof.id}
                  className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                    index % 2 === 0 ? 'border-l-4' : 'border-l-4'
                  }`}
                  style={{
                    borderLeftColor: index % 2 === 0 ? '#4b2e83' : '#85754d',
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#111827' }}>
                        <Link
                          href={`/professors/${prof.slug || prof.id}/${encodeURIComponent(course.code)}`}
                          className="hover:underline"
                          style={{ color: '#4b2e83' }}
                        >
                          {prof.name}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: '#4b5563' }}>Overall Rating</span>
                        <span
                          className="px-3 py-1 rounded text-white text-sm font-bold"
                          style={{ backgroundColor: getRatingColor(prof.avgRating) }}
                        >
                          {formatRating(prof.avgRating)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ color: '#374151' }}>Rating</span>
                        <span className="text-sm" style={{ color: '#4b5563' }}>
                          {formatRating(prof.avgRating)}<span style={{ color: '#9ca3af' }}>/ 5</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${((prof.avgRating || 0) / 5) * 100}%`,
                            backgroundColor: getRatingColor(prof.avgRating),
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ color: '#374151' }}>Workload</span>
                        <span className="text-sm" style={{ color: '#4b5563' }}>
                          {formatRating(prof.avgWorkload)}<span style={{ color: '#9ca3af' }}>/ 5</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${((prof.avgWorkload || 0) / 5) * 100}%`,
                            backgroundColor: '#85754d',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ color: '#374151' }}>Difficulty</span>
                        <span className="text-sm" style={{ color: '#4b5563' }}>
                          {formatRating(prof.avgDifficulty)}<span style={{ color: '#9ca3af' }}>/ 5</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${((prof.avgDifficulty || 0) / 5) * 100}%`,
                            backgroundColor: '#85754d',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm">
                      <span className="font-semibold" style={{ color: '#374151' }}>
                        <Link
                          href={`/professors/${prof.slug}/${encodeURIComponent(course.code)}`}
                          className="hover:underline"
                          style={{ color: '#4b2e83' }}
                        >
                          Most Helpful Review
                        </Link>
                      </span>
                      <br />
                      {prof.mostHelpfulReview && prof.mostHelpfulReview.comment ? (
                        <Link
                          href={`/professors/${prof.slug}/${encodeURIComponent(course.code)}`}
                          className="hover:underline mt-1 block line-clamp-2"
                          style={{ color: '#4b5563' }}
                        >
                          {prof.mostHelpfulReview.comment.length > 150
                            ? `${prof.mostHelpfulReview.comment.substring(0, 150)}...`
                            : prof.mostHelpfulReview.comment}
                        </Link>
                      ) : (
                        <span className="italic mt-1 block" style={{ color: '#6b7280' }}>
                          No reviews have been written yet.
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-2" style={{ color: '#6b7280' }}>
                      {prof.numReviews} {prof.numReviews === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

    </div>
  );
}

