# API Authentication System

This document explains how the authentication system for the API is set up in this Laravel application.

## Overview

The application uses token-based authentication for the API. When a user logs in, they receive an API token that they must include in subsequent requests to access protected routes.

## Components

### 1. AuthenticateApi Middleware

Located at `app/Http/Middleware/AuthenticateApi.php`, this middleware checks if a valid API token is provided in the request header. If the token is valid, it associates the user with the request; otherwise, it returns a 401 Unauthorized response.

### 2. Kernel Registration

The middleware is registered in `app/Http/Kernel.php` with the alias `auth.api` in the `$routeMiddleware` array.

### 3. Auth Routes

Auth routes are defined in `routes/auth.php` and included in the main `routes/api.php` file. They include:

- **Public routes** (no authentication required):
  - `POST /api/register` - Register a new user
  - `POST /api/login` - Login and get an API token

- **Protected routes** (require authentication):
  - `POST /api/logout` - Invalidate the current token
  - `GET /api/me` - Get authenticated user info
  - `PUT /api/profile` - Update authenticated user profile
  - `POST /api/refresh-token` - Get a new API token

### 4. AuthController

Located at `app/Http/Controllers/Auth/AuthController.php`, this controller handles all authentication-related requests.

## How to Use

### 1. Register a User

```http
POST /api/register
Content-Type: application/json

{
  "nomUsers": "User Name",
  "matricule": "unique_matricule",
  "role": "admin",
  "password": "password123"
}
```

### 2. Login

```http
POST /api/login
Content-Type: application/json

{
  "nomUt": "username",
  "PasswordUT": "password123"
}
```

### 3. Making Authenticated Requests

Include the token in the `Authorization` header for all protected routes:

```http
GET /api/me
Authorization: Bearer YOUR_API_TOKEN
```

## Important Notes

1. Tokens are stored in the `api_token` field in the Users table
2. The token system is using a simple string token, not JWT or other more complex token systems
3. CORS headers are included in the middleware responses to allow cross-origin requests 