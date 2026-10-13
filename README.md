# SMART CAMPUS SUPER APP
### Full-Stack Collegiate Management & Smart Campus Web Application
**Individual BTech Engineering Project**

---

## 1. Project Overview
The **Smart Campus Super App** is an enterprise-grade full-stack web application architected to digitize and unify university operations for **Students**, **Faculty**, and **Administrators**. It integrates:
- **Dynamic Temporary QR Attendance** with optional **Haversine GPS Geofencing**
- **Conflict-Checked Academic Timetable Builder** (zero classroom, instructor, or section collisions)
- **Real-Time Campus Event Reservations** with atomic seat capacity locks
- **Moderated Lost & Found Desk** with verified proof-of-ownership claim submission
- **Campus Broadcast Announcements** & In-App Persistent Notifications
- **Role-Based Analytics Dashboards** powered by real MySQL data and interactive **Recharts** visualizations
- **Stateless Role-Based JWT Security** with BCrypt password encryption and comprehensive audit logging

---

## 2. Technology Stack & Deployment Architecture

```
+-----------------------------------------------------------------------------------+
|                                 FRONTEND                                          |
| React 18 | TypeScript | Vite | Tailwind CSS | Lucide React | Recharts | Vercel SPA    |
+-----------------------------------------------------------------------------------+
                                          |
                               [HTTPS / REST APIs]
                                          v
+-----------------------------------------------------------------------------------+
|                                 BACKEND                                           |
| Java 21 | Spring Boot 3.3.4 | Spring Security 6 (JWT) | Spring Data JPA | Render  |
+-----------------------------------------------------------------------------------+
                                          |
                        [Encrypted Tunnel / VPN Bridge]
                                          v
+-----------------------------------------------------------------------------------+
|                             DATABASE (LOCAL HOST)                                 |
| Local MySQL 8.x Engine (127.0.0.1:3306) | Flyway Migrations (21 Relational Tables)|
+-----------------------------------------------------------------------------------+
```

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router 6, Axios, Recharts, `qrcode.react`. Deployed on **Vercel**.
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Security, Hibernate ORM, Flyway, Springdoc OpenAPI. Deployed on **Render** as a Web Service (Docker).
- **Database**: Local MySQL 8.x engine exclusively (`smart_campus_db`). Connected to Render via secure tunneling (ngrok TCP / Cloudflare Tunnel / Tailscale).

---

## 3. Demo Credentials for Evaluators

The database comes pre-seeded with BCrypt-hashed credentials for immediate evaluation:

| Role | Email / Identifier | College ID | Password | Scope & Responsibilities |
|---|---|---|---|---|
| **Administrator** | `admin@campus.edu` | `ADM001` | `Admin@123` | Institutional Analytics, User Directory, Academics & Rooms, Timetable Builder, Audit Telemetry |
| **Faculty** | `faculty.cs@campus.edu` | `FAC101` | `Faculty@123` | Dynamic QR Generator, Geofence Radius Setup, Live Check-In Stream, CSV Attendance Reports |
| **Student** | `student.cs@campus.edu` | `STU1001` | `Student@123` | Check-in via QR Token / GPS Location, Timetable Schedule, Event RSVPs, Lost & Found Reports |

*The landing page and login page also feature 1-click Quick-Fill buttons for effortless evaluation.*

---

## 4. Key Functional Modules

### 4.1 Attendance Management Engine
- **Dynamic QR Tokens**: Cryptographically generated 64-character UUID tokens that automatically expire within 5–15 minutes.
- **Haversine Geofencing**: Validates that student coordinates are within the configured radial boundary of the classroom before marking attendance.
- **Duplicate Prevention**: Database-level unique constraint on `(session_id, student_id)`.
- **CSV Reports**: Direct export of session records with timestamp, status, and GPS distance.

### 4.2 Conflict-Aware Academic Timetable
- **Three-Dimensional Collision Detection**: Validates that neither the instructor, the classroom, nor the section cohort has an overlapping lecture prior to persistence.
- **Schedule Views**: Daily tabbed view and full weekly grid view.

### 4.3 Campus Events & Capacity Locking
- **Optimistic Capacity Control**: Displays real-time seating progress bars. Automatically disables booking when the auditorium capacity is reached.
- **RSVP Management**: Students can reserve and cancel spots in one click.

### 4.4 Lost & Found Claims Desk
- **Community Notice Board**: Searchable catalog of lost belongings and turned-in property.
- **Verification Workflow**: Claimants submit confidential proof of ownership, which administrators review and approve/reject before releasing the property.

### 4.5 Security & Audit Telemetry
- **Role-Based Guards**: Protected frontend routes and `@PreAuthorize` annotated backend endpoints.
- **Audit Logs**: Every login attempt, timetable modification, and user status change is recorded with the client's origin IP address.

