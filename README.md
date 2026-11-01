# CampusGigs — Student Micro-Freelance Marketplace

A full-stack MERN application that connects university students who need short-term help with students who can provide services such as graphic design, video editing, coding, and notes preparation.

**Internship:** Zynvex Solutions — Batch 5 Virtual Internship  
**Track:** MERN Stack  
**Project:** CampusGigs — Micro-Freelance Marketplace for Students  
**Module 1 period:** October 26 – November 1, 2026

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Problem statement and objectives](#2-problem-statement-and-objectives)
3. [Users and roles](#3-users-and-roles)
4. [Technology stack](#4-technology-stack)
5. [Implemented features](#5-implemented-features)
6. [Project structure](#6-project-structure)
7. [Application architecture](#7-application-architecture)
8. [Database design](#8-database-design)
9. [API documentation](#9-api-documentation)
10. [Installation and local setup](#10-installation-and-local-setup)
11. [Environment variables](#11-environment-variables)
12. [Running and building the application](#12-running-and-building-the-application)
13. [Module 1 work plan and status](#13-module-1-work-plan-and-status)
14. [Testing checklist](#14-testing-checklist)
15. [Security considerations](#15-security-considerations)
16. [Known limitations and future improvements](#16-known-limitations-and-future-improvements)
17. [Deployment overview](#17-deployment-overview)
18. [Author](#18-author)

---

## 1. Project overview

CampusGigs is a student-focused micro-freelance marketplace. It provides a place for students to publish small projects, discover opportunities, apply for work, communicate with other students, and manage their activity.

A single student account can participate in both sides of the marketplace:
- **Service buyer:** posts a gig and reviews applications received.
- **Service seller:** browses gigs and submits applications.

The current dashboard brings together posted gigs, submitted applications, received applications, and messages. A dedicated Buyer/Seller dashboard mode switcher is a planned interface improvement and is not yet implemented in the supplied project version.

## 2. Problem statement and objectives

Students often need help with small tasks, while other students have useful skills but limited access to short-term work opportunities. CampusGigs aims to make these exchanges easier within a student community.

### Objectives

- Provide student account registration and login.
- Allow students to create and manage gig listings.
- Help users find gigs through search and category filters.
- Allow eligible users to apply to open gigs.
- Let gig owners review and update application statuses.
- Provide basic in-app conversations related to gigs.
- Present a responsive interface for desktop and mobile screens.

## 3. Users and roles

CampusGigs uses one account for both marketplace activities.

| Mode | Typical actions |
|---|---|
| Service Buyer | Create gigs, manage own listings, review applicants, accept or reject applications, communicate with applicants |
| Service Seller | Browse gigs, submit applications, track application status, communicate with gig owners |

The database's `User.role` field currently distinguishes `student` and `admin`. Buyer and Seller are activity modes, not separate account types. The planned dashboard switcher will change which workspace is emphasized without requiring a second account.

## 4. Technology stack

| Layer | Technology | Purpose |
|---|---|---|
| Database | MongoDB / MongoDB Atlas | Stores users, gigs, applications, conversations, and messages |
| ODM | Mongoose | Schemas, validation, and database queries |
| Backend | Node.js | JavaScript server runtime |
| API | Express.js | REST API routes and middleware |
| Frontend | React 18 | User interface |
| Build tool | Vite 6 | Frontend development server and production build |
| Authentication | JSON Web Token (JWT) | Authenticated API requests |
| Password security | bcryptjs | Password hashing |
| Icons | lucide-react | Interface icons |
| Security middleware | Helmet, CORS, express-rate-limit | HTTP headers, cross-origin configuration, and API rate limiting |
| Version control | Git / GitHub | Source-code management |

## 5. Implemented features

The following features are present in the supplied source code:

- Student registration and login.
- Password hashing with bcryptjs.
- JWT-based authentication and protected API routes.
- Profile editing for name, bio, and skills.
- Gig creation, listing, detail retrieval, editing, and deletion.
- Search, category filtering, status filtering, and paginated gig listings.
- Application submission with a unique database index preventing duplicate applications to the same gig.
- Backend ownership validation that rejects applications to a user's own gig.
- Gig-owner applicant review and application status updates.
- Accepting an application marks the gig as `in_progress` and rejects other pending applications for that gig.
- Dashboard data for posted gigs, submitted applications, received applications, and conversations.
- In-app conversation creation/reuse, message history, and sending messages with participant checks.
- Responsive React interface and demo/preview cards when API data cannot be loaded.
- API health endpoint, Helmet, CORS configuration, API rate limiting, and centralized error handling.

**Important status note:** The supplied backend already contains a self-application check in `POST /api/applications`. The frontend should also hide or disable the Apply control for the gig owner as a usability improvement. A distinct Buyer/Seller dashboard switcher remains future work.

## 6. Project structure

```text
campusgigs/
├── client/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       └── styles.css
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── middleware/
│       │   └── auth.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Job.js
│       │   ├── Application.js
│       │   ├── Conversation.js
│       │   └── Message.js
│       └── routes/
│           ├── auth.js
│           ├── jobs.js
│           ├── applications.js
│           └── messages.js
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── DEPLOYMENT-GUIDE.md
```

## 7. Application architecture

The application follows a client-server architecture:

1. The React/Vite client displays pages and collects user input.
2. The client sends HTTP requests to the Express API.
3. Protected requests include a JWT in the `Authorization: Bearer <token>` header.
4. Express routes validate requests and use Mongoose models to read or update MongoDB.
5. The API returns JSON responses to the client.
6. React updates the interface based on the response.

### Main request flow

```text
Student
  |
  v
React + Vite frontend
  |
  | HTTP / JSON + JWT for protected requests
  v
Express REST API
  |
  | Mongoose
  v
MongoDB Atlas / MongoDB
```

## 8. Database design

The project contains five Mongoose models.

### User

| Field | Description |
|---|---|
| `name` | Required name, trimmed, maximum 80 characters |
| `email` | Required, unique, lowercase, trimmed |
| `passwordHash` | Required hashed password; excluded from normal queries |
| `role` | `student` by default, or `admin` |
| `bio` | Optional profile biography, maximum 500 characters |
| `skills` | Array of skill strings |
| `timestamps` | Mongoose-managed creation and update times |

### Job (Gig)

| Field | Description |
|---|---|
| `title` | Required gig title, maximum 120 characters |
| `description` | Required description, maximum 4,000 characters |
| `category` | Required category |
| `tags` | Array of lowercase tags |
| `budget` | Required numeric budget, minimum 0 |
| `deadline` | Optional deadline |
| `status` | `open`, `in_progress`, `completed`, or `cancelled` |
| `owner` | Reference to the User who posted the gig |
| `assignedTo` | Optional reference to the selected applicant |
| `timestamps` | Mongoose-managed creation and update times |

The Job model defines text and status/category indexes to support searching and listing.

### Application

| Field | Description |
|---|---|
| `job` | Reference to the gig |
| `applicant` | Reference to the applying user |
| `coverLetter` | Required application message, maximum 1,500 characters |
| `status` | `pending`, `accepted`, `rejected`, or `withdrawn` |
| `timestamps` | Mongoose-managed creation and update times |

A unique compound index on `{ job, applicant }` prevents the same user from applying to the same gig more than once.

### Conversation

| Field | Description |
|---|---|
| `job` | Gig associated with the conversation |
| `participants` | User references for conversation participants |
| `lastMessage` | Most recent message preview |
| `lastMessageAt` | Time of the latest message |
| `timestamps` | Mongoose-managed creation and update times |

### Message

| Field | Description |
|---|---|
| `conversation` | Reference to the conversation |
| `sender` | User who sent the message |
| `body` | Required message text, maximum 2,000 characters |
| `readAt` | Optional read timestamp |
| `timestamps` | Mongoose-managed creation and update times |

## 9. API documentation

Base URL during local development: `http://localhost:5000/api`

### Authentication — `/auth`

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a student account | Public |
| POST | `/auth/login` | Sign in | Public |
| GET | `/auth/me` | Retrieve current user | Authenticated |
| PATCH | `/auth/me` | Update profile details | Authenticated |

### Gigs — `/jobs`

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/jobs` | List/search/filter gigs | Public |
| GET | `/jobs/:id` | Retrieve gig details | Public |
| POST | `/jobs` | Create a gig | Authenticated |
| GET | `/jobs/mine/posted` | List current user's gigs | Authenticated |
| PATCH | `/jobs/:id` | Update a gig | Owner or admin |
| DELETE | `/jobs/:id` | Delete a gig and its applications | Owner or admin |

The listing endpoint supports query parameters such as `q`, `category`, `status`, `page`, and `limit`.

### Applications — `/applications`

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/applications` | Apply to a gig | Authenticated |
| GET | `/applications/mine` | List applications submitted by current user | Authenticated |
| GET | `/applications/received` | List applications to current user's gigs | Authenticated |
| PATCH | `/applications/:id/status` | Update an application's status | Gig owner or admin |

The application creation route checks that the gig exists, is open, and is not owned by the applicant. It also handles duplicate applications.

### Messaging — `/messages`

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/messages/conversations` | List current user's conversations | Authenticated participant |
| POST | `/messages/conversations` | Start or reuse a gig conversation | Authorized gig participant |
| GET | `/messages/conversations/:id/messages` | Read conversation messages | Authenticated participant |
| POST | `/messages/conversations/:id/messages` | Send a message | Authenticated participant |

### Health check

`GET /api/health` returns an API status response when the server is running and connected to the database.

## 10. Installation and local setup

### Prerequisites

- Node.js 18 or newer (Node.js 20 LTS recommended).
- npm (included with Node.js).
- MongoDB Atlas account or a local MongoDB installation.
- Git (recommended).
- Visual Studio Code or another code editor.

### Step 1 — Open the project

Extract the project ZIP and open the `campusgigs` folder in VS Code.

### Step 2 — Install dependencies

From the project root terminal:

```bash
npm install
npm run install:all
```

### Step 3 — Configure the backend

Copy the example environment file:

```bash
cp server/.env.example server/.env
```

On Windows Command Prompt, you can use:

```bat
copy server\.env.example server\.env
```

Open `server/.env` and configure the MongoDB connection string and a strong JWT secret. Do not share this file or commit it to GitHub.

### Step 4 — Configure the frontend

The frontend example file is `client/.env.example`. For local development it contains:

```env
VITE_API_URL=http://localhost:5000/api
```

If needed, copy it to `client/.env`.

### Step 5 — Configure MongoDB

For MongoDB Atlas:
1. Create a database cluster.
2. Create a database user and password.
3. Configure Network Access for the development machine.
4. Copy the connection string from Atlas.
5. Put the connection string in `MONGODB_URI` inside `server/.env`.
6. Use the database name `campusgigs` in the connection string.

For local MongoDB, the example URI is:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/campusgigs
```

## 11. Environment variables

### Backend — `server/.env`

| Variable | Purpose |
|---|---|
| `PORT` | API port; defaults to `5000` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `CLIENT_URL` | Allowed frontend origin for CORS |

Example values are provided in `server/.env.example`. Replace the example secret and database URI with your own private values.

### Frontend — `client/.env`

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | API base URL; local default is `http://localhost:5000/api` |

Only non-secret configuration should be exposed through Vite variables. Never put database credentials or JWT signing secrets in frontend environment variables.

## 12. Running and building the application

### Start frontend and backend together

From the project root:

```bash
npm run dev
```

Expected local addresses:
- Frontend: `http://localhost:5173`
- API: `http://localhost:5000`
- Health endpoint: `http://localhost:5000/api/health`

### Run services separately

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend, in another terminal:

```bash
cd client
npm install
npm run dev
```

### Build the frontend

```bash
cd client
npm run build
```

Vite writes the production build to `client/dist`.

## 13. Module 1 work plan and status

**Official Module 1 title:** Planning, UI, and setup  
**Official dates:** October 26 – November 1, 2026

The internship proposal defines the following Module 1 activities:

| Planned activity | Evidence in supplied project | Status |
|---|---|---|
| Confirm requirements and user roles | Project overview and buyer/seller activity model documented; one account can post and apply | Documented |
| Set up React/Vite and Express | Client and server package files and source structure are present | Present in source |
| Configure MongoDB Atlas and environment variables | `.env.example` files and database connection logic are present | Configuration required on each machine |
| Design responsive home, explore, authentication, and dashboard layouts | React UI and stylesheet are present | Present in source; verify in browser |
| Draft User, Gig, Application, and Message schemas | User, Job, Application, Conversation, and Message Mongoose models are present | Present in source |
| Establish initial project structure and database connection | Root/client/server structure and Mongoose connection startup are present | Present in source; verify with local environment |

### Module 1 deliverables

- MERN project folder structure.
- React/Vite frontend and Express backend setup.
- MongoDB connection configuration.
- Initial responsive UI.
- Mongoose data-model plan and model files.
- README and setup documentation.

### Module 1 completion evidence to add before submission

- [ ] Screenshot of the CampusGigs home page.
- [ ] Screenshot of the Explore Gigs page.
- [ ] Screenshot of registration/login UI.
- [ ] Screenshot of the dashboard.
- [ ] Screenshot of the successful API health endpoint.
- [ ] Screenshot or terminal evidence of successful MongoDB connection.
- [ ] Confirm the GitHub repository contains source files but no `.env` secrets.

Do not mark a test as passed until it has been run and verified on your machine.

## 14. Testing checklist

Use this checklist during local verification:

### Setup and connectivity
- [ ] `npm install` completes successfully.
- [ ] `npm run install:all` completes successfully.
- [ ] Backend connects to MongoDB.
- [ ] `GET /api/health` returns a successful response.
- [ ] Frontend opens at the Vite development URL.

### Authentication and profile
- [ ] Register a new test account.
- [ ] Sign in with the test account.
- [ ] Confirm an incorrect password is rejected.
- [ ] Update profile name, bio, and skills.

### Gigs and applications
- [ ] Create a gig.
- [ ] Confirm the gig appears in Explore.
- [ ] Search and filter gigs.
- [ ] Confirm the gig owner cannot apply to their own gig (backend check is present in source).
- [ ] Apply from a different test account.
- [ ] Confirm duplicate application is rejected.
- [ ] Review an application as the gig owner.

### Messaging
- [ ] Start or open a conversation related to a gig.
- [ ] Send a message.
- [ ] Confirm a non-participant cannot access the conversation.

## 15. Security considerations

The supplied source includes:
- Password hashing with bcryptjs.
- JWT authentication middleware for protected endpoints.
- Password hash excluded from normal User queries.
- Gig ownership checks for editing and deleting gigs.
- A server-side check preventing users from applying to their own gigs.
- A unique compound index preventing duplicate applications.
- Participant checks for conversation and message access.
- Helmet security headers.
- CORS origin configuration.
- API rate limiting.
- Server-side request validation and centralized error handling.

Security practices for contributors:
- Keep `.env` files private.
- Use a strong, unique `JWT_SECRET`.
- Do not commit database credentials or tokens.
- Use HTTPS for deployed environments.
- Restrict MongoDB Atlas network access and database permissions appropriately.

## 16. Known limitations and future improvements

The following are improvements, not claims of already-completed functionality:

- Add the dedicated Buyer/Seller dashboard mode switcher while retaining one account for both activities.
- Add a frontend Apply-button state that hides or disables applying on the user's own gig; retain the existing backend ownership check as the security control.
- Add automated tests for authentication, gig permissions, applications, and messaging.
- Add email verification and password reset.
- Consider secure HttpOnly-cookie authentication for production.
- Add real-time messaging and notifications if required.
- Add an admin provisioning workflow.
- Complete production deployment and record verified public URLs.
- Add final screenshots and a deployment link after those items are available.

## 17. Deployment overview

The project can be deployed using MongoDB Atlas for the database, a Node-compatible hosting provider for the API, and a static hosting provider for the frontend.

### API hosting configuration

- Root directory: `server`
- Build/install command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and optionally `PORT`

### Frontend hosting configuration

- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL` set to the deployed API base URL ending in `/api`

After deploying, update the API's `CLIENT_URL` to the exact frontend origin. Verify the API health endpoint and complete the smoke tests. Hosting free tiers and limits can change.

A deployment guide is also included in `DEPLOYMENT-GUIDE.md`. The supplied project archive does not establish that a public deployment has already been completed.

## 18. Author

**Intern:** Sarfaraz Haleem  
**Organization:** Zynvex Solutions — Batch 5 Virtual Internship  
**Track:** MERN Stack  
**Project:** CampusGigs — Micro-Freelance Marketplace for Students

---

*This README documents the supplied project source and the planned Module 1 scope. Features or tests marked as planned, pending, or requiring verification should not be represented as completed until they have been implemented and tested.*
