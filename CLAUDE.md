# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📋 Project Overview

This is a Gym Management System consisting of:
- **Frontend**: React + Vite application (in `/frontend`)
- **Backend**: Node.js/Express with TypeScript and MongoDB (in `/backend`)

## ⚙️ Development Setup

### Frontend
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend
```bash
# Install dependencies
cd backend
npm install

# Start development server
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## 🏗️ Architecture

### Frontend Structure
- `/src/components`: Reusable UI components (buttons, cards, modals, etc.)
- `/src/components/layout`: Layout components (Sidebar)
- `/src/components/modals`: Modal dialogs (MemberModal, FeeModal)
- `/src/pages`: Page components (DashboardPage, MembersPage, FeesPage)
- `/src/utils`: Utility functions (API constants, API helpers)
- `/src/assets`: Static assets (images, icons)

### Backend Structure
- `/src/app.js`: Express app configuration and middleware
- `/src/server.js`: Server entry point and database connection
- `/src/routes`: API route definitions
- `/src/controllers`: Business logic for handling requests
- `/src/models`: Mongoose schemas and database models
- `/src/middleware`: Custom middleware (authentication, rate limiting, error handling)
- `/src/services`: External service integrations
- `/src/utils`: Utility functions (logging, helpers)
- `/src/config`: Configuration files (database, environment)

### API Endpoints
All API endpoints are prefixed with `/api`:
- `/api/auth` - Authentication routes
- `/api/members` - Member CRUD operations
- `/api/fees` - Fee management
- `/api/dashboard` - Dashboard statistics
- `/api/membership` - Membership management
- `/api/nlQuery` - Natural language query processing
- `/api/insight` - Analytics and insights

## 🔑 Environment Variables

Create `.env` files in both frontend and backend directories:

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gymdb
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

## 🧠 Key Features

1. **Member Management**: Add, edit, delete, and view gym members
2. **Fee Tracking**: Manage member fees and payment status
3. **Dashboard Analytics**: View key metrics and statistics
4. **Natural Language Queries**: Ask questions about gym data in plain English
5. **AI-powered Insights**: Get intelligent recommendations and analysis
6. **Real-time Updates**: Interactive UI with immediate feedback

## 🛠️ Common Development Tasks

### Adding a New API Endpoint
1. Create route file in `/backend/src/routes/`
2. Add controller logic in `/backend/src/controllers/`
3. Update model if needed in `/backend/src/models/`
4. Register route in `/backend/src/app.js`
5. Test with API client or frontend integration

### Adding a New Frontend Page
1. Create component in `/src/pages/`
2. Add navigation route in `/src/App.jsx` sidebar
3. Implement API calls using `apiFetch` utility
4. Add any needed UI components in `/src/components/`

### State Management
- Frontend uses React hooks (`useState`, `useEffect`) for local state
- API data fetching handled through custom `apiFetch` utility in `/src/utils/api.js`
- Mock data available in `/src/utils/constants.js` for offline development

## 📝 Code Conventions

### Backend (TypeScript)
- Strict typing enabled with `any` avoided
- Clean architecture separation (routes → controllers → models)
- Error handling via Express middleware
- Validation using Mongoose schema validation
- Logging with Winston logger

### Frontend (React/JavaScript)
- Functional components with hooks
- Tailwind CSS for styling
- Consistent naming conventions
- Modular component architecture
- Environment-based API configuration

## 🧪 Testing

Currently, the project relies on manual testing. To add tests:
- Backend: Consider Jest or Mocha for unit/integration tests
- Frontend: Consider React Testing Library or Vitest for component tests

## 🚀 Deployment

The backend is configured for Vercel deployment:
- Build output directory configured to `dist`
- Vercel configuration in `vercel.json`
- Environment variables set in Vercel dashboard

Frontend can be deployed to Vercel, Netlify, or similar static hosting platforms.