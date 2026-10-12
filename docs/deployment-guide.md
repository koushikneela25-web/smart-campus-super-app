# Smart Campus Super App — Deployment Guide

## 1. Deployment Architecture Summary
- **Frontend**: Deployed on **Vercel** Edge Network (React 18, Vite, TypeScript SPA).
- **Backend**: Containerized Spring Boot 3.3.4 (Java 21) deployed on **Railway**.
- **Database**: Local **MySQL 8.x** running on developer host, connected to Railway via encrypted tunnel.

---

## 2. Frontend Deployment to Vercel

### Step 1: Push Repository to GitHub
Ensure the project is pushed to your GitHub account:
```bash
git add .
git commit -m "feat: complete smart campus super app full stack codebase"
git push origin main
```

### Step 2: Import Project in Vercel
1. Log in to [vercel.com](https://vercel.com/) with GitHub.
2. Click **Add New...** -> **Project**.
3. Select your repository `smart-campus-super-app`.
4. In the configuration screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (Click **Edit** and choose `frontend`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables
In the Vercel Project Settings under **Environment Variables**, add:
```env
VITE_API_BASE_URL=https://<your-railway-app-name>.up.railway.app/api/v1
```

### Step 4: Verify Single-Page Application (SPA) Routing
A verified `frontend/vercel.json` file is already included in the codebase:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures direct URLs (e.g. `/student/attendance`, `/faculty`, `/admin/timetable`) resolve directly without 404 errors on page reloads.

---

## 3. Backend Deployment to Railway

### Step 1: Create Railway Project
1. Log in to [railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select the repository.

### Step 2: Set Service Root Directory & Dockerfile
1. Click the created service, navigate to **Settings**.
2. Set **Root Directory**: `backend`
3. Under **Build**, Railway will detect the included production [Dockerfile](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/backend/Dockerfile).

### Step 3: Configure Railway Environment Variables
Under the **Variables** tab of the backend service, configure:
```env
# Server Port
PORT=8080

# Database Connection (Routed to your local machine via Cloudflare Tunnel / ngrok)
DB_HOST=<tunnel-hostname-or-ngrok-host>
DB_PORT=<tunnel-port>
DB_NAME=smart_campus_db
DB_USER=campus_app_user
DB_PASSWORD=CampusApp@Secure2026

# JWT Security
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION_MS=86400000
JWT_REFRESH_EXPIRATION_MS=604800000

# CORS Whitelist (Your Vercel Deployment Domain)
CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>.vercel.app,http://localhost:5173,http://localhost:3000
```

### Step 4: Generate Public Domain
Under the **Settings** tab -> **Networking** -> Click **Generate Domain**.
Copy this URL (e.g., `https://smart-campus-backend.up.railway.app`) and configure it as `VITE_API_BASE_URL` in your Vercel frontend.

---

## 4. Local Full-Stack Development Workflow

To run both frontend and backend entirely on your local machine:

### Terminal 1: Backend (Spring Boot)
Ensure MySQL is running on `127.0.0.1:3306`, then execute:
```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\koush\.gemini\antigravity-ide\scratch\run_mvn.ps1 -Command "spring-boot:run"
```
The backend initializes at `http://localhost:8080` with Swagger UI at `http://localhost:8080/swagger-ui/index.html`.

### Terminal 2: Frontend (Vite Dev Server)
```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\koush\.gemini\antigravity-ide\scratch\run_npm.ps1 -Command "run dev"
```
The frontend starts at `http://localhost:5173`.
