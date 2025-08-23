# 🚀 Complete Kursor Deployment Guide

## 📋 **Deployment Overview**

This guide covers deploying your Kursor platform with:

- **Frontend**: Next.js app on Vercel
- **Backend**: Microservices on Railway/DigitalOcean
- **Database**: Managed PostgreSQL

---

## 🔧 **Prerequisites**

- [ ] GitHub repository with your code
- [ ] Docker installed locally
- [ ] Railway account (or DigitalOcean/AWS)
- [ ] Domain name (optional)

---

## 📦 **Part 1: Local Docker Testing**

### **1. Setup Environment**

```bash
cd D:\Kursor\kursor-microservices
cp .env.example .env
# Edit .env with your actual values
```

### **2. Build and Run with Docker Compose**

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api-gateway
```

### **3. Test the System**

- **API Gateway**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Health Check**: http://localhost:3000/health

### **4. Stop Services**

```bash
docker-compose down
```

---

## 🌐 **Part 2: Frontend Deployment (Vercel)**

### **Status**: ✅ Already Configured

Your frontend is ready for Vercel deployment!

### **Quick Deploy Steps**:

1. **Push to GitHub**

   ```bash
   cd D:\Kursor\kursor-editor
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Choose the `kursor-editor` folder as root

3. **Set Environment Variables in Vercel**

   ```
   DATABASE_URL=your_production_database_url
   NEXTAUTH_SECRET=your_32_char_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-app.vercel.app`

---

## 🔧 **Part 3: Backend Deployment (Railway)**

### **Option A: Railway (Recommended)**

#### **1. Prepare for Railway**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

#### **2. Create Railway Project**

```bash
cd D:\Kursor\kursor-microservices
railway new
```

#### **3. Deploy Database**

```bash
# Add PostgreSQL service
railway add postgresql
```

#### **4. Deploy Services**

Deploy each service individually:

```bash
# Deploy API Gateway
cd api-gateway
railway up --service api-gateway

# Deploy User Service
cd ../services/user-service
railway up --service user-service

# Deploy Snippet Service
cd ../snippet-service
railway up --service snippet-service

# Deploy Execution Service
cd ../execution-service
railway up --service execution-service

# Deploy Communication Service
cd ../communication-service
railway up --service communication-service
```

#### **5. Configure Environment Variables**

Set in Railway dashboard for each service:

- Database URLs
- API keys
- Service URLs
- JWT secrets

### **Option B: DigitalOcean App Platform**

#### **1. Create App**

- Go to DigitalOcean Apps
- Connect your GitHub repository

#### **2. Configure Services**

Create separate apps for each service:

- API Gateway
- User Service
- Snippet Service
- Execution Service
- Communication Service

#### **3. Database**

- Create managed PostgreSQL database
- Connect to services via environment variables

---

## 🔐 **Part 4: Production Configuration**

### **1. Environment Variables**

#### **Frontend (.env.local)**

```env
DATABASE_URL=postgresql://user:pass@host:port/db
NEXTAUTH_SECRET=your_32_character_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
NEXTAUTH_URL=https://your-domain.com
```

#### **Backend Services**

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# JWT
JWT_SECRET=your_jwt_secret_key

# API Keys
RAPIDAPI_KEY=your_judge0_api_key
RESEND_API_KEY=your_resend_api_key

# Service URLs (update with your deployed URLs)
EXECUTION_SERVICE_URL=https://execution.railway.app
COMMUNICATION_SERVICE_URL=https://communication.railway.app
SNIPPET_SERVICE_URL=https://snippets.railway.app
USER_SERVICE_URL=https://users.railway.app
```

### **2. Domain Configuration**

#### **Frontend Domain**

- Add custom domain in Vercel dashboard
- Update `NEXTAUTH_URL` environment variable

#### **Backend Domain**

- Configure custom domains for each service
- Update service URLs in API Gateway

---

## 📊 **Part 5: Monitoring & Maintenance**

### **1. Health Monitoring**

- Use the dashboard: `https://your-gateway.railway.app/dashboard`
- Set up uptime monitoring (UptimeRobot, Pingdom)

### **2. Logs**

```bash
# Railway logs
railway logs --service api-gateway

# Docker logs
docker-compose logs -f service-name
```

### **3. Scaling**

- **Railway**: Auto-scaling available
- **DigitalOcean**: Manual scaling in dashboard
- **AWS**: Auto-scaling groups

---

## 🔄 **Part 6: CI/CD Pipeline**

### **GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up
```

---

## 🎯 **Deployment Checklist**

### **Pre-Deployment**

- [ ] All environment variables configured
- [ ] Docker containers tested locally
- [ ] Database migrations ready
- [ ] SSL certificates configured
- [ ] Domain names purchased and configured

### **Frontend Deployment**

- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] Google OAuth configured with production URLs

### **Backend Deployment**

- [ ] Railway/DO project created
- [ ] Database service deployed
- [ ] All microservices deployed
- [ ] Environment variables configured
- [ ] Service URLs updated in API Gateway
- [ ] Health checks passing

### **Post-Deployment**

- [ ] Frontend connects to backend successfully
- [ ] All features working (auth, code execution, snippets)
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Performance optimization

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **CORS Errors**

- Update CORS_ORIGIN in services
- Check service URLs in API Gateway

#### **Database Connection**

- Verify DATABASE_URL format
- Check network connectivity
- Ensure database migrations ran

#### **Service Discovery**

- Check health endpoints
- Verify service URLs
- Check environment variables

### **Debug Commands**

```bash
# Check service health
curl https://your-gateway.railway.app/health

# Check specific service
curl https://your-gateway.railway.app/services

# Check logs
railway logs --service api-gateway
```

---

## 🎉 **Success!**

Your Kursor platform should now be fully deployed with:

- ✅ Scalable microservice architecture
- ✅ Production-ready frontend
- ✅ Managed database
- ✅ SSL/TLS security
- ✅ Monitoring and health checks
- ✅ CI/CD pipeline

**Your deployed URLs:**

- **Frontend**: `https://your-app.vercel.app`
- **API Gateway**: `https://your-gateway.railway.app`
- **Dashboard**: `https://your-gateway.railway.app/dashboard`
