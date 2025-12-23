# HuskyDen - UW Course & Professor Review Platform

A modern course and professor review platform for University of Washington students, inspired by Bruinwalk.

## 🚀 Features

- **Course Reviews**: Browse and review UW courses
- **Professor Ratings**: View and rate professors
- **Search**: Fast search for courses and professors
- **Anonymous Reviews**: Submit reviews without authentication (MVP phase)
- **Modern UI**: Clean, responsive design built with Next.js and Tailwind CSS

## 🏗️ Architecture

- **Frontend**: Next.js 16 (React 19) with TypeScript and Tailwind CSS
- **Backend**: Django 6 with GraphQL API (Graphene-Django)
- **Database**: PostgreSQL (production) / SQLite (development)
- **API**: GraphQL endpoint at `/graphql/`

## 📋 Prerequisites

- Node.js 20+ and npm
- Python 3.11+
- PostgreSQL (optional, SQLite works for development)
- Docker and Docker Compose (optional, for containerized setup)

## 🛠️ Setup Instructions

### Option 1: Local Development (Recommended for MVP)

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser (optional, for admin access):
```bash
python manage.py createsuperuser
```

6. Seed the database with Statistics courses:
```bash
python manage.py seed_statistics
```

7. Start the Django development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`
- GraphQL endpoint: `http://localhost:8000/graphql/`
- Admin panel: `http://localhost:8000/admin/`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional, defaults to localhost:8000):
```bash
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql/
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Option 2: Docker Setup

1. From the project root, start all services:
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Django backend on port 8000
- Next.js frontend on port 3000

2. Run migrations and seed data:
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_statistics
```

## 📁 Project Structure

```
HuskyDen/
├── backend/                 # Django backend
│   ├── huskyden/           # Django project settings
│   ├── reviews/            # Reviews app
│   │   ├── models.py       # Database models
│   │   ├── schema.py       # GraphQL schema
│   │   └── admin.py        # Admin configuration
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker config
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   │   ├── page.tsx       # Home page
│   │   ├── course/        # Course pages
│   │   └── professors/    # Professor pages
│   ├── lib/               # Utilities
│   │   └── graphql.ts     # GraphQL client
│   └── Dockerfile         # Frontend Docker config
├── docker-compose.yml     # Docker orchestration
└── README.md              # This file
```

## 🎯 MVP Features

- ✅ Browse courses with search functionality
- ✅ View course details and reviews
- ✅ Submit anonymous reviews
- ✅ View professor listings
- ✅ Responsive, modern UI

## 🔮 Future Features (Not in MVP)

- User authentication
- Review moderation
- Personalized recommendations
- Social features (likes, comments)
- Mobile apps

## 🧪 Testing the MVP

1. Start both backend and frontend servers
2. Visit `http://localhost:3000`
3. Browse courses or search for "STAT 220"
4. Click on a course to view details and reviews
5. Submit a review using the "Write a Review" button

## 📝 GraphQL Examples

### Query Courses
```graphql
query {
  courses(first: 10) {
    edges {
      node {
        code
        title
        avgRating
      }
    }
  }
}
```

### Query a Specific Course
```graphql
query {
  course(code: "STAT 220") {
    code
    title
    avgRating
    reviews {
      rating
      comment
    }
  }
}
```

### Create a Review
```graphql
mutation {
  createReview(input: {
    courseCode: "STAT 220"
    rating: 5
    workload: 3
    difficulty: 3
    comment: "Great course!"
  }) {
    success
    review {
      id
    }
  }
}
```

## 🐛 Troubleshooting

- **CORS errors**: Make sure `CORS_ALLOWED_ORIGINS` in `backend/huskyden/settings.py` includes your frontend URL
- **Database errors**: Run `python manage.py migrate` to apply migrations
- **GraphQL errors**: Check that the backend is running and accessible at the configured URL

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

This is an MVP. Future contributions welcome after initial release!

---

Built with ❤️ for UW students

