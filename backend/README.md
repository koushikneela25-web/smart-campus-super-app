# Smart Campus Super App — Backend (Spring Boot 3.3.4 + Java 21)

## Overview
The backend service powers the Smart Campus Super App. It is built using Java 21, Spring Boot 3.3.4, Spring Security 6 with stateless JWT authentication, Spring Data JPA / Hibernate, Flyway migrations, and connects exclusively to a persistent MySQL database engine (`smart_campus_db`).

## Prerequisites
- **Java**: JDK 21+ (Compatible with JDK 25 LTS)
- **Maven**: 3.9+ (or included Windows Maven Wrapper `mvnw.cmd`)
- **Database**: Local MySQL 8.x running on `127.0.0.1:3306`

## Local Quick Start (Windows PowerShell)
1. Ensure MySQL is running and initialize the database:
   ```powershell
   mysql -u root -p < database\setup-local-mysql.sql
   ```
2. Run test suite:
   ```powershell
   .\mvnw.cmd test
   ```
3. Run the application:
   ```powershell
   .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
   ```
4. Access OpenAPI / Swagger UI:
   `http://localhost:8080/swagger-ui.html`
5. Access Actuator Health Check:
   `http://localhost:8080/actuator/health`

## Environment Variables
Configured in `src/main/resources/application.yml` and overridable via environment variables:
- `DB_HOST` (Default: `127.0.0.1`)
- `DB_PORT` (Default: `3306`)
- `DB_NAME` (Default: `smart_campus_db`)
- `DB_USERNAME` (Default: `campus_app_user`)
- `DB_PASSWORD` (Default: `Campus@Secure2026!`)
- `JWT_SECRET`
- `PORT` (Provided by Render in production, default: `8080`)
- `APP_CORS_ALLOWED_ORIGINS`

## Deployment to Render
The backend is packaged as a multi-stage Docker image in `Dockerfile` and configured via `render.yaml`. See [docs/render-deployment.md](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/render-deployment.md).
