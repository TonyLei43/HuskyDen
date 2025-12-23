'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=classes`);
    } else {
      router.push('/search?category=classes');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ color: '#4b2e83' }}>
              HuskyDen
            </h1>
            <p className="text-xl" style={{ color: '#374151' }}>
              Find and review courses and professors at the University of Washington
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, professors..."
                className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none shadow-sm"
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(75, 46, 131, 0.1)';
                  e.currentTarget.style.borderColor = '#4b2e83';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = '';
                }}
              />
              <button
                type="submit"
                className="px-8 py-4 text-lg text-white rounded-lg transition-colors font-semibold"
                style={{ backgroundColor: '#4b2e83' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#32006e'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4b2e83'}
              >
                Search
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link 
              href="/search?category=classes"
              className="inline-block px-6 py-2 transition-colors font-medium"
              style={{ color: '#4b2e83' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#32006e'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b2e83'}
            >
              Browse all courses →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
