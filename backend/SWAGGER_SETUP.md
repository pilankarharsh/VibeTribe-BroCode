# Swagger/OpenAPI Setup for Backend-Production

## Overview
This document describes the Swagger/OpenAPI documentation setup for the VibeTribe backend-production environment.

## Dependencies
The following packages are required for Swagger functionality:

```json
{
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.1"
}
```

## Configuration
The Swagger configuration is located in `config/swagger.js` and includes:

- OpenAPI 3.0.3 specification
- Production and local development server URLs
- JWT Bearer token authentication scheme
- Automatic API discovery from route and controller files

## API Documentation
The following API endpoints are documented with OpenAPI specifications:

### Authentication (`/api/auth`)
- `POST /register` - User registration (invite-only)
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /forgot-password` - Password reset request
- `POST /invite-code` - Generate invite code
- `GET /invite-codes` - List user's invite codes
- `DELETE /invite-codes/:code` - Revoke invite code

### Users (`/api/users`)
- `GET /:userId` - Get user profile
- `PATCH /:userId` - Update user profile (including dob and gender)
- `POST /:userId/follow` - Follow user
- `POST /:userId/unfollow` - Unfollow user
- `GET /:userId/followers` - Get user's followers
- `GET /:userId/following` - Get users being followed
- `GET /:userId/posts` - Get user's posts
- `GET /search` - Search users
- `GET /check-username` - Check username availability
- `GET /check-email` - Check email availability

### Posts (`/api/posts`)
- `POST /` - Create post
- `GET /:postId` - Get post by ID
- `DELETE /:postId` - Delete post
- `PATCH /:postId` - Edit post caption
- `POST /:postId/like` - Like post
- `POST /:postId/unlike` - Unlike post
- `GET /:postId/likes` - Get post likes
- `POST /:postId/report` - Report post

### Comments (`/api/posts/:postId/comments`)
- `POST /` - Add comment to post
- `GET /` - Get post comments

### Comments Management (`/api/comments`)
- `DELETE /:commentId` - Delete comment
- `PATCH /:commentId` - Edit comment

### Feed (`/api/feed`)
- `GET /home` - Get home feed (followed users)
- `GET /explore` - Get explore feed

### Account (`/api/account`)
- `POST /change-password` - Change password
- `DELETE /` - Delete account

## Accessing the Documentation
Once the server is running, the Swagger UI is available at:

```
http://localhost:5000/api-docs
```

## Features
- **Interactive Documentation**: Test API endpoints directly from the browser
- **Authentication Support**: JWT Bearer token authentication
- **Request/Response Examples**: Detailed schema definitions
- **Error Handling**: Comprehensive error response documentation
- **Security**: Proper security scheme documentation for protected endpoints

## Notes
- All authenticated endpoints require a valid JWT token in the Authorization header
- The documentation automatically includes the new `dob` and `gender` fields for user profiles
- Production server URLs are configured for deployment
- Local development URLs are included for testing
