
# Quick Start Guide

Get HuskyDen running in 5 minutes!

## Prerequisites Check

- ✅ Python 3.11+ installed
- ✅ Node.js 20+ installed
- ✅ Both backend and frontend directories exist

## Step-by-Step Setup

### 1. Backend Setup (Terminal 1)

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py migrate
python manage.py seed_statistics
python manage.py runserver
```

Backend will be running at: **http://localhost:8000**
- GraphQL endpoint: http://localhost:8000/graphql/
- Admin panel: http://localhost:8000/admin/

### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at: **http://localhost:3000**

## Verify It Works

1. Open http://localhost:3000 in your browser
2. You should see the HuskyDen homepage with sample courses
3. Click on "STAT 220" to view course details
4. Try submitting a review!

## Troubleshooting

**Backend won't start?**
- Make sure you're in the `backend` directory
- Activate the virtual environment: `source venv/bin/activate`
- Check if port 8000 is already in use

**Frontend won't start?**
- Make sure you're in the `frontend` directory
- Run `npm install` if you haven't already
- Check if port 3000 is already in use

**Can't see courses?**
- Make sure the backend is running
- Check browser console for errors
- Verify GraphQL endpoint is accessible at http://localhost:8000/graphql/

**GraphQL errors?**
- Make sure migrations ran: `python manage.py migrate`
- Make sure data is seeded: `python manage.py seed_statistics`

## Next Steps

- Explore the codebase
- Customize the UI
- Add more courses via the admin panel (http://localhost:8000/admin/)
- Read the full README.md for more details

Happy coding! 🐺

