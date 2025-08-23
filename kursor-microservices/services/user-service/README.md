# User Service

## Overview

The User Service handles all authentication and user profile management for the Kursor platform, providing JWT-based authentication, user registration, login, and profile operations.

## Features

- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- User profile management
- Password change functionality
- User search capabilities
- Token validation for inter-service communication

## API Endpoints

### Health Check

```
GET /health
```

Returns service health status and database connection.

### Authentication Endpoints

#### User Registration

```
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "J"
  },
  "token": "jwt_token_here"
}
```

#### User Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Token Validation

```
POST /auth/validate
Content-Type: application/json

{
  "token": "jwt_token_here"
}
```

#### Change Password

```
POST /auth/change-password
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Profile Endpoints

#### Get User Profile

```
GET /profile
Authorization: Bearer {jwt_token}
```

**Response:**

```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "image": "profile_image_url",
  "mobile": "+1234567890",
  "bio": "Software developer",
  "githubUrl": "https://github.com/johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "snippetCount": 15
}
```

#### Update User Profile

```
PUT /profile
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "John Smith",
  "bio": "Full-stack developer",
  "githubUrl": "https://github.com/johnsmith",
  "linkedinUrl": "https://linkedin.com/in/johnsmith",
  "mobile": "+1234567890"
}
```

### User Management Endpoints

#### Get User by ID

```
GET /users/:id
```

#### Search Users

```
GET /users?search=john&page=1&limit=10
Authorization: Bearer {jwt_token}
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
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3004
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

## JWT Token Structure

The service generates JWT tokens with the following payload:

```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "iat": 1640995200,
  "exp": 1641600000
}
```

Tokens expire after 7 days by default.

## Authentication Flow

1. **Registration**: User creates account with email/password
2. **Login**: User authenticates with credentials
3. **Token**: Service returns JWT token
4. **Authorization**: Include token in `Authorization: Bearer {token}` header
5. **Validation**: Other services can validate tokens via `/auth/validate`

## Database Schema

The service uses the existing Prisma schema with the `User` model:

```prisma
model User {
  id             String   @id @default(cuid())
  name           String?
  email          String?  @unique
  emailVerified  DateTime?
  image          String?
  password       String?
  mobile         String?
  bio            String?
  githubUrl      String?
  linkedinUrl    String?
  accounts       Account[]
  sessions       Session[]
  savedCodes     SavedCode[]
}
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Token expiration (7 days)
- Input validation and sanitization
- CORS protection
- Helmet security middleware

## Testing

```bash
# Test health endpoint
curl http://localhost:3004/health

# Register a user
curl -X POST http://localhost:3004/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login user
curl -X POST http://localhost:3004/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get profile (use token from login response)
curl -X GET http://localhost:3004/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Integration with Other Services

### For other microservices to authenticate users:

```javascript
// Validate user token
const response = await fetch("http://localhost:3004/auth/validate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ token: userToken }),
});

const { valid, user } = await response.json();
if (valid) {
  // User is authenticated, use user.userId
}
```

### Frontend Integration:

```javascript
// Login user
const loginResponse = await fetch("http://localhost:3004/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

const { token, user } = await loginResponse.json();

// Store token for future requests
localStorage.setItem("authToken", token);

// Use token in subsequent requests
const profileResponse = await fetch("http://localhost:3004/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Error Handling

The service returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (invalid/expired token)
- `404` - Not Found
- `409` - Conflict (user already exists)
- `500` - Internal Server Error

Error responses include detailed messages in development mode.
