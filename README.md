# CampusGigs — Student Micro-Freelance Marketplace

A full-stack internship project based on **MERN** (MongoDB, Express, React, Node.js), aligned with MERN-01 CampusGigs in the supplied internship brief.

## Features implemented

- Student registration and login using JWT; passwords are hashed with bcrypt.
- Profile editing API (name, bio, skills).
- Gig creation, listing, detail view, search, category filtering, pagination, and status management.
- Applicants can apply to gigs once; duplicate applications are blocked by a database unique index.
- Gig owners can view applicants and accept/reject applications. Accepting one marks the gig in progress and rejects other pending applications.
- Personal dashboard for posted gigs, submitted applications, and received applicants.
- In-app conversation threads connected to gigs, with participant authorization, message history, and read markers.
- Responsive UI with demo cards when the backend/database is not running.
- API rate limiting, Helmet security headers, CORS configuration, validation, and centralized error handling.

## Requirements

- Node.js 18+ (Node 20 LTS recommended)
- MongoDB Community running locally, or a MongoDB Atlas connection string

## Run locally

1. Open a terminal in this folder.
2. Install root and app dependencies:

   ```bash
   npm install
   npm run install:all
   ```

3. Configure the API:

   ```bash
   cp server/.env.example server/.env
   ```

   Edit `server/.env` and set `MONGODB_URI` and a long, random `JWT_SECRET`. Keep `.env` private and never commit it.

4. Start MongoDB locally, or set `MONGODB_URI` to your Atlas connection string.
5. Start frontend and backend together:

   ```bash
   npm run dev
   ```

6. Open the Vite URL shown in the terminal (normally `http://localhost:5173`). API runs at `http://localhost:5000`; health check: `http://localhost:5000/api/health`.

## API routes

| Method | Route | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Create student account | Public |
| POST | `/api/auth/login` | Sign in | Public |
| GET | `/api/auth/me` | Current user | Authenticated |
| PATCH | `/api/auth/me` | Update profile | Authenticated |
| GET | `/api/jobs` | Search/filter gigs | Public |
| GET | `/api/jobs/:id` | Gig detail | Public |
| POST | `/api/jobs` | Create gig | Authenticated |
| GET | `/api/jobs/mine/posted` | Current user's gigs | Authenticated |
| PATCH | `/api/jobs/:id` | Update gig | Owner/admin |
| DELETE | `/api/jobs/:id` | Delete gig and applications | Owner/admin |
| POST | `/api/applications` | Apply to a gig | Authenticated |
| GET | `/api/applications/mine` | My applications | Authenticated |
| GET | `/api/applications/received` | Applications to my gigs | Authenticated |
| PATCH | `/api/applications/:id/status` | Review an application | Gig owner/admin |
| GET | `/api/messages/conversations` | List my conversations | Authenticated participant |
| POST | `/api/messages/conversations` | Start/reuse a gig conversation | Gig owner or applicant |
| GET | `/api/messages/conversations/:id/messages` | Read a conversation | Authenticated participant |
| POST | `/api/messages/conversations/:id/messages` | Send a message | Authenticated participant |

## Before production deployment

- Set strong environment variables in the hosting provider; never publish `.env`.
- Use HTTPS and a production-specific `CLIENT_URL`.
- For a larger production release, move JWTs from local storage to secure, HttpOnly cookies, add email verification/password reset, automated tests, and a messaging service. For a production release, add a real-time transport such as WebSockets, push/email notifications, and automated tests for conversation permissions.
- Add a proper admin provisioning workflow before exposing admin features publicly.
- Configure MongoDB Atlas network access and database user permissions carefully.

## Deployment outline

- **Database:** MongoDB Atlas free tier (subject to current provider limits).
- **API:** Render or another Node-compatible host. Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT` as environment variables.
- **Frontend:** Render static site or another static host. Build command: `npm run build` in `client`; publish directory: `client/dist`. Set `VITE_API_URL` to the deployed API URL plus `/api` before building.

This repository contains source code and setup instructions; it has not been deployed to a public URL.