---

## 5. Repository Structure
```
smart-campus-super-app/
├── frontend/                             # React 18 + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── api/                          # Strongly-typed Axios REST clients
│   │   ├── components/                   # Reusable UI component library
│   │   ├── contexts/                     # Authentication context & provider
│   │   ├── layouts/                      # DashboardLayout & Navigation
│   │   ├── pages/                        # Public & shared pages
│   │   │   ├── student/                  # Student portal pages
│   │   │   ├── faculty/                  # Faculty console pages
│   │   │   └── admin/                    # Admin analytics & management pages
│   │   ├── routes/                       # ProtectedRoute & AppRoutes
│   │   └── types/                        # TypeScript domain interfaces
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── vercel.json                       # Vercel SPA routing rewrites
│   ├── .env.example
│   └── README.md
├── backend/                              # Java Spring Boot 3.3.4 Backend
│   ├── database/
│   │   └── setup-local-mysql.sql         # Bootstrap script for smart_campus_db
│   ├── src/main/java/com/smartcampus/    # Modular domain packages
│   │   ├── auth/                         # Authentication & JWT controllers
│   │   ├── attendance/                   # Dynamic QR & Geofence attendance
│   │   ├── timetable/                    # Timetable scheduling & conflict check
│   │   ├── events/                       # Campus events & RSVP
│   │   ├── lostfound/                    # Lost & found desk & claim reviews
│   │   ├── user/                         # User administration & profiles
│   │   ├── department/                   # Academic catalogs & classrooms
│   │   ├── announcements/                # Broadcast announcements
│   │   ├── notifications/                # In-app notifications
│   │   ├── dashboard/                    # Role-specific analytics
│   │   ├── audit/                        # Security audit logging
│   │   ├── security/                     # Spring Security filter chain
│   │   └── config/                       # OpenAPI & CORS configuration
│   ├── src/main/resources/
│   │   ├── application.yml               # Application configuration
│   │   └── db/migration/                 # Flyway SQL migrations (V1 & V2)
│   ├── src/test/java/                    # JUnit 5 & Mockito test suite (17 tests)
│   ├── Dockerfile                        # Multi-stage production container build (Java 21)
│   ├── render.yaml                       # Render Web Service blueprint
│   ├── .env.example
│   └── README.md
├── docs/                                 # Complete documentation suite
│   ├── architecture.md                   # Architecture & system diagrams
│   ├── database-schema.md                # 21 tables & Mermaid ER diagram
│   ├── api-documentation.md              # REST API reference & payloads
│   ├── local-mysql-setup.md              # Local MySQL configuration guide
│   ├── render-deployment.md              # Render Web Service deployment guide
│   ├── vercel-deployment.md              # Vercel frontend deployment guide
│   ├── troubleshooting.md                # Troubleshooting & diagnostics
│   ├── secure-local-mysql-networking.md  # Cloudflare/ngrok/Tailscale bridge
│   ├── windows-setup-guide.md            # Windows PowerShell local development
│   ├── environment-variable-guide.md     # All environment variables catalog
│   ├── testing-guide.md                  # Test suite & validation report
│   └── college-project-demonstration-guide.md # Viva & evaluation script
├── render.yaml                           # Root Render Blueprint
├── vercel.json                           # Root Vercel SPA configuration
├── .gitignore
└── README.md                             # Project master overview
```

---

## 6. Quick Start Guide (Windows PowerShell)

### 1. Database Setup
```powershell
mysql -u root -p < backend\database\setup-local-mysql.sql
```

### 2. Run Backend Tests & Server
```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```
Backend available at: `http://localhost:8080` (Swagger UI at `/swagger-ui.html`).

### 3. Build & Run Frontend
```powershell
cd frontend
npm install
npm run build
npm run dev
```
Frontend available at: `http://localhost:5173`.

---

## 7. Complete Documentation Suite
- [System Architecture Document](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/architecture.md)
- [Database Schema & ER Diagram](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/database-schema.md)
- [REST API Documentation](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/api-documentation.md)
- [Local MySQL Setup Manual](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/local-mysql-setup.md)
- [Render Deployment Guide](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/render-deployment.md)
- [Vercel Deployment Guide](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/vercel-deployment.md)
- [Troubleshooting & Diagnostics](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/troubleshooting.md)
- [Secure Local MySQL Networking Guide](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/secure-local-mysql-networking.md)
- [Windows PowerShell Setup Guide](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/windows-setup-guide.md)
- [Environment Variable Reference](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/environment-variable-guide.md)
- [Testing & Quality Assurance Guide](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/testing-guide.md)
- [College Project Demonstration & Viva Guide](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/docs/college-project-demonstration-guide.md)
