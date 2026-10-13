# Smart Campus Super App — Vercel Frontend Deployment Guide

This guide details the deployment of the React 18 + TypeScript + Vite frontend on **Vercel** ([vercel.com](https://vercel.com)).

---

## 1. Project Configuration Overview
The frontend is built with:
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons + Recharts
- **Router**: React Router v6 with SPA rewrites (`vercel.json`)
- **API Client**: Centralized Axios client with automatic Bearer token interceptor

---

## 2. Step-by-Step Vercel Deployment

### Step 1: Sign Up / Log In to Vercel
Go to [vercel.com](https://vercel.com) and log in with your GitHub account.

### Step 2: Import GitHub Repository
1. In the Vercel dashboard, click **Add New...** -> **Project**.
2. Select your repository: `smart-campus-super-app`.
3. In the project import screen:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: Click **Edit** and select `frontend` (critical!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables
Under the **Environment Variables** section, add:

| Key | Example Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://smart-campus-backend.onrender.com/api/v1` | URL of your deployed Render Spring Boot backend |

> [!NOTE]
> During local testing, this variable defaults to `http://localhost:8080/api/v1` via `.env`. On Vercel, set it to your live Render backend URL. Never put database credentials in Vercel environment variables.

### Step 4: Deploy
Click **Deploy**. Vercel will:
1. Install npm packages (`@types/*`, `react`, `lucide-react`, `recharts`, `tailwindcss`, etc.).
2. Execute TypeScript type checking (`tsc`).
3. Bundle and minify assets with Vite into `dist/`.
4. Deploy the static assets across Vercel's global CDN edge network.

---

## 3. Client-Side Routing Configuration (`vercel.json`)
To ensure that direct navigation or refreshing a deep route (e.g., `/student/attendance` or `/admin/users`) does not return a 404 error, the repository includes `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```
This rewrite instructs Vercel edge routers to serve `index.html` for all client-side routes, enabling React Router DOM to manage application transitions seamlessly.

---

## 4. Verification & Testing Post-Deployment
1. Open the assigned Vercel URL (e.g., `https://smart-campus-super-app.vercel.app`).
2. Verify the Landing Page loads with all images, cards, and styling.
3. Click **Sign In** -> check console network tab to verify requests target `https://<YOUR-RENDER-BACKEND>/api/v1/auth/login`.
4. Test login using demo credentials (e.g. `admin@campus.edu` / `Admin@123`).
5. Refresh a nested page (e.g. `https://smart-campus-super-app.vercel.app/student/attendance`) to ensure SPA routing reloads cleanly without 404.
