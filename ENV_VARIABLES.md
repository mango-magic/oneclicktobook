# Environment Variables for Production

When deploying to Vercel, set these environment variables in your Vercel dashboard:

## Required Variables

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://oneclicktobook.me/api/auth/google/callback

# App Configuration
PORT=3000
WEB_BASE_URL=https://oneclicktobook.me
APP_BASE_URL=https://oneclicktobook.me

# Security - GENERATE A SECURE SECRET!
JWT_SECRET=your-super-secure-production-jwt-secret-change-this
```

## Optional Variables

```bash
# Microsoft OAuth (if you want Microsoft Calendar support)
MS_CLIENT_ID=your_microsoft_client_id
MS_CLIENT_SECRET=your_microsoft_client_secret
MS_TENANT_ID=common
MS_REDIRECT_URI=https://oneclicktobook.me/api/auth/microsoft/callback

# Database (if you add database later)
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url

# Video Provider
VIDEO_PROVIDER=meet
```

## Google Cloud Console Setup

1. Update your OAuth client with production URLs:
   - **Authorized JavaScript origins:** `https://oneclicktobook.me`
   - **Authorized redirect URIs:** `https://oneclicktobook.me/api/auth/google/callback`

2. Add these scopes in OAuth consent screen:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `../auth/calendar.readonly`
   - `../auth/calendar.events`

3. Add your email as a test user (while app is in development mode)
