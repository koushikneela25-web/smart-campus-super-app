# Smart Campus Super App — Render Backend Deployment Guide

This guide details the exact process for deploying the Java 21 + Spring Boot 3 backend as a Docker-based **Web Service** on **Render** ([render.com](https://render.com)).

---

## 1. Prerequisites
- A free [Render account](https://dashboard.render.com).
- GitHub repository containing the Smart Campus Super App source code.
- Local MySQL instance running and connected via a secure TCP tunnel (see [secure-local-mysql-networking.md](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/secure-local-mysql-networking.md)).

---

## 2. Option A: Deployment via Render Blueprint (Automated)
The repository contains both root `render.yaml` and `backend/render.yaml` blueprint configurations.

1. Navigate to [Render Dashboard -> Blueprints](https://dashboard.render.com/blueprints).
2. Click **New Blueprint Instance**.
3. Select and connect your repository: `smart-campus-super-app`.
4. Render will parse `render.yaml` and discover the `smart-campus-backend` web service.
5. In the blueprint variables prompt, specify:
   - `DB_HOST`: Your reachable tunnel hostname (e.g., `4.tcp.ngrok.io`)
   - `DB_PORT`: Forwarded TCP port (e.g., `19423`)
   - `DB_USERNAME`: `campus_app_user`
   - `DB_PASSWORD`: Your local database password (e.g., `Campus@Secure2026!`)
   - `APP_CORS_ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g., `https://smart-campus-super-app.vercel.app,https://*.vercel.app`)
6. Click **Apply**. Render will automatically build the multi-stage Docker image, package the Spring Boot JAR, and start the service.

---

## 3. Option B: Manual Web Service Creation (Step-by-Step)
If configuring manually via the Render UI:

1. In the Render Dashboard, click **New +** -> **Web Service**.
2. Under "Connect a repository", choose `smart-campus-super-app`.
3. Fill in the service configuration:
   - **Name**: `smart-campus-backend`
   - **Region**: Choose closest to you (e.g., Singapore, Oregon, Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `Dockerfile` (or `./backend/Dockerfile` if Root Directory is left empty)
   - **Instance Type**: **Free**
4. Expand **Advanced Settings**:
   - **Health Check Path**: `/actuator/health`
   - **Auto-Deploy**: `Yes` (automatically redeploys when new commits are pushed)
5. Add the following **Environment Variables**:

| Variable Key | Value | Description |
|---|---|---|
| `PORT` | `10000` | Port assigned by Render (Docker container binds to `0.0.0.0:${PORT:-8080}`) |
| `SPRING_PROFILES_ACTIVE` | `prod` | Activates production profile |
| `DB_HOST` | `4.tcp.ngrok.io` | Reachable hostname from your secure tunnel to local MySQL |
| `DB_PORT` | `19423` | Forwarded TCP port of your local MySQL tunnel |
| `DB_NAME` | `smart_campus_db` | MySQL database name |
| `DB_USERNAME` | `campus_app_user` | Dedicated application user (never use root) |
| `DB_PASSWORD` | `Campus@Secure2026!` | Dedicated user password |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit secret for signing JWT tokens |
| `JWT_EXPIRATION_MS` | `86400000` | 24-hour token validity |
| `APP_CORS_ALLOWED_ORIGINS` | `https://*.vercel.app,http://localhost:5173` | Allowed CORS origins for Vercel SPA |

6. Click **Create Web Service**.

---

## 4. Deployment Verification & Diagnostic Inspection

### Check 1: Multi-Stage Docker Build Logs
In the Render build log, you will observe:
1. `FROM eclipse-temurin:21-jdk-jammy AS builder`
2. Maven builds dependencies and packages `smart-campus-backend.jar`.
3. Minimal JRE 21 production image copied to final stage.
4. Non-root user `campus` created for runtime isolation.

### Check 2: Spring Boot Container Startup Logs
In the runtime logs:
```text
Tomcat started on port 10000 (http) with context path ''
Started SmartCampusApplication in 4.821 seconds (process running for 5.342)
```

### Check 3: Actuator Health Endpoint
Visit in your browser:
```text
https://<YOUR-RENDER-SERVICE-NAME>.onrender.com/actuator/health
```
Expected response:
```json
{
  "status": "UP"
}
```

### Check 4: OpenAPI / Swagger UI
Visit in your browser:
```text
https://<YOUR-RENDER-SERVICE-NAME>.onrender.com/swagger-ui.html
```
Explore and test all interactive REST API endpoints.

---

## 5. Connecting Your Vercel Frontend
Once Render provides your live backend URL (e.g., `https://smart-campus-backend.onrender.com`):
1. Copy this URL.
2. Go to your Vercel Project Settings -> **Environment Variables**.
3. Set `VITE_API_BASE_URL` to `https://smart-campus-backend.onrender.com/api/v1`.
4. Redeploy the Vercel project.
