# API Gateway - Microservice Orchestration

## Overview

The API Gateway serves as the unified entry point for all microservices in the Kursor platform. It provides service discovery, authentication middleware, request routing, and centralized monitoring.

## Architecture

```
Client Requests
     ↓
API Gateway (Port 3000)
     ├── Authentication Middleware (JWT validation)
     ├── Service Discovery & Health Monitoring
     └── Request Routing:
         ├── /auth/* → User Service (Port 3004)
         ├── /snippets/* → Snippet Service (Port 3003)
         ├── /execute → Execution Service (Port 3001)
         └── /contact → Communication Service (Port 3002)
```

## Features

### 🔐 Authentication Middleware

- JWT token validation for protected routes
- Integration with User Service for token verification
- Automatic token forwarding to downstream services

### 🌐 Service Discovery

- Real-time health monitoring of all microservices
- Automatic service registration and discovery
- Circuit breaker pattern for failed services

### 🚦 Request Routing

- Intelligent proxy routing based on URL patterns
- Load balancing capabilities (ready for horizontal scaling)
- Request/response transformation and logging

### 📊 Monitoring & Analytics

- Centralized logging with Morgan middleware
- Service health dashboard
- Request metrics and performance monitoring

## API Endpoints

### Gateway Management

- `GET /health` - Gateway health status
- `GET /info` - Gateway configuration details
- `GET /services` - Service discovery information
- `GET /dashboard` - Aggregated service metrics

### Proxied Routes

- `POST /auth/register` → User Service registration
- `POST /auth/login` → User Service authentication
- `GET /auth/profile` → User Service profile (requires JWT)
- `POST /execute` → Code Execution Service
- `GET /snippets` → Snippet Service listing
- `POST /snippets` → Snippet creation (requires JWT)
- `GET /snippets/:id` → Snippet details
- `DELETE /snippets/:id` → Snippet deletion (requires JWT)
- `POST /contact` → Communication Service email

## Configuration

### Environment Variables (.env)

```env
PORT=3000
NODE_ENV=development

# Service URLs
USER_SERVICE_URL=http://localhost:3004
SNIPPET_SERVICE_URL=http://localhost:3003
EXECUTION_SERVICE_URL=http://localhost:3001
COMMUNICATION_SERVICE_URL=http://localhost:3002

# Gateway Settings
GATEWAY_SECRET=your_gateway_secret_key_here
```

## Dependencies

```json
{
  "express": "4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "helmet": "^6.0.1",
  "morgan": "^1.10.0",
  "http-proxy-middleware": "^2.0.6",
  "node-fetch": "^2.7.0"
}
```

## Running the Gateway

### Development Mode

```bash
cd api-gateway
npm install
npm start
```

### Production Mode

```bash
NODE_ENV=production npm start
```

## Testing

### Interactive Web Interface

Open `test.html` in a browser for a comprehensive testing console that allows you to:

- Check gateway health and service discovery
- Test user registration and authentication
- Execute code through the gateway
- Manage code snippets with authentication
- Send contact emails

### Health Check Endpoints

```bash
# Gateway health
curl http://localhost:3000/health

# Service discovery
curl http://localhost:3000/services

# Dashboard metrics
curl http://localhost:3000/dashboard
```

### Authentication Flow Testing

```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Access protected route (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Security Features

### CORS Configuration

- Configurable allowed origins
- Credentials support for authenticated requests
- Pre-flight request handling

### Security Headers (Helmet)

- XSS protection
- Content Security Policy
- HTTPS redirection (production)
- Frame options protection

### Rate Limiting (Future Enhancement)

- Request rate limiting per IP
- Authenticated user rate limiting
- Service-specific rate limits

## Monitoring & Logging

### Request Logging

All requests are logged with:

- Request method and URL
- Response status code
- Response time
- User agent and IP address

### Service Health Monitoring

- Periodic health checks to all microservices
- Service status tracking (online/offline)
- Automatic failover capabilities

### Error Handling

- Centralized error processing
- Service-specific error propagation
- Client-friendly error responses

## Deployment Considerations

### Docker Support (Future)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Load Balancing

- Ready for multiple gateway instances
- Session affinity support
- Health check integration

### Scaling Strategy

- Horizontal scaling with load balancers
- Service mesh integration ready
- Container orchestration support

## Development Notes

### Adding New Services

1. Add service URL to environment configuration
2. Create proxy route in `index.js`
3. Update service discovery endpoint
4. Add health check integration
5. Update documentation

### Authentication Integration

- JWT tokens are validated against User Service
- Failed authentication returns 401 with error details
- Successful authentication forwards user context to services

### Error Handling Strategy

- Gateway errors: 5xx status codes
- Service errors: Forwarded as-is
- Network errors: 503 Service Unavailable
- Authentication errors: 401 Unauthorized

## Testing Scenarios

The gateway has been tested with:

- ✅ Service discovery and health monitoring
- ✅ User registration and authentication flow
- ✅ Code execution through proxy routing
- ✅ Snippet management with JWT protection
- ✅ Contact form email processing
- ✅ CORS handling for browser requests
- ✅ Error propagation and handling

## Performance Metrics

Expected performance characteristics:

- Request latency: < 50ms overhead
- Throughput: 1000+ requests/second
- Memory usage: < 100MB base
- CPU usage: < 5% under normal load

## Future Enhancements

1. **API Versioning**: Support for v1, v2 API routes
2. **Caching Layer**: Redis integration for response caching
3. **Analytics**: Request analytics and user behavior tracking
4. **Rate Limiting**: Advanced rate limiting strategies
5. **Service Mesh**: Istio/Linkerd integration
6. **Monitoring**: Prometheus metrics and Grafana dashboards
