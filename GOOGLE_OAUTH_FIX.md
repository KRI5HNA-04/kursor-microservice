# 🔧 GOOGLE OAUTH REDIRECT URI FIX

## 🚨 Issue: `redirect_uri_mismatch`

**Error 400**: The redirect URI in the request doesn't match the one configured in Google Cloud Console.

## ✅ STEP-BY-STEP FIX:

### Step 1: Find Your Current Vercel URL

1. Go to your Vercel dashboard
2. Find your deployed app URL (should be something like `https://kursor-microservice-xxx.vercel.app`)
3. Copy this exact URL

### Step 2: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID: `644344297864-hglv6te0cfbn2d6i5nestb0q9kashfra.apps.googleusercontent.com`
4. Click **Edit**
5. In **Authorized redirect URIs**, add these URIs:
   ```
   https://YOUR-VERCEL-URL/api/auth/callback/google
   https://kursor-microservice.vercel.app/api/auth/callback/google
   https://kursor-microservice-xxx.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
   (Replace `YOUR-VERCEL-URL` with your actual Vercel URL)

### Step 3: Update Vercel Environment Variables

1. Go to your Vercel project settings
2. **Environment Variables** → Update:
   ```
   NEXTAUTH_URL=https://YOUR-ACTUAL-VERCEL-URL
   ```
   (Use the exact URL from Step 1)

### Step 4: Redeploy

1. After updating environment variables
2. Go to **Deployments** → **Redeploy**

## 🎯 Quick Fix Commands:

If you know your Vercel URL, I can update the local env file:

```bash
# Replace with your actual Vercel URL
NEXTAUTH_URL=https://your-actual-vercel-app-url.vercel.app
```

## 🔍 Common Vercel URL Patterns:

- `https://kursor-microservice.vercel.app`
- `https://kursor-microservice-git-main-username.vercel.app`
- `https://kursor-microservice-xxx.vercel.app`

## ⚡ Alternative: Use Environment-Based URLs

Update your NextAuth config to handle multiple environments automatically.

**Tell me your exact Vercel URL and I'll update the configuration for you!** 🚀
