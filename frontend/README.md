# Smart Campus Super App — Frontend (React 18 + Vite + TypeScript)

## Overview
The frontend client provides a modern, responsive collegiate web application for Students, Faculty, and Administrators.

## Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React
- **Routing**: React Router DOM v6 (role-guarded layouts with SPA rewrites via `vercel.json`)
- **Data & Queries**: Axios + TanStack Query
- **Charts**: Recharts
- **QR Codes**: `qrcode.react` (SVG generator)

## Local Quick Start (Windows PowerShell)
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start development server:
   ```powershell
   npm run dev
   ```
3. Open in browser: `http://localhost:5173`

## Production Build Validation
```powershell
npm run build
```
Generates production assets in `dist/`.

## Deployment to Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Set environment variable:
   `VITE_API_BASE_URL=https://smart-campus-backend.onrender.com/api/v1`
4. Deploy! SPA routing is automatically handled via `vercel.json`. See [docs/vercel-deployment.md](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/vercel-deployment.md).
