# 🚀 SkillConnect

**A robust, production-ready freelancing platform built for client–freelancer collaboration, real-time communication, secure payments, and pro-grade contract management.**

<br>

---

## 🌟 About SkillConnect

**SkillConnect** is a full-stack marketplace connecting clients and skilled freelancers, designed for seamless project workflows, instant messaging, and reliable payments—all powered by modern, scalable technology.

> “Build. Connect. Deliver. All in real time.”

---

## ✨ Key MVP Features

- **🔐 Secure Authentication:**  
  Email/password with OTP, Google OAuth, JWT-based API auth, rate limits for sensitive actions

- **👤 Profiles & Browsing:**  
  Rich freelancer and client profiles (avatar, skills, experience, business info), smart search with filters

- **💬 Real-Time Chat:**  
  1:1 WebSocket messaging with presence, typing indicators (Django Channels + Redis)

- **📄 Contracts & Payments:**  
  Advanced project contracts, milestone tracking, integrated Razorpay gateway (issue/payment/approval flows), strong backend verification

- **🔔 In-App Notifications:**  
  Real-time alerts for contracts, payments, reviews, and more

- **⭐ Reviews:**  
  Client feedback/rating post-project, boosting trust

- **💻 Modern Frontend Experience:**  
  React 19, Vite, TailwindCSS with beautiful, responsive UI/UX, dynamic dropdowns, feedback spinners, and real-time interactions

- **📍 Smart Location Search:**  
  Dynamic Indian city autocomplete for profiles

---

## 🛠️ Technical Stack

### **Backend**

- **Frameworks/Libraries:** Django 4.2, Django REST Framework, Django Channels, SimpleJWT, Celery
- **Database:** **AWS RDS** (production-grade managed database; currently using RDS instead of local PostgreSQL)
- **File Storage:** **AWS S3** for avatars, uploads, and user documents
- **Cache & Real-Time:** Redis (local or AWS via ElastiCache)
- **Integrations:** Razorpay (payments), Avatar/uploads, Email (async), OTP, WebSockets (Daphne)
- **Testing & Security:** Strict validation, CORS, rate limiters, HTTPS

### **Frontend**

- **Built with:** React 19, Vite, TailwindCSS
- **UI Components:** Headless UI, Heroicons, Lucide, React-select
- **UX:** Responsive, animated, and accessible; toasts, spinners, dynamic forms, all mobile-tested
- **Auth & Networking:** JWT, OAuth, Axios, WebSocket client

### **DevOps & Deployment**

- **Docker-ready** for robust scaling and local/dev workflows
- **AWS cloud hosting** and infrastructure (EC2 for backend/frontend, RDS for database, S3 for file storage)
- **Environment-based configs** (secure secrets, separated for test/production)
- **Static/media management** via AWS S3 buckets

---

## 📈 Major Dependencies

- **Backend:** Django, DRF, Celery, Channels, Redis, SimpleJWT, Razorpay, Pillow
- **Frontend:** React, TailwindCSS, React Router, Axios, Framer Motion, Heroicons, OAuth

---

## 🚧 MVP Limitations & Next Steps

**What’s not (yet) included:**
- Group chat, advanced file attachments, admin dashboard

**Planned for future:**
- Group messaging, global admin tools, dashboards, analytics, mobile support, Voice & Video Call

This MVP delivers all core, production-grade workflows for a competitive freelance platform—built with best practices, modern UX, and future-ready architecture.

---

## 📦 Getting Started

> **Full setup/installation details are inside [`docs/mvp-scope.md`](docs/mvp-scope.md) and individual backend/frontend README files.**

**Basic setup:**
Backend (Django, REST API, WebSockets)
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend (React)
cd ../frontend
npm install
npm run dev

**Production setup:**
- Provision and configure **AWS RDS** database (PostgreSQL/MySQL)
- Set up **AWS S3** buckets for `MEDIA_URL` and static files; update Django storage backend configs
- Use **EC2** or other AWS deployment options for server hosting
- Environment variables are required: AWS keys, S3 bucket, RDS credentials, Razorpay secrets, JWT configs

## 🤝 Contributing

Pull requests welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) and add issues for feature requests/bugs.

**Adhil NA**  
Backend-focused full-stack developer, Kerala  
Feel free to connect or reach out:
- [GitHub Profiles](https://github.com/adhilna)
- Email: adhilchy11@gmail.com

> *“Clean code always looks like it was written by someone who cares.” — Robert C. Martin*
