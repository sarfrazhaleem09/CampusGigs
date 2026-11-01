# CampusGigs — Fast deployment guide (beginner-friendly)

This project is source code, not a hosted website yet. You need to deploy the API and frontend and connect a MongoDB database.

## 1. Create the database (MongoDB Atlas)
1. Create/sign in to a MongoDB Atlas account and create a free database cluster if available in your region/account.
2. Create a database user with a strong password. This is separate from your CampusGigs login.
3. In Network Access, allow access from your deployment provider. For a short internship demo, `0.0.0.0/0` may be used only if you understand it allows network access from any IP; use a strong database password and restrict access again after the demo where practical.
4. Select Connect → Drivers and copy the connection string. Replace the password placeholder and set the database name to `campusgigs`.

## 2. Push the source to GitHub
1. Extract the ZIP and open the `campusgigs` folder in VS Code.
2. Make sure `.env` files are not committed. `.gitignore` excludes `.env` and `node_modules`.
3. Create a GitHub repository and push the project folder. Do not put database credentials or JWT secrets in source code.

## 3. Deploy the API (Render or another Node host)
Create a new Web Service from the GitHub repository:
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Runtime: Node

Set these environment variables in the hosting dashboard:
- `MONGODB_URI` = your Atlas connection string
- `JWT_SECRET` = a long random secret (at least 32 random characters)
- `CLIENT_URL` = the exact public URL of your deployed frontend (update after step 4)
- `NODE_ENV` = `production`

After deployment, open `https://YOUR-API-HOST/api/health`. Expected JSON includes `"status":"ok"`. If it fails, inspect the host logs and verify the database URI and Atlas network access.

## 4. Deploy the frontend
Create a Static Site from the same repository:
- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL` = `https://YOUR-API-HOST/api`

Replace `YOUR-API-HOST` with the real API hostname. After deployment, copy the frontend URL into the API service's `CLIENT_URL` and redeploy/restart the API.

## 5. Smoke test before submitting
1. Visit the frontend public URL.
2. Create a test student account using an email you control and a unique password.
3. Sign in, post a test gig, and confirm it appears under Explore.
4. Sign up with a second test account and try applying to that gig.
5. Check the dashboard and application status controls.
6. Test the API health endpoint.
7. Do not claim features passed testing unless you personally verified them on the deployed site.

## Local development (Windows / VS Code)
1. Install Node.js LTS.
2. Open a terminal in this folder.
3. Run `npm install`, then `npm run install:all`.
4. Copy `server/.env.example` to `server/.env`; set `MONGODB_URI` and `JWT_SECRET`.
5. Start a MongoDB instance or use Atlas.
6. Run `npm run dev` and open `http://localhost:5173`.

## Notes
- Free hosting plans and free database availability/limits can change. Check the provider dashboard before relying on a free tier.
- The frontend may show demo cards if the API/database is unavailable. Demo cards are previews and cannot accept real applications.
- This project is an internship prototype. Before production use, add automated tests, password reset/email verification, stricter deployment-specific CORS, and secure HttpOnly-cookie authentication.
