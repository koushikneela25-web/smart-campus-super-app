# Smart Campus Super App — Troubleshooting & Diagnostics Guide

This guide covers common issues and their exact resolutions across local development, MySQL, networking, Spring Boot, React, Render, and Vercel.

---

## 1. Local MySQL Connection Issues

### Issue 1.1: `Communications link failure` on Spring Boot Startup
- **Symptom**: `com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure. The last packet sent successfully to the server was 0 milliseconds ago.`
- **Cause**: MySQL server is not running on port 3306 or has not finished starting.
- **Resolution**:
  1. Verify port 3306 is listening in Windows PowerShell:
     ```powershell
     Test-NetConnection -ComputerName 127.0.0.1 -Port 3306
     ```
  2. If `TcpTestSucceeded: False`, start MySQL / MariaDB:
     ```powershell
     net start MySQL80
     # Or if using local MariaDB/MySQL binary:
     & ".\mariadb-10.11.8-winx64\bin\mysqld.exe" --datadir=.\mariadb-data --port=3306 --console
     ```

### Issue 1.2: `Access denied for user 'campus_app_user'@'localhost'`
- **Symptom**: `java.sql.SQLException: Access denied for user 'campus_app_user'@'localhost' (using password: YES)`
- **Cause**: Database user has not been created or the password does not match `DB_PASSWORD`.
- **Resolution**:
  Run the initialization script as root:
  ```powershell
  mysql -u root -p < backend\database\setup-local-mysql.sql
  ```
  Ensure `DB_PASSWORD` in your backend `.env` matches the password specified in `setup-local-mysql.sql` (default: `Campus@Secure2026!`).

### Issue 1.3: `Unknown database 'smart_campus_db'`
- **Symptom**: `java.sql.SQLSyntaxErrorException: Unknown database 'smart_campus_db'`
- **Resolution**:
  Log into MySQL and create the database:
  ```sql
  CREATE DATABASE smart_campus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

---

## 2. Flyway Migration Errors

### Issue 2.1: `Flyway Validate failed: Migrations have failed validation`
- **Cause**: A checksum mismatch occurred because an existing migration script was modified after being executed.
- **Resolution**:
  Spring Boot has `spring.flyway.repair-on-migrate: true` enabled in `application.yml`.
  You can also run repair explicitly via Maven:
  ```powershell
  cd backend
  mvn flyway:repair
  ```

---

## 3. Remote Render to Local MySQL Tunnel Issues

### Issue 3.1: Render Backend Shows `Database connection timeout`
- **Symptom**: Render container logs show connection attempts hanging until timing out.
- **Cause**:
  1. Your Windows PC went to sleep or lost Wi-Fi connection.
  2. The `ngrok tcp 3306` or Cloudflare tunnel process closed.
  3. ngrok assigned a new port on restart, but Render's `DB_PORT` / `DB_HOST` was not updated.
- **Resolution**:
  1. Keep PC awake during cloud testing.
  2. Verify the ngrok terminal window is still active:
     ```powershell
     ngrok tcp 3306
     ```
  3. Ensure Render environment variables match the current session's host and port:
     - `DB_HOST`: e.g. `4.tcp.ngrok.io`
     - `DB_PORT`: e.g. `19423`

---

## 4. CORS (Cross-Origin Resource Sharing) Issues

### Issue 4.1: `Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy`
- **Symptom**: Browser console shows red CORS error when React attempts to call the backend.
- **Cause**: The backend does not whitelist the Vercel domain.
- **Resolution**:
  Update `APP_CORS_ALLOWED_ORIGINS` in your Render Environment Variables:
  ```env
  APP_CORS_ALLOWED_ORIGINS=https://smart-campus-super-app.vercel.app,https://*.vercel.app,http://localhost:5173
  ```
  The Spring Boot `SecurityConfig` uses `setAllowedOriginPatterns(origins)` which correctly resolves wildcard subdomains on Vercel preview URLs.

---

## 5. Frontend & Vercel Routing Issues

### Issue 5.1: 404 Not Found on Page Refresh
- **Symptom**: Navigating to `https://smart-campus-super-app.vercel.app/student/attendance` and refreshing the page shows Vercel 404 page.
- **Cause**: Vercel edge router does not know the URL corresponds to an internal client-side React Router route.
- **Resolution**:
  Verify `frontend/vercel.json` exists with the rewrite rule:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
  Ensure Vercel project root directory is set to `frontend`.

### Issue 5.2: `Network Error` or Unhandled Promise Rejection in Frontend
- **Symptom**: Frontend forms show loading spinners indefinitely or log `Network Error`.
- **Cause**: `VITE_API_BASE_URL` is undefined or pointing to an unbooted backend.
- **Resolution**:
  In Vercel -> Project Settings -> Environment Variables:
  Set `VITE_API_BASE_URL` to `https://<YOUR-RENDER-APP>.onrender.com/api/v1` (with `/api/v1` suffix).

---

## 6. Java & Maven Windows Issues

### Issue 6.1: `javac: release version 21 not supported`
- **Cause**: Maven is running under an older JDK (e.g. Java 11 or 17).
- **Resolution**:
  Verify active Java version in PowerShell:
  ```powershell
  java -version
  ```
  Set `JAVA_HOME` to your JDK 21+ installation directory:
  ```powershell
  $env:JAVA_HOME = "C:\Program Files\Java\jdk-25"
  $env:Path = "$env:JAVA_HOME\bin;" + $env:Path
  ```
