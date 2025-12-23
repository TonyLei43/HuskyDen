# Deployment Guide

## ✅ Current Setup - Reviews ARE Saved

**Yes, reviews are saved to the database!** When you submit a review:

1. Frontend sends GraphQL mutation to backend
2. Backend validates and saves to database using Django ORM (`Review.objects.create()`)
3. Data persists in the database (SQLite locally, PostgreSQL in production)
4. Reviews are immediately available when you refresh the page

## 🚀 Deployment Architecture

For production deployment, you'll need:

- **Frontend (Next.js)**: Deploy to **Vercel** ✅
- **Backend (Django)**: Deploy to **Railway**, **Render**, or **Fly.io** ✅
- **Database**: Managed PostgreSQL (Railway, Supabase, Neon, etc.) ✅

## 📋 Deployment Steps

### 1. Frontend Deployment (Vercel)

#### Setup

1. **Push your code to GitHub** (if not already)

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

3. **Configure Environment Variables**:
   ```
   NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-url.railway.app/graphql/
   ```

4. **Deploy**: Vercel will automatically deploy on every push

#### Vercel Configuration

Create `frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### 2. Backend Deployment (Railway - Recommended)

#### Why Railway?
- Easy Django deployment
- Built-in PostgreSQL database
- Automatic HTTPS
- Free tier available

#### Steps

1. **Install Railway CLI** (optional):
   ```bash
   npm i -g @railway/cli
   ```

2. **Deploy via Railway Dashboard**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `backend`

3. **Add PostgreSQL Database**:
   - In Railway dashboard, click "+ New" → "Database" → "PostgreSQL"
   - Railway will automatically provide `DATABASE_URL` environment variable

4. **Configure Environment Variables**:
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-backend-url.railway.app
   DATABASE_URL=postgresql://... (auto-provided by Railway)
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

5. **Set Build Command**:
   ```
   pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
   ```

6. **Set Start Command**:
   ```
   gunicorn huskyden.wsgi:application --bind 0.0.0.0:$PORT
   ```

### 3. Alternative: Backend on Render

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repo, set root to `backend`
4. Add PostgreSQL database
5. Set environment variables (same as Railway)
6. Build: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
7. Start: `gunicorn huskyden.wsgi:application`

### 4. Database Setup

#### Option A: Railway PostgreSQL (Easiest)
- Included when you add PostgreSQL service
- Automatically provides `DATABASE_URL`

#### Option B: Supabase (Free tier)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Set `DATABASE_URL` in backend environment variables

#### Option C: Neon (Free tier)
1. Create account at [neon.tech](https://neon.tech)
2. Create database
3. Get connection string
4. Set `DATABASE_URL` in backend environment variables

### 5. Update Settings for Production

The backend settings have been updated to:
- Use environment variables for sensitive data
- Support PostgreSQL via `DATABASE_URL`
- Configure CORS for production domains
- Set proper security settings

### 6. Initial Data Setup

After deployment, run migrations and seed data:

```bash
# Via Railway CLI or SSH
python manage.py migrate
python manage.py seed_statistics  # Optional: seed STAT courses
python manage.py createsuperuser  # For admin access
```

## 🔒 Security Checklist

Before going live:

- [ ] Change `SECRET_KEY` to a secure random value
- [ ] Set `DEBUG=False` in production
- [ ] Add your production domain to `ALLOWED_HOSTS`
- [ ] Configure CORS to only allow your frontend domain
- [ ] Use HTTPS (automatic with Railway/Render)
- [ ] Set up database backups
- [ ] Consider adding rate limiting for review submissions

## 🌐 Environment Variables Reference

### Frontend (.env.local or Vercel)
```
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend.railway.app/graphql/
```

### Backend (Railway/Render)
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-backend.railway.app
DATABASE_URL=postgresql://... (auto-provided)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## 📊 Monitoring

- **Railway**: Built-in metrics and logs
- **Vercel**: Built-in analytics
- **Consider**: Sentry for error tracking

## 🐛 Troubleshooting

### CORS Errors
- Make sure `CORS_ALLOWED_ORIGINS` includes your exact frontend URL
- Check that backend URL is correct in frontend env vars

### Database Connection Errors
- Verify `DATABASE_URL` is set correctly
- Check that migrations have run: `python manage.py migrate`

### Reviews Not Saving
- Check backend logs for errors
- Verify GraphQL endpoint is accessible
- Check database connection

## 📝 Post-Deployment

1. Test review submission
2. Verify data persists after refresh
3. Check admin panel access
4. Monitor error logs
5. Set up database backups

---

**Note**: The current setup uses SQLite locally for development, but production should use PostgreSQL for better performance and reliability.

