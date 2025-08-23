# 🆓 FREE Deployment Guide - Step by Step

## 🎯 **Free Deployment Strategy**

- **Frontend**: Vercel (Free)
- **Database**: Neon PostgreSQL (Free - 0.5GB)
- **Backend**: Railway (Free $5 credit monthly)

---

## 📋 **Step 1: Setup Free Database**

### **Option A: Neon (Recommended)**

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create project "kursor-db"
4. Copy connection string
5. Run the SQL schema from `FREE_DATABASE_SETUP.md`

### **Option B: PlanetScale (Alternative)**

1. Go to https://planetscale.com
2. Sign up for free
3. Create database "kursor"
4. Get connection string

**Save your DATABASE_URL** - you'll need it!

---

## 🔑 **Step 2: Get Free API Keys**

### **Judge0 API (FREE - 50 requests/day)**

1. Go to https://rapidapi.com/judge0-official/api/judge0-ce
2. Subscribe to FREE plan
3. Copy your X-RapidAPI-Key

### **Resend Email (FREE - 100 emails/month)**

1. Go to https://resend.com
2. Sign up for free
3. Create API key
4. Copy key (starts with re\_...)

### **Google OAuth (FREE)**

1. Go to https://console.cloud.google.com
2. Create project "Kursor"
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add domains:
   - Development: http://localhost:3005
   - Production: https://your-app.vercel.app

---

## 🌐 **Step 3: Deploy Frontend (Vercel)**

### **3.1: Prepare Repository**

```powershell
cd D:\Kursor
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### **3.2: Deploy to Vercel**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Select `kursor-editor` as root directory
6. Click "Deploy"

### **3.3: Add Environment Variables**

In Vercel dashboard → Settings → Environment Variables:

```env
DATABASE_URL=your_neon_database_url
NEXTAUTH_SECRET=your_32_char_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=https://your-app.vercel.app
```

---

## 🔧 **Step 4: Deploy Backend (Railway)**

### **4.1: Install Railway CLI**

```powershell
npm install -g @railway/cli
```

### **4.2: Deploy Services**

#### **Deploy API Gateway**

```powershell
cd D:\Kursor\kursor-microservices\api-gateway
railway login
railway init  # Create project
railway up     # Deploy
```

#### **Deploy Other Services**

```powershell
# User Service
cd ../services/user-service
railway service create user-service
railway up

# Snippet Service
cd ../snippet-service
railway service create snippet-service
railway up

# Execution Service
cd ../execution-service
railway service create execution-service
railway up

# Communication Service
cd ../communication-service
railway service create communication-service
railway up
```

### **4.3: Set Environment Variables**

For each service in Railway dashboard:

**API Gateway:**

```env
PORT=3000
EXECUTION_SERVICE_URL=https://execution-service.railway.app
COMMUNICATION_SERVICE_URL=https://communication-service.railway.app
SNIPPET_SERVICE_URL=https://snippet-service.railway.app
USER_SERVICE_URL=https://user-service.railway.app
```

**User Service:**

```env
PORT=3004
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

**Snippet Service:**

```env
PORT=3003
DATABASE_URL=your_database_url
```

**Execution Service:**

```env
PORT=3001
RAPIDAPI_KEY=your_judge0_key
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
```

**Communication Service:**

```env
PORT=3002
RESEND_API_KEY=your_resend_key
ADMIN_EMAIL=your_email@gmail.com
```

---

## 🔗 **Step 5: Connect Frontend to Backend**

Update your frontend API calls to use Railway URLs:

1. In `kursor-editor`, update API base URL
2. Point to your Railway API Gateway URL
3. Test the connection

---

## ✅ **Step 6: Test Deployment**

### **Frontend Tests:**

- [ ] Website loads at https://your-app.vercel.app
- [ ] User can register/login
- [ ] Google OAuth works

### **Backend Tests:**

- [ ] API Gateway health: https://your-gateway.railway.app/health
- [ ] Dashboard: https://your-gateway.railway.app/dashboard
- [ ] All services showing as healthy

---

## 💰 **Free Tier Limits**

### **What You Get FREE:**

- **Vercel**: Unlimited personal projects
- **Neon**: 0.5GB database, 1 project
- **Railway**: $5 credit monthly (~1 service)
- **Judge0**: 50 code executions/day
- **Resend**: 100 emails/month
- **Google OAuth**: Unlimited

### **Upgrade When Needed:**

- **Railway Pro**: $20/month (all services)
- **Vercel Pro**: $20/month (team features)
- **Neon Scale**: $19/month (3GB database)

---

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors**: Update service URLs in API Gateway
2. **Database Connection**: Check DATABASE_URL format
3. **Environment Variables**: Ensure all required vars are set
4. **Service Discovery**: Wait for all services to start

### **Debug Commands:**

```powershell
railway logs              # View deployment logs
railway variables         # Check environment variables
railway status            # Check service status
```

---

## 🎉 **Success!**

Once deployed, you'll have:

- ✅ **Frontend**: https://your-app.vercel.app
- ✅ **API Gateway**: https://your-gateway.railway.app
- ✅ **Dashboard**: https://your-gateway.railway.app/dashboard
- ✅ **Full microservice architecture running in the cloud!**

**Total Monthly Cost: $0 - $5** (within free tiers) 🎊
