# Snippet Service

## Overview

The Snippet Service handles all code snippet storage and retrieval operations for the Kursor platform, providing full CRUD functionality with search and pagination.

## Features

- Complete CRUD operations for code snippets
- User-based snippet isolation
- Search functionality (title and language)
- Pagination support
- Language-based filtering
- User statistics (snippet counts, language distribution)
- Database integration with Prisma

## API Endpoints

### Health Check

```
GET /health
```

Returns service health status and database connection.

### List User Snippets

```
GET /snippets?page=1&limit=10&search=javascript
Authorization: Bearer {userId}
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title and language

**Response:**

```json
{
  "snippets": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Single Snippet

```
GET /snippets/:id
Authorization: Bearer {userId}
```

### Create Snippet

```
POST /snippets
Authorization: Bearer {userId}
Content-Type: application/json

{
  "title": "Quick Sort Algorithm",
  "code": "function quickSort(arr) { ... }",
  "language": "javascript"
}
```

### Update Snippet

```
PUT /snippets/:id
Authorization: Bearer {userId}
Content-Type: application/json

{
  "title": "Updated title",
  "code": "updated code",
  "language": "javascript"
}
```

### Delete Snippet

```
DELETE /snippets/:id
Authorization: Bearer {userId}
```

### Get Snippets by Language

```
GET /snippets/language/:language?page=1&limit=10
Authorization: Bearer {userId}
```

### Get User Statistics

```
GET /stats
Authorization: Bearer {userId}
```

**Response:**

```json
{
  "totalSnippets": 25,
  "languageStats": [
    { "language": "javascript", "count": 10 },
    { "language": "python", "count": 8 }
  ],
  "recentSnippets": [...]
}
```

### Service Info

```
GET /info
```

Returns service information and available endpoints.

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/kursor_db"
PORT=3003
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Running the Service

```bash
# Development
npm start

# Production
NODE_ENV=production npm start
```

## Authentication

The service expects a simplified authentication header:

```
Authorization: Bearer {userId}
```

**Note:** In production, this should be replaced with proper JWT token validation.

## Database Schema

The service uses the existing Prisma schema with the `SavedCode` model:

```prisma
model SavedCode {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  code      String
  language  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Testing

```bash
# Test health endpoint
curl http://localhost:3003/health

# Test with user authorization
curl -X GET http://localhost:3003/snippets \
  -H "Authorization: Bearer user123"

# Create a snippet
curl -X POST http://localhost:3003/snippets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer user123" \
  -d '{
    "title": "Hello World",
    "code": "console.log(\"Hello World!\");",
    "language": "javascript"
  }'
```

## Integration with Frontend

Update your frontend to use this microservice:

```javascript
// Get user snippets
const response = await fetch("http://localhost:3003/snippets", {
  headers: {
    Authorization: `Bearer ${userId}`,
    "Content-Type": "application/json",
  },
});

// Create snippet
const newSnippet = await fetch("http://localhost:3003/snippets", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${userId}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "My Snippet",
    code: "const x = 1;",
    language: "javascript",
  }),
});
```

## Error Handling

The service returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses include detailed messages in development mode.
