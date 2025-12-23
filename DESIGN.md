# HuskyDen Design Document

This file references the original design document for the UW Course Review Platform.

## Architecture Overview

- **Frontend**: Next.js 16 with TypeScript and Tailwind CSS
- **Backend**: Django 6 with GraphQL API (Graphene-Django)
- **Database**: SQLite (development) / PostgreSQL (production)
- **API**: GraphQL at `/graphql/`

## Current Implementation Status

### ✅ Phase 1 - MVP (Completed)

- [x] Read-only course & professor pages
- [x] Anonymous reviews
- [x] Search and filtering
- [x] Admin-only data management (Django admin)
- [x] Modern, responsive UI
- [x] GraphQL API with queries and mutations

### 🔜 Phase 2 - Accounts & Moderation (Future)

- [ ] User authentication (OAuth)
- [ ] Review ownership
- [ ] Reporting and moderation tools

### 🔜 Phase 3 - Personalization (Future)

- [ ] Saved courses/professors
- [ ] Recommendations
- [ ] Analytics dashboards

## Technology Choices

### Frontend
- **Next.js**: Server-side rendering for SEO, excellent DX
- **TypeScript**: Type safety
- **Tailwind CSS**: Rapid UI development
- **GraphQL Request**: Simple GraphQL client

### Backend
- **Django**: Mature framework with strong security defaults
- **Graphene-Django**: GraphQL integration
- **Django ORM**: Database abstraction

## Database Schema

### Core Models
- `Department`: Department codes and names
- `Course`: Course information (code, title, description)
- `Professor`: Professor information
- `Review`: Reviews linking courses and professors

### Indexes
- Course code
- Professor name
- Review course/professor relationships
- Review timestamps

## API Design

### GraphQL Queries
- `courses`: List all courses (with filtering)
- `course(code)`: Get specific course with reviews
- `professors`: List all professors
- `professor(id)`: Get specific professor

### GraphQL Mutations
- `createReview`: Submit anonymous review

## Future Enhancements

### Search
- Elasticsearch integration for full-text search
- Autocomplete search bar
- Review text search

### Caching
- Redis for course/professor page caching
- Aggregated ratings caching

### Security
- Rate limiting for review submissions
- CAPTCHA for forms
- Input sanitization
- HTTPS enforcement

## Deployment

### Development
- Local development with SQLite
- Docker Compose for full stack

### Production (Future)
- Frontend: Vercel or similar
- Backend: Railway or similar
- Database: Managed PostgreSQL
- Redis: Managed service
- Elasticsearch: Managed service

## Naming

The platform is called **HuskyDen** - a play on "Husky" (UW mascot) and "Den" (a place where Huskies gather).

---

For the full original design document, see the project requirements.

