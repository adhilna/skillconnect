# SkillConnect MVP – Scope Overview

SkillConnect is a full-stack freelancing platform enabling client–freelancer collaboration with real-time communication, robust payments, contract management, and exceptional user experience.

---

## Key Features

### 1. Authentication & User Security

- Email/password registration with OTP (onboarding, resend, password reset)
- Google OAuth login
- JWT authentication and refresh (secure, stateless API access)
- Rate limiting on sensitive actions: login/register, OTP, verification
- Anti-abuse ratelimit for high-risk endpoints

### 2. Profiles & Browsing

- Dedicated profiles for freelancers and clients
  - **Freelancer:** photo/avatar, country/location, skills, education, experience, languages, portfolios, verification badges, social links (GitHub, LinkedIn, etc.)
  - **Client:** business/company info, size/type, industry, project budget, project needs
- Public browse/search endpoints with pagination and filtering (skills, location, industry)

### 3. Real-Time Communication

- 1:1 WebSocket chat between client and freelancer
- Presence (online/offline), typing indicators, and message events in real time (Django Channels + Redis)

### 4. Contracts & Payments

- Create/manage project contracts and work orders
- Status workflows: draft, submitted, accepted, etc. with API permissions and state updates
- Integrated Razorpay payment gateway:
  - Freelancers issue payment requests (advance, milestone)
  - Clients approve/pay securely
  - Full backend verification (callback & webhook)
- All sensitive payment/contract actions validated on backend

### 5. Notifications & Reviews

- In-app notifications for all key events: projects, contracts, payments
- Client reviews/rates freelancers after project completion

### 6. User Experience & Frontend Engineering

- Responsive, modern UI supporting mobile and desktop
- React 19—built with Vite, TailwindCSS, Headless UI, React Router, Axios, Framer Motion
- UX polish: interactive charts, dynamic dropdowns, spinners, toasts, real-time feedback, confetti, accessible and stylish UI
- Rich input features: forms, react-select, Heroicons, Lucide icons

### 7. Location & Search Utility

- Dynamic city autocomplete (for all Indian cities) for fast, user-friendly profile location selection

---

## Technical Stack

### Backend

- Django 4.2, Django REST Framework, SimpleJWT, Channels (WebSocket), Daphne
- PostgreSQL for data, Redis for cache/real-time
- Celery + Redis for background jobs: OTP, notifications, async emails
- Avatar/photos/file upload support, robust backend validation and security

### Frontend

- React 19 (Vite, ES6+)
- TailwindCSS, Headless UI, Heroicons, Lucide
- React-select for form input, toasts and spinners for feedback
- OAuth and Google (@react-oauth/google)
- Axios, WebSocket, JWT storage/routing
- Fully mobile-responsive and tested

---

## Security & Scalability

- All secrets (JWT, Razorpay, email, etc.) loaded securely from environment configs (never hardcoded)
- All payment/auth/contract flows validated server-side
- CORS locked down to trusted frontends
- Celery + Redis for async/background and real-time
- Backend/Frontend input strictly validated
- HTTPS enforced for production

---

## DevOps & Deployment

- Docker-ready stack for robust scaling
- Separate config for test/production (especially payment flows)
- Static/media file serving (user uploads/avatars)
- Deployment-oriented settings: environment files, containerization, simple scaling

### Major Backend Dependencies

- Django, DRF, JWT, Celery, Channels, Redis, Razorpay, Pillow, CORS, Rate Limiting

#### Major Frontend Dependencies

- React, Vite, TailwindCSS, Axios, React Router, Framer Motion, Headless UI, Heroicons/Lucide, OAuth, and other modern UI/UX libs

---

## MVP Limitations & Next Steps

- MVP excludes: group chat, advanced file attachments, admin dashboard, mobile app, analytics/reporting
- Future enhancements: group comms, global admin, advanced dashboards, analytics, mobile support

---

This deliverable covers all critical, production-quality workflows for a modern freelance platform MVP and provides a foundation for future growth with best-in-class UX and reliable real-time architecture.
