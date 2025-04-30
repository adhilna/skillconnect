# SkillConnect MVP Scope

## Overview
SkillConnect is a full-stack service marketplace connecting skilled workers with customers, built with Django, React.js, PostgreSQL, and WebSockets 

## Target
- started on april 30, 2025
- Complete by May 30, 2025.
- Deployed app with 5 test users, 10 bookings, and a live demo.

## MVP Features
1. **User Management**:
   - Register/login with email/password (JWT).
   - Roles: Customer, Worker, Admin.
   - Profile: Name, phone, skills (for workers).
2. **Service Listing**:
   - Workers create services with title, description, price, category.
   - Customers browse services by category.
3. **Booking System**:
   - Customers book a service with date and status (pending/confirmed/completed).
   - Status updates visible to both parties.
4. **Payments**:
   - Customers pay via Stripe with 10% platform fee.
   - Transaction history stored.
5. **Reviews**:
   - Customers rate/review workers after booking completion.
6. **Notifications**:
   - Real-time booking status updates via WebSockets.
7. **Admin Dashboard**:
   - View/manage users and bookings via Django Admin.

## Non-Functional Requirements
- Responsive UI (desktop/mobile).
- Secure: JWT, HTTPS, input validation.
- Performance: <1s API response time.

## Deferred Features
- Chat between users.
- Dispute resolution.
- Advanced analytics.

## Success Criteria
- 5 test users (3 customers, 2 workers).
- 10 successful bookings with payments.
- Live deployment on Heroku/Render.