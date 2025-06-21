# Solo_Sparks

Solo_Sparks is a cosmic dating and self-growth platform where users embark on personalized quests, earn spark points, and unlock celestial rewards. The platform combines gamification, mood tracking, and analytics to help users grow emotionally and connect with others.

---

## 🚀 Features

- **User Authentication:** Register, login, and manage your profile (with avatar upload).
- **Personalized Quests:** Get daily quests tailored to your mood and emotional needs.
- **Quest Completion:** Submit reflections (text, photo, or audio) and earn spark points.
- **Rewards Store:** Redeem spark points for exclusive rewards.
- **Analytics & Trends:** Track your growth and see trending quests and rewards.
- **Responsive UI:** Mobile-friendly, modern design.
- **Bonus:** Social sharing of completed quests.

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, Mongoose, Multer, JWT, Cloudinary (optional)
- **Database:** MongoDB Atlas

---

## 📦 Project Structure

```
Solo_Sparks/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── docs/
│   │   └── API.md
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── tailwind.config.js
│   ├── static.json
│   ├── package.json
│   └── README.md
└── README.md
```

---

## ⚡ Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/Uni-coder-harsh/Solo_Sparks.git
cd Solo_Sparks
```

### 2. **Backend Setup**

```bash
cd backend
cp .env.example .env   # Fill in your MongoDB URI and JWT secret
npm install
npm start
```

### 3. **Frontend Setup**

```bash
cd ../frontend
npm install
npm start
```

- The frontend runs on [http://localhost:3000](http://localhost:3000)
- The backend runs on [http://localhost:5000](http://localhost:5000) (or as configured)

---

## 🌐 Deployment

- **Frontend:** Deploy the `frontend` folder as a static site (Render, Netlify, Vercel, etc.)
- **Backend:** Deploy the `backend` folder as a Node.js service (Render, Heroku, etc.)
- **MongoDB Atlas:** Use a cloud MongoDB instance.

**SPA Routing:**  
For static hosting, ensure you have a `static.json` or rewrite rules to serve `index.html` for all routes.

---

## 📖 API Documentation

See [`backend/docs/API.md`](backend/docs/API.md) for complete API endpoints, request/response formats, and error codes.

---

## ✨ Core Endpoints Overview

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get profile
- `PUT /api/auth/me` — Update profile/avatar
- `GET /api/quests` — Get quests
- `POST /api/quests` — Create quest
- `PUT /api/quests/:id` — Update quest
- `GET /api/rewardstore` — List rewards
- `POST /api/rewards/redeem/:id` — Redeem reward
- `GET /api/analytics/trending-quests` — Trending quests
- `GET /api/analytics/trending-rewards` — Trending rewards

---
