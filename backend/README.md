# Smart Campus Super App — Backend (Spring Boot 3.3.4 + Java 21)

## Overview
The backend service powers the Smart Campus Super App. It is built using Java 21, Spring Boot 3.3.4, Spring Security 6 with stateless JWT authentication, Spring Data JPA / Hibernate, Flyway migrations, and a local MySQL database engine.

## Prerequisites
- **Java**: JDK 21+ (Compatible with JDK 25 LTS)
- **Maven**: 3.9+
- **Database**: Local MySQL 8.x running on `127.0.0.1:3306`

## Local Quick Start
1. Ensure MySQL is running and the database is initialized:
   ```bash
   mysql -u root -p < database/setup-local-mysql.sql
   ```
2. Run test suite:
   ```bash
   mvn test
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. Access OpenAPI / Swagger UI:
   `http://localhost:8080/swagger-ui/index.html`

## Configuration
All configuration variables are defined in `src/main/resources/application.yml` and can be overridden via environment variables:
- `DB_HOST` (Default: `127.0.0.1`)
- `DB_PORT` (Default: `3306`)
- `DB_NAME` (Default: `smart_campus_db`)
- `DB_USER` (Default: `campus_app_user`)
- `DB_PASSWORD` (Default: `CampusApp@Secure2026`)
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
