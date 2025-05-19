# AutoTasker AI

An AI-powered task management application that generates personalized learning tasks using Google's Gemini API.

## Features

- 🔐 Firebase Authentication
- 🤖 AI-powered task generation using Google Gemini API
- 📝 Task management (create, read, update, delete)
- 📊 Progress tracking
- 🎯 Task categorization and filtering

## Tech Stack

### Backend

- Node.js with Express
- TypeScript
- PostgreSQL with Drizzle ORM
- Firebase Admin SDK
- Google Gemini API

### Frontend

- Next.js 14+
- Tailwind CSS
- ShadCN UI
- Firebase Auth

## Prerequisites

- Node.js 20+
- PostgreSQL (serverless using neon)
- Firebase project
- Google Gemini API key

## Environment Variables

Create a `.env` file in the backend folder with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
# Database Configuration
DATABASE_URL=postgres://user:password@your-neon-db.com/dbname
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key
```

Create a `.env.local` file in the frontend folder with the following variables:

```env

NEXT_PUBLIC_API_URL= http://localhost:3001

NEXT_PUBLIC_FIREBASE_API_KEY = "api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID = "project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID = "app_id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = "measurement_id"
```

## Development Setup

1. Install dependencies in frontend & backend:

   ```bash
   npm install
   ```

2. Start the development server in both:
   ```bash
   npm run dev
   ```

## API Endpoints

### Tasks

- `POST /api/generate-tasks` - Generate tasks using AI
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:userId` - Get all tasks for the authenticated user
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
