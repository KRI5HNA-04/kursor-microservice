# 🚀 How to Run the Kursor Microservice Project

This guide will walk you through running the complete microservice architecture for the Kursor platform.

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js** (v16 or higher)
- **PostgreSQL** database running
- **Git** for version control
- **PowerShell** or Command Prompt (Windows)

## 🏗️ Project Structure

```
kursor-microservices/
├── api-gateway/           # Main entry point (Port 3000)
├── services/
│   ├── execution-service/     # Code execution (Port 3001)
│   ├── communication-service/ # Email & notifications (Port 3002)
│   ├── snippet-service/       # Code snippets CRUD (Port 3003)
│   └── user-service/          # Authentication & users (Port 3004)
└── RUN_PROJECT.md        # This file
```

## ⚡ Quick Start (All Services)

### Option 1: Run All Services at Once

```powershell
# Navigate to project root
cd D:\Kursor\kursor-microservices

# Run the startup script
.\start-all-services.ps1
```

### Option 2: Manual Service Startup (Recommended for Development)

Open **5 separate PowerShell terminals** and run each service:

#### Terminal 1: Execution Service (Port 3001)

```powershell
cd D:\Kursor\kursor-microservices\services\execution-service
npm start
```

#### Terminal 2: Communication Service (Port 3002)

```powershell
cd D:\Kursor\kursor-microservices\services\communication-service
npm start
```

#### Terminal 3: Snippet Service (Port 3003)

```powershell
cd D:\Kursor\kursor-microservices\services\snippet-service
npm start
```

#### Terminal 4: User Service (Port 3004)

```powershell
cd D:\Kursor\kursor-microservices\services\user-service
npm start
```

#### Terminal 5: API Gateway (Port 3000)

```powershell
cd D:\Kursor\kursor-microservices\api-gateway
npm start
```

## 🔧 Service Configuration

### Environment Variables

Each service requires specific environment variables. Check each service's `.env` file:

#### Execution Service (.env)

```env
PORT=3001
RAPIDAPI_KEY=your_judge0_api_key
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
CORS_ORIGIN=http://localhost:3000
```

#### Communication Service (.env)

```env
PORT=3002
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_admin_email@domain.com
```

#### Snippet Service (.env)

```env
PORT=3003
DATABASE_URL=your_postgresql_connection_string
```

#### User Service (.env)

```env
PORT=3004
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
```

#### API Gateway (.env)

```env
PORT=3000
EXECUTION_SERVICE_URL=http://localhost:3001
COMMUNICATION_SERVICE_URL=http://localhost:3002
SNIPPET_SERVICE_URL=http://localhost:3003
USER_SERVICE_URL=http://localhost:3004
```

## 📊 Service Health Check

Once all services are running, verify their status:

### Individual Service Health Checks

```powershell
# Execution Service
curl http://localhost:3001/health

# Communication Service
curl http://localhost:3002/health

# Snippet Service
curl http://localhost:3003/health

# User Service
curl http://localhost:3004/health

# API Gateway (shows all services)
curl http://localhost:3000/health
```

### Gateway Dashboard

Visit: http://localhost:3000/dashboard for a complete service overview.

## 🧪 Testing the System

### Option 1: Interactive Web Interface

Open the comprehensive testing console:

- **File**: `D:\Kursor\kursor-microservices\api-gateway\test.html`
- **Browser**: Open in Chrome/Firefox
- **Features**: Test all services through a unified interface

### Option 2: API Testing with curl/Postman

#### User Registration & Authentication

```powershell
# Register a new user
curl -X POST http://localhost:3000/auth/register `
  -H "Content-Type: application/json" `
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Code Execution

```powershell
curl -X POST http://localhost:3000/execute `
  -H "Content-Type: application/json" `
  -d '{"language":"javascript","code":"console.log(\"Hello World!\");"}'
```

#### Contact Form

```powershell
curl -X POST http://localhost:3000/contact `
  -H "Content-Type: application/json" `
  -d '{"name":"John Doe","email":"john@example.com","subject":"Test","message":"Hello!"}'
```

## 🛠️ Troubleshooting

### Common Issues

#### Service Won't Start

1. **Port Already in Use**

   ```powershell
   # Check what's using the port
   netstat -ano | findstr :3001

   # Kill the process (replace PID)
   taskkill /PID <process_id> /F
   ```

2. **Missing Dependencies**

   ```powershell
   # Install dependencies for each service
   cd service-directory
   npm install
   ```

3. **Database Connection Issues**

   - Ensure PostgreSQL is running
   - Check `DATABASE_URL` in `.env` files
   - Run database migrations:

   ```powershell
   cd services/user-service
   npx prisma migrate dev

   cd ../snippet-service
   npx prisma migrate dev
   ```

#### Environment Variables

1. **Missing API Keys**

   - Get Judge0 API key from RapidAPI
   - Get Resend API key from Resend.com
   - Update respective `.env` files

2. **Invalid Database URL**
   ```env
   # PostgreSQL format
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```

### Service Dependencies

Start services in this order:

1. **Database** (PostgreSQL)
2. **User Service** (authentication required by gateway)
3. **Other Services** (can start in parallel)
4. **API Gateway** (last, as it depends on all others)

## 📱 Frontend Integration

To connect your Next.js frontend to the microservices:

1. **Update API calls** to use `http://localhost:3000` (API Gateway)
2. **Authentication**: Use JWT tokens from `/auth/login`
3. **CORS**: Gateway handles cross-origin requests

Example frontend API call:

```javascript
// Instead of direct service calls
const response = await fetch("http://localhost:3000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

## 🔄 Development Workflow

### Making Changes

1. **Edit service code** in respective directories
2. **Restart specific service** to see changes
3. **Test through API Gateway** at `http://localhost:3000`

### Adding New Endpoints

1. **Add to service** (e.g., in `snippet-service/index.js`)
2. **Update API Gateway routing** if needed
3. **Test through gateway**

### Database Changes

```powershell
# For services using Prisma
cd services/user-service  # or snippet-service
npx prisma migrate dev --name describe_your_change
npx prisma generate
```

## 🚀 Production Deployment

### Docker (Future Enhancement)

Each service can be containerized:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup

- Set `NODE_ENV=production`
- Use environment-specific `.env` files
- Configure proper database URLs
- Set up monitoring and logging

## 📊 Monitoring

### Service Status

- **Gateway Dashboard**: http://localhost:3000/dashboard
- **Individual Health**: Each service has `/health` endpoint
- **Logs**: Check terminal outputs for each service

### Performance

- **Response Times**: Logged in gateway terminal
- **Error Rates**: Check service logs
- **Resource Usage**: Monitor with system tools

## 🎯 Success Indicators

Your system is running correctly when:

- ✅ All 5 services start without errors
- ✅ Gateway health check shows all services "up"
- ✅ You can register/login users
- ✅ Code execution works
- ✅ Snippet CRUD operations succeed
- ✅ Contact emails send successfully
- ✅ Interactive test console loads and functions

## 💡 Tips

1. **Keep terminals open** to monitor logs
2. **Use the test console** for easy debugging
3. **Check gateway logs** for request routing
4. **Restart services** individually when making changes
5. **Use health endpoints** to verify service status

---

🎊 **Congratulations!** You now have a fully functional microservice architecture running locally. The API Gateway at `http://localhost:3000` serves as your unified entry point to all services.
