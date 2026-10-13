# Smart Campus Super App — Environment Variable Reference Guide

This document catalogs every environment variable used across the React frontend and Spring Boot backend, detailing their descriptions, local development fallbacks, and production deployment values.

---

## 1. Backend Environment Variables (Spring Boot)

Configured in `backend/src/main/resources/application.yml`, `.env`, or Render Dashboard.

| Variable | Description | Local Development Default | Render Web Service Value |
|---|---|---|---|
| `PORT` | HTTP port for embedded Tomcat server | `8080` (or `SERVER_PORT`) | Automatically injected by Render (e.g. `10000`) |
| `SERVER_PORT` | Fallback port variable | `8080` | `10000` |
| `SPRING_PROFILES_ACTIVE` | Active Spring configuration profile | `local` | `prod` |
| `DB_HOST` | Hostname or IP of the MySQL database | `127.0.0.1` | Reachable tunnel host (e.g. `4.tcp.ngrok.io`) |
| `DB_PORT` | Port of the MySQL database | `3306` | Forwarded tunnel port (e.g. `19423`) |
| `DB_NAME` | MySQL database schema name | `smart_campus_db` | `smart_campus_db` |
| `DB_USERNAME` | Dedicated application MySQL user | `campus_app_user` | `campus_app_user` |
| `DB_PASSWORD` | Application user database password | `Campus@Secure2026!` | Your local database user password |
| `JWT_SECRET` | 256-bit cryptographic key for HMAC-SHA256 JWT tokens | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | Secure high-entropy string generated on Render |
| `JWT_EXPIRATION_MS` | Access token lifespan in milliseconds | `86400000` (24 hours) | `86400000` |
| `JWT_REFRESH_EXPIRATION_MS` | Refresh token lifespan in milliseconds | `604800000` (7 days) | `604800000` |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins | `http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000` | `https://smart-campus-super-app.vercel.app,https://*.vercel.app,http://localhost:5173` |
| `UPLOAD_DIR` | Directory path for local file and image storage | `./uploads` | `/app/uploads` |

---

## 2. Frontend Environment Variables (React + Vite)

Configured in `frontend/.env` or Vercel Dashboard.

| Variable | Description | Local Development Default | Vercel Production Value |
|---|---|---|---|
| `VITE_API_BASE_URL` | Base URL for the Spring Boot REST API | `http://localhost:8080/api/v1` | `https://smart-campus-backend.onrender.com/api/v1` |

> [!WARNING]
> **Security Separation Principle**:
> Never configure database credentials (`DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`), or backend signing keys (`JWT_SECRET`) in Vercel. Frontend clients only interact with the Spring Boot REST API via HTTPS JSON requests with bearer tokens. All persistence credentials reside strictly on the backend.
