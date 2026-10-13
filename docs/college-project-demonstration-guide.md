# Smart Campus Super App — College Project Demonstration & Viva Guide
**Individual BTech Project Defense Walkthrough**

This guide provides a comprehensive script and step-by-step checklist to demonstrate the **Smart Campus Super App** during project reviews, final semester assessments, and external viva examinations.

---

## 1. Project Overview & Elevator Pitch

> *"Good morning/afternoon, Respected Examiners. My individual BTech project is the **Smart Campus Super App**, an enterprise full-stack university management platform designed to replace fragmented academic portals. 
> 
> The system integrates QR-based attendance with Haversine geofencing, conflict-aware timetable scheduling, capacity-managed campus events, a moderated lost-and-found desk, and role-based notifications into a unified progressive web application.
> 
> Architecturally, it enforces strict separation of concerns: a React 18 and TypeScript single-page application deployed on Vercel, communicating over HTTPS REST APIs with a Java 21 and Spring Boot 3 backend deployed as a containerized Docker service on Render, backed by a persistent relational database running on MySQL 8.x with Flyway version-controlled migrations."*

---

## 2. Live Demonstration Flow (Step-by-Step)

### Phase 1: Landing Page & Architectural Highlights
1. Open the application at [http://localhost:5173](http://localhost:5173) (or live Vercel URL).
2. Highlight:
   - Modern collegiate design: deep navy (`#090D16`), slate accents, glassmorphic panels, and Lucide icons.
   - Technology Stack badges: Java 21, Spring Boot 3, MySQL 8, React + Vite, Docker, Vercel, Render.
   - Point out that there is zero hardcoded mock data: all cards, events, and metrics query real REST endpoints.

---

### Phase 2: Administrator Portal Demonstration
1. Click **Sign In** and authenticate with Administrator credentials:
   - **Email**: `admin@campus.edu`
   - **Password**: `Admin@123`
2. **Dashboard Metrics**:
   - Showcase KPI metric cards: Total Students, Total Faculty, Active Users, System Attendance %, Total Events.
   - Interactive Recharts weekly attendance breakdown.
3. **Academic Catalog Management**:
   - Navigate to **Academics** (`/admin/academics`).
   - Demonstrate listing and creation of Departments (e.g., Computer Science, Mechanical), Courses, Sections, Classrooms, and Subjects.
4. **Timetable & Scheduling Conflict Engine**:
   - Navigate to **Timetable** (`/admin/timetable`).
   - Demonstrate how the backend automatically detects and rejects faculty, classroom, or section time overlap conflicts using transactional queries.
5. **Security Audit Logs**:
   - Navigate to **Audit Logs** (`/admin/audit-logs`).
   - Show audit records capturing authentication attempts, IP addresses, entity updates, and timestamps.

---

### Phase 3: Faculty Portal Demonstration
1. Log in as Faculty:
   - **Email**: `faculty.cs@campus.edu`
   - **Password**: `Faculty@123`
2. **Faculty Dashboard**:
   - View assigned classes and today's lectures.
3. **Dynamic QR Attendance Initiation**:
   - Navigate to **Attendance** (`/faculty/attendance`).
   - Select Subject (e.g. `CS301 - Algorithms`), Section (`Section A`).
   - Set Session Duration (e.g. 15 minutes) and toggle **Geofence Validation** (e.g. 50 meters radius).
   - Click **Start Session**.
   - Show the dynamic QR code generated with high-entropy cryptographic token (`UUID`) and countdown timer.
4. **Attendance Analytics & CSV Export**:
   - Review live check-in submissions.
   - Click **Export CSV** to download `attendance_report_<timestamp>.csv` containing verified check-ins and calculated distances.

---

### Phase 4: Student Portal Demonstration
1. Open an incognito browser window or log in as Student:
   - **Email**: `student.cs@campus.edu`
   - **Password**: `Student@123`
2. **Student Dashboard**:
   - Personalized greeting, attendance percentage ring, enrolled courses, and today's schedule.
3. **QR Check-in & Geofence Verification**:
   - Navigate to **Attendance** (`/student/attendance`).
   - Scan the QR code or enter the session code.
   - If Geofencing is enabled, demonstrate GPS coordinate acquisition.
   - Show immediate update to `PRESENT` status and notification generation.
   - Demonstrate duplicate prevention: trying to check in a second time produces `You have already checked in for this attendance session.`
4. **Campus Events & RSVP**:
   - Navigate to **Events** (`/student/events`).
   - View upcoming events (Hackathons, Workshops, Cultural Fest).
   - Click **Register (RSVP)**: show real-time seat decrement.
   - Demonstrate capacity protection: once `registered_count == max_capacity`, further registrations are rejected.
5. **Lost & Found Desk**:
   - Report a lost or found item with category, date, and location.
   - Submit an ownership claim with identifying proof.
   - Explain how contact information is protected until administrator approval.

---

### Phase 5: Verification of Relational Persistence in MySQL
1. Open **MySQL Workbench** or Windows PowerShell.
2. Run queries on `smart_campus_db`:
   ```sql
   SELECT id, full_name, role FROM users;
   SELECT * FROM attendance_sessions ORDER BY id DESC LIMIT 1;
   SELECT * FROM attendance_records ORDER BY id DESC LIMIT 5;
   SELECT * FROM audit_logs ORDER BY id DESC LIMIT 5;
   ```
3. Prove to examiners that all UI actions are transactionally committed to your local MySQL database engine.

---

## 3. Potential Viva Questions & Model Answers

### Q1: Why did you choose a layered architecture for the Spring Boot backend?
**Answer**: 
> *"A layered architecture (Controller → Service → Repository → MySQL) establishes strict separation of concerns. Controllers handle HTTP serialization, routing, and DTO validation (`@Valid`). Services encapsulate core business logic, geospatial distance calculations, conflict validations, and transactional boundaries (`@Transactional`). Repositories interface with the MySQL database via Spring Data JPA and Hibernate ORM. This ensures modularity, testability, and enterprise maintainability."*

### Q2: How does your dynamic QR attendance system prevent proxy attendance?
**Answer**:
> *"Static QR codes are vulnerable to being photographed and shared in group chats. Our system addresses this by:
> 1. Generating temporary, high-entropy tokens (`UUID`) with strict expiration timestamps (`qr_expires_at`).
> 2. Enforcing composite unique constraints in MySQL `(session_id, student_id)` to prevent multiple check-ins.
> 3. Employing the Haversine distance formula to calculate the student's geodesic distance from the classroom coordinates. If the calculated distance exceeds the configured radius (e.g. 50 meters), check-in is rejected."*

### Q3: How do you handle schema evolution across environments?
**Answer**:
> *"We use Flyway database migrations (`V1__init_schema.sql` and `V2__seed_demo_data.sql`). When the application boots, Flyway executes pending SQL scripts idempotently and maintains a `flyway_schema_history` table. Hibernate is set to `ddl-auto: validate`, ensuring production database schemas are never unpredictably altered by ORM reflection."*

### Q4: Why can't a cloud-deployed backend on Render connect directly to `127.0.0.1:3306` on your laptop?
**Answer**:
> *"In a cloud container runtime, `127.0.0.1` refers to the container's own loopback interface, not my laptop. My laptop is behind a home router with Network Address Translation (NAT) and a Windows firewall. To bridge this securely without exposing raw MySQL ports to the public internet, we use an authenticated outbound TCP tunnel (such as ngrok or Cloudflare Tunnel) that proxies TLS-encrypted TCP traffic from Render to local port 3306."*

### Q5: How is authentication and role authorization enforced?
**Answer**:
> *"Authentication uses stateless JSON Web Tokens (JWT) signed with HMAC-SHA256 (`HS256`). On login, the user's password is verified against BCrypt hashes. The server issues a signed access token containing claims and user roles (`STUDENT`, `FACULTY`, `ADMIN`). Every protected endpoint is secured via Spring Security's `SecurityFilterChain` and `@PreAuthorize` annotations, ensuring students cannot access administrative endpoints even if they attempt direct API calls."*
