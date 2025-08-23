# 🔑 Free API Keys Setup Guide

## 1. Judge0 API (Code Execution) - FREE

1. Go to https://rapidapi.com/judge0-official/api/judge0-ce
2. Sign up for free account
3. Subscribe to FREE plan (50 requests/day)
4. Copy your API key from "X-RapidAPI-Key"

## 2. Resend API (Email) - FREE

1. Go to https://resend.com
2. Sign up for free account (100 emails/month)
3. Go to API Keys section
4. Create new API key
5. Copy the key (starts with re\_...)

## 3. Google OAuth (Frontend Auth) - FREE

1. Go to https://console.cloud.google.com
2. Create new project: "Kursor"
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized origins:
   - http://localhost:3005 (development)
   - https://your-app.vercel.app (production)
6. Add redirect URIs:
   - http://localhost:3005/api/auth/callback/google
   - https://your-app.vercel.app/api/auth/callback/google
7. Copy Client ID and Client Secret

## 4. Generate JWT Secret

Run this in PowerShell:

```powershell
[System.Web.Security.Membership]::GeneratePassword(32, 0)
```

Or use online generator: https://generate-secret.vercel.app/32

## 5. Environment Variables Template

Save these for deployment:

```env
# Database
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# API Keys
RAPIDAPI_KEY=your_judge0_api_key_here
RESEND_API_KEY=re_your_resend_key_here

# JWT
JWT_SECRET=your_32_character_secret_here

# Email
ADMIN_EMAIL=your_email@gmail.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_SECRET=your_32_character_secret_here
NEXTAUTH_URL=https://your-app.vercel.app
```

💡 **Tip**: Keep these values safe - you'll need them for deployment!
