# Local MySQL Database Setup Guide

## 1. Requirements & Configuration
The **Smart Campus Super App** is designed strictly to use your **own local MySQL database engine** running on your local machine (`127.0.0.1:3306`).
- **Target Database Name**: `smart_campus_db`
- **Application User**: `campus_app_user`
- **Application Password**: `CampusApp@Secure2026`
- **Flyway Migrations Directory**: `backend/src/main/resources/db/migration`

---

## 2. Bootstrapping Local MySQL

### Step 1: Start MySQL Server
Ensure your local MySQL service is running:
- **Windows (PowerShell)**:
  ```powershell
  Get-Service -Name MySQL* | Start-Service
  ```
- **macOS / Homebrew**:
  ```bash
  brew services start mysql
  ```
- **Linux (systemd)**:
  ```bash
  sudo systemctl start mysql
  ```

### Step 2: Run the Setup Script
A dedicated initialization script is provided in the repository at [setup-local-mysql.sql](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/backend/database/setup-local-mysql.sql).

Execute the script via MySQL Command Line Client or terminal:
```bash
mysql -u root -p < backend/database/setup-local-mysql.sql
```

Alternatively, open MySQL Workbench or your preferred database GUI, connect as `root`, and execute:
```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS smart_campus_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create Application User
CREATE USER IF NOT EXISTS 'campus_app_user'@'localhost' IDENTIFIED BY 'CampusApp@Secure2026';
CREATE USER IF NOT EXISTS 'campus_app_user'@'%' IDENTIFIED BY 'CampusApp@Secure2026';

-- Grant Privileges
GRANT ALL PRIVILEGES ON smart_campus_db.* TO 'campus_app_user'@'localhost';
GRANT ALL PRIVILEGES ON smart_campus_db.* TO 'campus_app_user'@'%';

FLUSH PRIVILEGES;
```

---

## 3. Flyway Migrations Execution
The Spring Boot backend utilizes **Flyway** to automatically and idempotently execute database schema definitions upon application startup.
- `V1__init_schema.sql`: Creates all 21 tables, foreign key constraints, composite unique indexes, and defaults.
- `V2__seed_demo_data.sql`: Populates the database with verified credentials, departments, courses, subjects, classrooms, timetable entries, and campus events.

### Manual Verification
To check that the tables were initialized successfully:
```sql
USE smart_campus_db;
SHOW TABLES;
```
Expected output: 21 tables created.

---

## 4. Default Seed Credentials

| Role | Email / Identifier | College ID | Password | Access Scope |
|---|---|---|---|---|
| **Administrator** | `admin@campus.edu` | `ADM001` | `Admin@123` | Institutional Analytics, Users, Academics, Timetable Builder, Audit Logs |
| **Faculty** | `faculty@campus.edu` | `FAC101` | `Faculty@123` | Dynamic QR Generator, Assigned Teaching Classes, Event Organizing, CSV Reports |
| **Student** | `student@campus.edu` | `STU1001` | `Student@123` | QR Check-In, Geofenced Attendance, Schedule, Event Reservation, Lost & Found |

All demo passwords use BCrypt hashing (`$2a$10$...`) verified for seamless login immediately after bootstrap.
