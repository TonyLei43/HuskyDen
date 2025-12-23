'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { graphqlClient } from '@/lib/graphql';
import { gql } from 'graphql-request';

interface Course {
  id: string;
  code: string;
  title: string;
  department: {
    code: string;
    name: string;
  };
  avgRating: number | null;
  avgWorkload: number | null;
  avgDifficulty: number | null;
}

interface Professor {
  id: string;
  name: string;
  department: {
    code: string;
    name: string;
  } | null;
  avgRating: number | null;
}

interface Department {
  id: string;
  code: string;
  name: string;
}

const GET_COURSES = gql`
  query GetCourses {
    courses(first: 100) {
      edges {
        node {
          id
          code
          title
          department {
            code
            name
          }
          avgRating
          avgWorkload
          avgDifficulty
        }
      }
    }
  }
`;

const GET_PROFESSORS = gql`
  query GetProfessors {
    professors(first: 100) {
      edges {
        node {
          id
          name
          department {
            code
            name
          }
          avgRating
        }
      }
    }
  }
`;

const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments(first: 100) {
      edges {
        node {
          id
          code
          name
        }
      }
    }
  }
`;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [category, setCategory] = useState<'all' | 'classes' | 'professors'>(
    (searchParams.get('category') as 'all' | 'classes' | 'professors') || 'classes'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('department') || '');
  const [minRating, setMinRating] = useState(parseFloat(searchParams.get('min') || '1'));
  const [maxRating, setMaxRating] = useState(parseFloat(searchParams.get('max') || '5'));
  const [selectedLevels, setSelectedLevels] = useState<number[]>(() => {
    const levelsParam = searchParams.get('levels');
    return levelsParam ? levelsParam.split(',').map(Number) : [];
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Sync category state with URL params when they change
  useEffect(() => {
    const urlCategory = searchParams.get('category') as 'all' | 'classes' | 'professors' | null;
    if (urlCategory && ['all', 'classes', 'professors'].includes(urlCategory) && urlCategory !== category) {
      setCategory(urlCategory);
    } else if (!urlCategory && category !== 'classes') {
      // Default to 'classes' if no category in URL
      setCategory('classes');
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchQuery, selectedDepartment, minRating, maxRating, selectedLevels]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesData, professorsData, departmentsData]: any = await Promise.all([
        graphqlClient.request(GET_COURSES),
        graphqlClient.request(GET_PROFESSORS),
        graphqlClient.request(GET_DEPARTMENTS),
      ]);

      setCourses(coursesData.courses.edges.map((edge: any) => edge.node));
      setProfessors(professorsData.professors.edges.map((edge: any) => edge.node));
      setDepartments(departmentsData.departments.edges.map((edge: any) => edge.node));
    } catch (error: any) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.errors || error.message);
      // Set empty arrays on error to prevent UI crashes
      setCourses([]);
      setProfessors([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract course level from course code (e.g., "STAT 220" -> 200, "STAT 390" -> 300)
  const getCourseLevel = (courseCode: string): number | null => {
    const match = courseCode.match(/\s+(\d)(\d{2})/);
    if (match) {
      const hundreds = parseInt(match[1]);
      return hundreds * 100;
    }
    return null;
  };

  const applyFilters = () => {
    // Update URL with current filters
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (searchQuery) params.set('q', searchQuery);
    if (selectedDepartment) params.set('department', selectedDepartment);
    if (minRating > 1) params.set('min', minRating.toFixed(1));
    if (maxRating < 5) params.set('max', maxRating.toFixed(1));
    if (selectedLevels.length > 0) params.set('levels', selectedLevels.join(','));
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  const toggleLevel = (level: number) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level].sort((a, b) => a - b)
    );
  };

  const filteredCourses = courses.filter((course) => {
    // Department filter
    if (selectedDepartment && course.department.code !== selectedDepartment) return false;
    
    // Level filter
    if (selectedLevels.length > 0) {
      const courseLevel = getCourseLevel(course.code);
      if (courseLevel === null || !selectedLevels.includes(courseLevel)) return false;
    }
    
    // Rating filter
    if (course.avgRating !== null) {
      if (course.avgRating < minRating || course.avgRating > maxRating) return false;
    } else {
      // If no rating, only show if minRating is 1 (showing all)
      if (minRating > 1) return false;
    }
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        course.code.toLowerCase().includes(query) ||
        course.title.toLowerCase().includes(query) ||
        course.department.code.toLowerCase().includes(query) ||
        course.department.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const filteredProfessors = professors.filter((prof) => {
    // Department filter
    if (selectedDepartment && prof.department?.code !== selectedDepartment) return false;
    
    // Rating filter
    if (prof.avgRating !== null) {
      if (prof.avgRating < minRating || prof.avgRating > maxRating) return false;
    } else {
      // If no rating, only show if minRating is 1 (showing all)
      if (minRating > 1) return false;
    }
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        prof.name.toLowerCase().includes(query) ||
        prof.department?.code.toLowerCase().includes(query) ||
        prof.department?.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const renderStars = (rating: number | null) => {
    if (rating === null) return <span className="text-gray-400">No ratings</span>;
    return (
      <div className="flex items-center gap-1">
        <span style={{ color: '#b7a57a' }}>★</span>
        <span className="font-semibold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleCategoryChange = (newCategory: 'all' | 'classes' | 'professors') => {
    setCategory(newCategory);
    // Update URL immediately
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1f2937' }}>FILTERS</h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={category === 'all'}
                    onChange={() => handleCategoryChange('all')}
                    className="mr-2"
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="classes"
                    checked={category === 'classes'}
                    onChange={() => handleCategoryChange('classes')}
                    className="mr-2"
                  />
                  <span>Classes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="professors"
                    checked={category === 'professors'}
                    onChange={() => handleCategoryChange('professors')}
                    className="mr-2"
                  />
                  <span>Professors</span>
                </label>
              </div>
            </div>

            {/* Department Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.code}>
                    {dept.code} - {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            {(category === 'all' || category === 'classes') && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                  Level
                </label>
                <div className="space-y-2">
                  {[100, 200, 300, 400, 500, 600, 700, 800].map((level) => {
                    const count = courses.filter(c => getCourseLevel(c.code) === level).length;
                    return (
                      <label key={level} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level)}
                          onChange={() => toggleLevel(level)}
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#4b2e83' }}
                        />
                        <span className="text-sm" style={{ color: '#374151' }}>
                          {level}
                          <span className="ml-2" style={{ color: '#6b7280' }}>({count})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                Rating
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm mb-2" style={{ color: '#4b5563' }}>
                  <span>Min: {minRating}</span>
                  <span>Max: {maxRating}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs" style={{ color: '#6b7280' }}>Minimum Rating</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={minRating}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setMinRating(Math.min(val, maxRating));
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #4b2e83 0%, #4b2e83 ${((minRating - 1) / 4) * 100}%, #e5e7eb ${((minRating - 1) / 4) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs" style={{ color: '#6b7280' }}>Maximum Rating</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={maxRating}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setMaxRating(Math.max(val, minRating));
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${((maxRating - 1) / 4) * 100}%, #4b2e83 ${((maxRating - 1) / 4) * 100}%, #4b2e83 100%)`
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs pt-1" style={{ color: '#6b7280' }}>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>

            {/* Search Box */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

              {/* Results */}
              <div className="flex-1">
                {loading ? (
                  <div className="text-center py-12">
                    <p style={{ color: '#6b7280' }}>Loading...</p>
                  </div>
                ) : courses.length === 0 && professors.length === 0 && !loading ? (
                  <div className="text-center py-12">
                    <p style={{ color: '#6b7280' }} className="mb-4">
                      Unable to connect to the server. Please make sure the backend is running at http://localhost:8000
                    </p>
                    <p style={{ color: '#9ca3af' }} className="text-sm">
                      If the backend is running, check the browser console for more details.
                    </p>
                  </div>
                ) : (
            <>
              {/* Courses Results */}
              {(category === 'all' || category === 'classes') && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Classes {filteredCourses.length > 0 && `(${filteredCourses.length})`}
                  </h2>
                  {filteredCourses.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>No courses found matching your filters.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/course/${encodeURIComponent(course.code)}`}
                          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{course.code}</h3>
                            <p className="text-sm" style={{ color: '#6b7280' }}>{course.department.code}</p>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            {course.title}
                          </h4>
                          <div className="flex items-center justify-between text-sm">
                            {renderStars(course.avgRating)}
                            {course.avgWorkload && (
                              <span style={{ color: '#4b5563' }}>
                                Workload: {course.avgWorkload.toFixed(1)}/5
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Professors Results */}
              {(category === 'all' || category === 'professors') && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Professors {filteredProfessors.length > 0 && `(${filteredProfessors.length})`}
                  </h2>
                  {filteredProfessors.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>No professors found matching your filters.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProfessors.map((prof) => (
                        <div
                          key={prof.id}
                          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {prof.name}
                          </h3>
                          {prof.department && (
                            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                              {prof.department.name}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            {renderStars(prof.avgRating)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

