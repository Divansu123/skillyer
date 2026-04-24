# SkillYer — MERN Stack (React + Express + Prisma + MySQL)

> **India's smartest course comparison platform** — Rise Fast.  
> Built by TruhireAI Private Limited

---

## 🗂️ Project Structure

```
skillyer/
├── backend/               ← Express + Prisma + MySQL API
│   ├── prisma/
│   │   └── schema.prisma  ← Database schema
│   ├── src/
│   │   ├── config/        ← Prisma client
│   │   ├── controllers/   ← Business logic
│   │   ├── middleware/    ← JWT auth
│   │   ├── routes/        ← API routes
│   │   └── utils/
│   │       └── seed.js    ← Database seeder
│   ├── .env               ← Environment variables
│   └── package.json
│
└── frontend/              ← React 18 frontend
    ├── public/
    │   └── logo.jpeg
    ├── src/
    │   ├── components/
    │   │   ├── common/    ← CourseCard, ChatBot, CompareBar, Modals
    │   │   └── layout/    ← Navbar
    │   ├── context/       ← AdminContext (auth state)
    │   ├── pages/         ← Home, Explore, Compare, Finder, Jobs, Tools, Admin
    │   ├── services/      ← api.js (all API calls)
    │   ├── styles/        ← globals.css
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MySQL** 8.0+ running locally
- **npm** v9+

---

## 🚀 Quick Setup

### 1. Setup MySQL Database

```sql
CREATE DATABASE skillyer_db;
```

### 2. Configure Environment

Edit `backend/.env`:

```env
DATABASE_URL="mysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/skillyer_db"
JWT_SECRET=skillyer_jwt_secret_key_2026_truhireai
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Setup & Run Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
node src/utils/seed.js
npm run dev
```

Backend will start at: **http://localhost:5000**

### 4. Setup & Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will start at: **http://localhost:3000**

---

## 🔐 Admin Access

| Field    | Value         |
|----------|---------------|
| URL      | /admin        |
| Username | admin         |
| Password | SkillYer2026  |

---

## 📡 API Endpoints

| Method | Endpoint                    | Auth | Description              |
|--------|-----------------------------|------|--------------------------|
| GET    | /api/courses                | No   | Get courses (filterable) |
| POST   | /api/courses                | Yes  | Create course            |
| PUT    | /api/courses/:id            | Yes  | Update course            |
| DELETE | /api/courses/:id            | Yes  | Delete course            |
| GET    | /api/jobs                   | No   | Get jobs (filterable)    |
| POST   | /api/jobs                   | Yes  | Create job               |
| GET    | /api/categories             | No   | Get all categories       |
| GET    | /api/providers              | No   | Get all providers        |
| POST   | /api/enrollments            | No   | Submit enrollment        |
| GET    | /api/enrollments            | Yes  | Get all enrollments      |
| POST   | /api/applications           | No   | Submit job application   |
| GET    | /api/applications           | Yes  | Get all applications     |
| POST   | /api/counsel                | No   | Book counselling session |
| GET    | /api/counsel                | Yes  | Get all counsel requests |
| GET    | /api/testimonials           | No   | Get testimonials         |
| GET    | /api/roi                    | No   | Get ROI data             |
| POST   | /api/admin/login            | No   | Admin login → JWT token  |
| GET    | /api/admin/stats            | Yes  | Dashboard stats          |

---

## 🎨 Features

| Feature              | Status |
|----------------------|--------|
| Home Page + Hero     | ✅     |
| Course Explorer      | ✅     |
| Search & Filters     | ✅     |
| Course Compare (3)   | ✅     |
| Find My Course Quiz  | ✅     |
| Jobs Board           | ✅     |
| Job Applications     | ✅     |
| ROI Calculator       | ✅     |
| Skill Diagnostic     | ✅     |
| CV Builder           | ✅     |
| Career Counselling   | ✅     |
| AI Chatbot (SkillYerBot) | ✅ |
| Admin Login (JWT)    | ✅     |
| Admin Dashboard      | ✅     |
| Enrollment Mgmt      | ✅     |
| Application Mgmt     | ✅     |
| Counsel Mgmt         | ✅     |
| Domains & Partners   | ✅     |
| MySQL + Prisma ORM   | ✅     |
| Fully Responsive     | ✅     |

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router v6, Axios, CSS Variables  
**Backend:** Node.js, Express.js, Prisma ORM, JWT, bcryptjs  
**Database:** MySQL 8.0  
**Design:** Same as original HTML — Syne + DM Sans fonts, purple/orange theme

---

© 2026 TruhireAI Private Limited
