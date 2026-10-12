-- ====================================================================
-- SMART CAMPUS SUPER APP — LOCAL MYSQL INITIALIZATION SCRIPT
-- ====================================================================
-- Run this script using MySQL Command Line Client or MySQL Workbench:
-- mysql -u root -p < setup-local-mysql.sql
-- ====================================================================

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS smart_campus_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Create the Dedicated Application User (Not Root)
CREATE USER IF NOT EXISTS 'campus_app_user'@'localhost' IDENTIFIED BY 'Campus@Secure2026!';
CREATE USER IF NOT EXISTS 'campus_app_user'@'127.0.0.1' IDENTIFIED BY 'Campus@Secure2026!';
CREATE USER IF NOT EXISTS 'campus_app_user'@'%' IDENTIFIED BY 'Campus@Secure2026!';

-- 3. Grant Required Privileges for Flyway Migrations & Application CRUD
GRANT ALL PRIVILEGES ON smart_campus_db.* TO 'campus_app_user'@'localhost';
GRANT ALL PRIVILEGES ON smart_campus_db.* TO 'campus_app_user'@'127.0.0.1';
GRANT ALL PRIVILEGES ON smart_campus_db.* TO 'campus_app_user'@'%';

-- 4. Apply Privilege Changes
FLUSH PRIVILEGES;

-- 5. Verification Output
USE smart_campus_db;
SELECT 'Database smart_campus_db and user campus_app_user successfully configured!' AS status;
