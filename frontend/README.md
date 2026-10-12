# Smart Campus Super App — Frontend (React 18 + Vite + TypeScript)

## Overview
The frontend client provides a modern, responsive user experience for Students, Faculty, and Administrators.

## Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React
- **Routing**: React Router DOM v6 (role-guarded layouts)
- **Data & Queries**: Axios + TanStack Query
- **Charts**: Recharts
- **QR Codes**: `qrcode.react` (SVG generator)

## Local Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Open in browser: `http://localhost:5173`

## Production Build
```bash
npm run build
```
Generates production assets in `dist/`.

## Deployment to Vercel
1. Import repository on Vercel.
2. Set Root Directory to `frontend`.
3. Set environment variable `VITE_API_BASE_URL` to your production backend URL.
4. Deploy! SPA routing is automatically handled via `vercel.json`.
