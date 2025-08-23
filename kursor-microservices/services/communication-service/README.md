# Communication Service

## Overview

The Communication Service handles all email-related functionality for the Kursor platform, including contact forms and notifications.

## Features

- Contact form processing with Resend API
- Email notifications system
- Input validation and error handling
- Health monitoring endpoints

## API Endpoints

### Health Check

```
GET /health
```

Returns service health status.

### Contact Form

```
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello from the contact form!"
}
```

**Response:**

```json
{
  "success": true,
  "messageId": "resend_message_id",
  "message": "Your message has been sent successfully!"
}
```

### Send Notification

```
POST /notify
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Welcome to Kursor",
  "message": "Thank you for joining our platform!",
  "type": "welcome"
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
RESEND_API_KEY=your_resend_api_key_here
CONTACT_ADMIN_EMAIL=your_admin_email@example.com
PORT=3002
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

## Testing

```bash
# Test health endpoint
curl http://localhost:3002/health

# Test contact form
curl -X POST http://localhost:3002/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
```

## Integration with Frontend

Update your frontend contact form to use this microservice:

```javascript
const response = await fetch("http://localhost:3002/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name,
    email,
    message,
  }),
});
```

## Error Handling

The service returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors)
- `500` - Internal Server Error

Error responses include detailed messages in development mode.
