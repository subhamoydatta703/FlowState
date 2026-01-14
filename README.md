# FlowState - Productivity Tracker

🌐 **Website:** [https://flow-state-app.vercel.app](https://flow-state-app.vercel.app)

## Overview
FlowState is a gamified productivity tracker designed to help you stay focused and manage your time effectively. It combines task logging with AI-powered productivity scoring, a built-in scheduler, and detailed analytics to give you deep insights into your work habits.

## Tech Stack
- **Frontend:** React, Vite, Framer Motion, Recharts
- **Backend:** Node.js, Express, MongoDB
- **AI Integration:** Google Gemini API (Productivity Scoring)
- **Authentication:** Clerk
- **Styling:** CSS Modules with a modern "Industrial" aesthetic

## Prerequisites
- Node.js (v16+)
- MongoDB Atlas connection string
- Clerk API Keys
- Google Gemini API Key
- Gmail App Password (for email reminders)

## Setup Instructions

### 1. Server Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the server:
```bash
npm run dev
```

### 2. Client Setup
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
```

Start the client:
```bash
npm run dev
```

## Features
- **Smart Logging:** Log tasks with descriptions and duration. AI analyzes your work to award "XP" points.
- **Leveling System:** Gamify your productivity by leveling up as you earn points.
- **Scheduler:** Set reminders for important tasks and get email notifications.
- **Analytics:** Visualize your productivity trends over time.
- **Dark/Light Mode:** Beautifully crafted themes for any environment.

## Vercel Deployment

### Frontend Deployment
1. Go to [Vercel](https://vercel.com) and import the `client` folder
2. Set environment variables in Vercel dashboard:
   - `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
   - `VITE_API_URL` - Your backend URL (e.g., `https://flowstate-api.vercel.app/api`)
3. Deploy!

### Backend Deployment
1. Go to [Vercel](https://vercel.com) and import the `server` folder
2. Set environment variables in Vercel dashboard:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `GEMINI_API_KEY` - Google Gemini API key
   - `CLERK_PUBLISHABLE_KEY` - Clerk publishable key
   - `CLERK_SECRET_KEY` - Clerk secret key
   - `EMAIL_USER` - Gmail address for notifications
   - `EMAIL_PASS` - Gmail app password
   - `FRONTEND_URL` - Your frontend URL for CORS
3. Deploy!

> **Note:** After deploying both, update the `VITE_API_URL` in frontend and `FRONTEND_URL` in backend with the actual deployment URLs.

---
**Author:** Subhamoy Datta
