# SkillConnect API Specification

## Base URL
`/api/v1/`

## Authentication
- JWT (Bearer token in `Authorization` header).
- Endpoints requiring auth: All except `/auth/register/` and `/auth/login/`.

## Endpoints

### 1. User Authentication
- **POST /auth/register/**
  - Request: `{ "email": "user@example.com", "password": "pass123", "role": "customer" }`
  - Response: `{ "user": { "id": 1, "email": "user@example.com", "role": "customer" }, "token": "jwt_token" }`
  - Description: Register a new user (customer/worker/admin).
- **POST /auth/login/**
  - Request: `{ "email": "user@example.com", "password": "pass123" }`
  - Response: `{ "user": { "id": 1, "email": "user@example.com", "role": "customer" }, "token": "jwt_token" }`
  - Description: Login and get JWT token.

### 2. Services
- **GET /services/**
  - Query Params: `category`, `search`
  - Response: `{ "services": [{ "id": 1, "title": "Plumbing", "price": 50, "worker_id": 2, "category": "Plumbing" }, ...] }`
  - Description: List services with optional filters.
- **POST /services/**
  - Request: `{ "title": "Plumbing", "description": "Fix leaks", "price": 50, "category_id": 1 }`
  - Response: `{ "id": 1, "title": "Plumbing", ... }`
  - Description: Create a service (workers only).

### 3. Bookings
- **GET /bookings/**
  - Response: `{ "bookings": [{ "id": 1, "customer_id": 1, "worker_id": 2, "service_id": 1, "status": "pending", "date": "2025-05-10" }, ...] }`
  - Description: List user’s bookings.
- **POST /bookings/**
  - Request: `{ "service_id": 1, "date": "2025-05-10" }`
  - Response: `{ "id": 1, "status": "pending", ... }`
  - Description: Create a booking (customers only).

### 4. Payments
- **POST /payments/checkout/**
  - Request: `{ "booking_id": 1 }`
  - Response: `{ "checkout_url": "https://stripe.com/checkout/..." }`
  - Description: Initiate Stripe payment for a booking.

### 5. Reviews
- **POST /reviews/**
  - Request: `{ "booking_id": 1, "rating": 5, "comment": "Great service!" }`
  - Response: `{ "id": 1, "rating": 5, ... }`
  - Description: Submit a review for a completed booking.

### 6. Notifications
- **GET /notifications/**
  - Response: `{ "notifications": [{ "id": 1, "message": "Booking confirmed", "type": "booking_update", "is_read": false }, ...] }`
  - Description: Fetch user’s notifications.