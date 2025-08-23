# 🔑 Environment Variables Setup Guide

## 📋 Quick Setup for Your Kursor Project

Since your **Railway backend is already working** at https://kursor-micro-production.up.railway.app, here's how to fill the `.env` file:

## 🎯 For Local Development (.env file):

Copy `kursor-microservices/.env.example` to `kursor-microservices/.env` and fill with these values:

### 1. Database Configuration ✅ (Already Working on Railway)

```bash
# Use Railway's PostgreSQL (already connected)
DATABASE_URL=postgresql://postgres:gOGXzTdwXkOGwQDcfmYXeUBloeiJSWzs@crossover.proxy.rlwy.net:20918/railway

# For local Docker (optional)
POSTGRES_DB=kursor
POSTGRES_USER=kursor_user
POSTGRES_PASSWORD=your_strong_password_here
```

### 2. API Keys (Free Services)

#### Judge0 API (Code Execution) - FREE

```bash
RAPIDAPI_KEY=ef874a8b4dmshcdfecbc011ffb05p18cb01jsnf184c8c44f9b
```

**How to get it:**

1. Go to [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Sign up (free)
3. Subscribe to FREE plan (50 requests/day)
4. Copy the API key

#### Resend API (Email Service) - FREE

```bash
RESEND_API_KEY=re_XQCA9Zj9_P1ARKbHohmkjvtjY6G542k1q
```

**How to get it:**

1. Go to [Resend.com](https://resend.com)
2. Sign up (free)
3. Create API key (100 emails/month free)

### 3. Security Keys

```bash
# Generate a random 32+ character string
JWT_SECRET=kursor_super_secret_jwt_key_2024_your_random_string_here

# Another random string for gateway
GATEWAY_SECRET=kursor_gateway_secret_2024_another_random_string
```

### 4. Email Configuration

```bash
ADMIN_EMAIL=your-email@gmail.com
```

### 5. Service URLs (For Local Development)

```bash
# Keep these for local Docker setup
EXECUTION_SERVICE_URL=http://localhost:3001
COMMUNICATION_SERVICE_URL=http://localhost:3002
SNIPPET_SERVICE_URL=http://localhost:3003
USER_SERVICE_URL=http://localhost:3004
```

## 🌐 For Vercel Frontend (.env.local):

Create `kursor-editor/.env.local` with:

```bash
# Database (same as Railway)
DATABASE_URL=postgresql://postgres:gOGXzTdwXkOGwQDcfmYXeUBloeiJSWzs@crossover.proxy.rlwy.net:20918/railway

# NextAuth Configuration
NEXTAUTH_SECRET=kursor_nextauth_secret_2024_random_string
NEXTAUTH_URL=https://your-app.vercel.app

# Backend API
NEXT_PUBLIC_API_URL=https://kursor-micro-production.up.railway.app

# OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret

# Email
RESEND_API_KEY=re_your_resend_key_here
```

## 🚀 Quick Commands:

### Create local .env file:

```bash
cd D:\Kursor\kursor-microservices
Copy-Item .env.example .env
# Then edit .env with your values
```

### Create frontend .env.local:

```bash
cd D:\Kursor\kursor-editor
# Create .env.local with the frontend values above
```

## 🎯 Priority Order:

1. **DATABASE_URL** ✅ (Already have this!)
2. **JWT_SECRET** (Generate random string)
3. **RAPIDAPI_KEY** (For code execution - Judge0)
4. **RESEND_API_KEY** (For emails)
5. **NEXTAUTH_SECRET** (For frontend auth)

## 💡 Pro Tip:

Your Railway backend is already working without most of these! The main ones you need are:

- Database URL ✅ (already have)
- JWT_SECRET (make up a long random string)
- API keys (optional for full features)

**Start with JWT_SECRET and you can test locally right away!** 🚀
