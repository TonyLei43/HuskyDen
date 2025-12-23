import { GraphQLClient } from 'graphql-request';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql/';

export const graphqlClient = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
  errorPolicy: 'all',
  credentials: 'omit', // Don't send credentials for CORS
});

// Log the GraphQL URL in development
if (process.env.NODE_ENV === 'development') {
  console.log('GraphQL URL:', GRAPHQL_URL);
}

