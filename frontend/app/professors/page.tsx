'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { graphqlClient } from '@/lib/graphql';
import { gql } from 'graphql-request';

interface Professor {
  id: string;
  name: string;
  department: {
    code: string;
    name: string;
  } | null;
  avgRating: number | null;
}

const GET_PROFESSORS = gql`
  query GetProfessors {
    professors(first: 50) {
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

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const data: any = await graphqlClient.request(GET_PROFESSORS);
      setProfessors(data.professors.edges.map((edge: any) => edge.node));
    } catch (error) {
      console.error('Error fetching professors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Professors</h1>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading professors...</p>
        </div>
      ) : professors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No professors found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.map((professor) => (
            <div
              key={professor.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                <Link
                  href={`/professor/${professor.id}`}
                  className="hover:underline"
                  style={{ color: '#4b2e83' }}
                >
                  {professor.name}
                </Link>
              </h2>
              {professor.department && (
                <p className="text-sm text-gray-500 mb-4">
                  {professor.department.name}
                </p>
              )}
              <div className="flex items-center gap-2">
                {professor.avgRating ? (
                  <>
                    <span style={{ color: '#b7a57a' }}>★</span>
                    <span className="font-semibold">
                      {professor.avgRating.toFixed(1)}/5.0
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">No ratings yet</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

