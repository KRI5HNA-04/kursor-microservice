# Code Execution Service

A microservice for executing code using the Judge0 API. This service is extracted from the Kursor monolith as part of the microservice migration.

## Features

- Execute code in multiple languages (JavaScript, Python, C++, Java)
- Asynchronous execution with status checking
- Health monitoring
- Docker support
- TypeScript implementation

## API Endpoints

### Health Check

```
GET /health
```

### Execute Code

```
POST /execute
{
  "code": "console.log('Hello World')",
  "language": "javascript",
  "input": "optional input"
}
```

### Check Execution Status

```
GET /execute/:token
```

### Get Supported Languages

```
GET /languages
```

## Environment Variables

```bash
PORT=3001
NODE_ENV=development
RAPIDAPI_KEY=your_judge0_api_key
ALLOWED_ORIGINS=http://localhost:3000,https://kursor-phi.vercel.app
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Docker

```bash
# Build image
docker build -t execution-service .

# Run container
docker run -p 3001:3001 --env-file .env execution-service
```

## Integration with Gateway

The API Gateway (Next.js frontend) should proxy requests to this service:

```typescript
// In Next.js API route
const response = await fetch(`${process.env.EXECUTION_SERVICE_URL}/execute`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code, language, input }),
});
```
