# Smart Campus Super App — Windows PowerShell Local Setup Guide

This comprehensive guide details how to configure, initialize, build, and run both the Spring Boot backend and React frontend on Windows 11 / Windows 10 using PowerShell and your locally installed MySQL server.

---

## 1. Prerequisites Verification

Open Windows PowerShell and verify the required toolchains:

### 1.1 Verify Java 21+
```powershell
java -version
```
**Expected output**:
```text
java version "21.x.x" (or higher, e.g. Java 25 LTS)
Java(TM) SE Runtime Environment
```
If Java is not recognized, set `JAVA_HOME`:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
```

### 1.2 Verify Maven
```powershell
mvn -v
```
Or check the included Windows Maven Wrapper in `backend\`:
```powershell
cd backend
.\mvnw.cmd -v
cd ..
```

### 1.3 Verify Node.js and npm
```powershell
node -v
npm -v
```
**Expected output**:
```text
v20.x.x (or higher)
10.x.x (or higher)
```

---

## 2. Local MySQL Database Setup

The application connects exclusively to your locally installed MySQL database engine.

### Step 2.1: Start Local MySQL Server
Ensure the MySQL Windows Service is started:
```powershell
net start MySQL80
```
Or if using your portable local MySQL/MariaDB server:
```powershell
& ".\mariadb-10.11.8-winx64\bin\mysqld.exe" --datadir=.\mariadb-data --port=3306 --console
```

Verify that port 3306 is listening:
```powershell
Test-NetConnection -ComputerName 127.0.0.1 -Port 3306
```
Ensure `TcpTestSucceeded: True`.

### Step 2.2: Execute Database Initialization Script
Run the included setup script using MySQL CLI or MySQL Workbench:
```powershell
mysql -u root -p < backend\database\setup-local-mysql.sql
```
This script:
1. Creates `smart_campus_db` with `utf8mb4` character set.
2. Creates the dedicated application user `campus_app_user` with password `Campus@Secure2026!`.
3. Grants all DDL and DML privileges on `smart_campus_db.*` to `campus_app_user`.
4. Flushes MySQL privileges.

---

## 3. Backend Setup & Startup (Spring Boot)

### Step 3.1: Navigate to Backend Directory
```powershell
cd backend
```

### Step 3.2: Configure Environment Variables
You can create a `.env` file or export PowerShell variables (defaults in `application.yml` already point to local defaults):
```powershell
$env:DB_HOST = "127.0.0.1"
$env:DB_PORT = "3306"
$env:DB_NAME = "smart_campus_db"
$env:DB_USERNAME = "campus_app_user"
$env:DB_PASSWORD = "Campus@Secure2026!"
$env:SPRING_PROFILES_ACTIVE = "local"
$env:SERVER_PORT = "8080"
```

### Step 3.3: Run Unit & Integration Tests
Execute the Maven test suite to verify all business rules:
```powershell
.\mvnw.cmd test
# Or if mvn is in PATH:
mvn test
```
All unit tests (`AttendanceServiceTest`, `AuthServiceTest`, `EventServiceTest`, `LostFoundServiceTest`, `NotificationServiceTest`, `TimetableServiceTest`) will execute and report `BUILD SUCCESS`.

### Step 3.4: Start Spring Boot with Maven Wrapper
Run Spring Boot with the local profile:
```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```
Or with Maven:
```powershell
mvn spring-boot:run -Dspring-boot.run.profiles=local
```
On boot:
1. Flyway runs `V1__init_schema.sql` (creates 21 tables) and `V2__seed_demo_data.sql` (inserts demo accounts, academic records, timetable, and campus events).
2. Hibernate validates the database schema (`ddl-auto: validate`).
3. Embedded Tomcat initializes on `http://localhost:8080`.

Verify by opening Swagger UI in your browser:
👉 [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
Verify health check:
👉 [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

---

## 4. Frontend Setup & Startup (React + Vite)

Open a **second PowerShell window**:

### Step 4.1: Navigate to Frontend Directory
```powershell
cd frontend
```

### Step 4.2: Install NPM Dependencies
```powershell
npm install
```

### Step 4.3: Verify or Create `.env`
Ensure `frontend\.env` contains:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Step 4.4: Start Vite Development Server
```powershell
npm run dev
```
Vite will start at [http://localhost:5173](http://localhost:5173).

### Step 4.5: Run Production Build Validation
To verify type safety and minification bundle:
```powershell
npm run build
```
The output will compile to `frontend\dist\`.

---

## 5. Testing the Full-Stack Application Locally

Open [http://localhost:5173](http://localhost:5173) in your browser:

### 5.1 Test Administrator Workflow
1. Log in with:
   - **Email**: `admin@campus.edu`
   - **Password**: `Admin@123`
2. View **Admin Dashboard**: metrics for students, faculty, attendance, events, and reports.
3. Manage **Academics**: Departments, Courses, Sections, Subjects, Classrooms.
4. Manage **Timetable**: View schedule, add time slot with automatic overlap conflict checking.
5. Review **Audit Logs**: Inspect security actions recorded with timestamps.

### 5.2 Test Faculty Workflow
1. Log in with:
   - **Email**: `faculty.cs@campus.edu`
   - **Password**: `Faculty@123`
2. View assigned classes and today's timetable.
3. Start an **Attendance Session**:
   - Choose Subject `CS301`, Section `Section A`.
   - Set duration (e.g. 15 minutes) and optional GPS Geofence (50 meters).
   - Display the high-entropy dynamic QR Code on screen.
4. Export **Attendance CSV Report**.

### 5.3 Test Student Workflow
1. Log in with:
   - **Email**: `student.cs@campus.edu`
   - **Password**: `Student@123`
2. View **Student Dashboard**: attendance percentage, today's classes, notifications.
3. Check in for attendance using session code or camera QR scanner.
4. Browse **Campus Events** and click **Register (RSVP)**.
5. Submit a **Lost & Found** item report or claim.

---

## 6. Confirming Saved Records in MySQL Workbench

Open **MySQL Workbench** or MySQL CLI and run:
```sql
USE smart_campus_db;

-- 1. Check verified attendance records
SELECT ar.id, u.full_name, s.code AS subject, ar.status, ar.check_in_time, ar.distance_meters
FROM attendance_records ar
JOIN users u ON ar.student_id = u.id
JOIN attendance_sessions sess ON ar.session_id = sess.id
JOIN subjects s ON sess.subject_id = s.id;

-- 2. Check event registrations
SELECT er.id, e.title, u.full_name, er.status, er.registered_at
FROM event_registrations er
JOIN campus_events e ON er.event_id = e.id
JOIN users u ON er.user_id = u.id;

-- 3. Check security audit logs
SELECT id, action, entity_name, entity_id, ip_address, created_at
FROM audit_logs
ORDER BY id DESC LIMIT 10;
```
All user actions performed in the web UI will appear in your local MySQL database tables!
