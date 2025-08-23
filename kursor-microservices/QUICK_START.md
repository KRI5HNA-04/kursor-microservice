# 🚀 QUICK START GUIDE - Kursor Microservices

## ✅ Current Status: ALL SERVICES RUNNING!

Your microservice architecture is now fully operational:

### 🌐 Running Services:

- ✅ **Execution Service** (Port 3001) - Code execution
- ✅ **Communication Service** (Port 3002) - Email & notifications
- ✅ **Snippet Service** (Port 3003) - Code snippet management
- ✅ **User Service** (Port 3004) - Authentication & user profiles
- ✅ **API Gateway** (Port 3000) - Unified entry point

## 🎯 How to Access Your System

### 1. Main Entry Point

**API Gateway**: http://localhost:3000

- All requests should go through this unified endpoint
- Handles authentication and routing to appropriate services

### 2. Interactive Testing Console

**Open in Browser**: `D:\Kursor\kursor-microservices\api-gateway\test.html`

- Complete web interface to test all services
- User registration/login
- Code execution
- Snippet management
- Contact form testing

### 3. Health Dashboard

**Visit**: http://localhost:3000/dashboard

- Shows status of all microservices
- Real-time health monitoring

## 🔧 Basic Usage Examples

### Register a New User

```powershell
curl -X POST http://localhost:3000/auth/register `
  -H "Content-Type: application/json" `
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login & Get Token

```powershell
curl -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'
```

### Execute Code

```powershell
curl -X POST http://localhost:3000/execute `
  -H "Content-Type: application/json" `
  -d '{"language":"javascript","code":"console.log(\"Hello World!\");"}'
```

### Send Contact Email

```powershell
curl -X POST http://localhost:3000/contact `
  -H "Content-Type: application/json" `
  -d '{"name":"John","email":"john@example.com","subject":"Test","message":"Hello!"}'
```

## 🔄 Managing Services

### To Stop All Services:

Press `Ctrl+C` in each terminal window where services are running.

### To Restart a Single Service:

1. Stop the service (`Ctrl+C` in its terminal)
2. Restart with:

```powershell
cd D:\Kursor\kursor-microservices\services\[service-name]
node index.js
```

### To Start All Services Again:

Run these commands in separate terminals:

```powershell
# Terminal 1: Execution Service
cd D:\Kursor\kursor-microservices\services\execution-service
node index.js

# Terminal 2: Communication Service
cd D:\Kursor\kursor-microservices\services\communication-service
node index.js

# Terminal 3: Snippet Service
cd D:\Kursor\kursor-microservices\services\snippet-service
node index.js

# Terminal 4: User Service
cd D:\Kursor\kursor-microservices\services\user-service
node index.js

# Terminal 5: API Gateway
cd D:\Kursor\kursor-microservices\api-gateway
node index.js
```

## 🎉 Success! Your Microservice Architecture is Live

Your monolithic Next.js application has been successfully transformed into a scalable microservice architecture with:

- **Service Isolation**: Each service runs independently
- **Unified API Gateway**: Single entry point for all operations
- **Authentication**: JWT-based security across services
- **Real-time Monitoring**: Health checks and service discovery
- **Interactive Testing**: Web-based testing console
- **Production Ready**: Fully operational microservice ecosystem

## 🔗 Next Steps

1. **Test the System**: Use the interactive test console (`test.html`)
2. **Integrate Frontend**: Update your Next.js app to use `http://localhost:3000`
3. **Monitor Services**: Check the dashboard for service health
4. **Scale as Needed**: Each service can be scaled independently

Your microservice migration is complete and fully operational! 🎊
