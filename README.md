# Quiz Frontend

A React + TypeScript + Vite application for creating, managing, and taking quizzes with role-based authentication.

Live Preview: [quiz-frontend-git-main-baibhav-kcs-projects.vercel.app](quiz-frontend-git-main-baibhav-kcs-projects.vercel.app)

## Setup & Running

### Prerequisites

- Node.js 16+
- Backend API running on localhost or configured in environment

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the development server at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

### Environment

Create a `.env` file with your backend API URL. Check `.env.example` for more info:

```
VITE_API_URL=https://your-backend-api.com
```

## Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── quiz-builder/   # Quiz creation form components
│   ├── AuthLayout.tsx
│   ├── PageLayout.tsx
│   ├── PrivateRoute.tsx
│   └── ...
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── CreateQuizPage.tsx
│   ├── TakeQuizPage.tsx
│   └── ...
├── context/            # React context (Auth)
├── constants/          # API routes and web routes
├── lib/                # Utilities & schemas
│   ├── apiFetch.ts
│   ├── quizSchema.ts  # Zod validation schemas
│   └── config.ts
├── types/              # TypeScript types
├── App.tsx
└── main.tsx
```

## Key Features

- ✅ User authentication (Login/Register)
- ✅ Create & edit quizzes with multiple question types
- ✅ Share quizzes via unique permalink
- ✅ Take quizzes with instant results
- ✅ Form validation with Zod
- ✅ Protected routes for authenticated users

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- React Hook Form + Zod
- Tailwind CSS
