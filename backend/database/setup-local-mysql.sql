-- ====================================================================
-- SMART CAMPUS SUPER APP — LOCAL MYSQL INITIALIZATION SCRIPT
-- ====================================================================
-- Database: smart_campus_db
-- Local Host: 127.0.0.1
-- Default Port: 3306
--
-- How to run this script:
-- 1) Via MySQL Command Line Client or PowerShell:
--    mysql -u root -p < setup-local-mysql.sql
-- 2) Via MySQL Workbench:
--    Open File -> setup-local-mysql.sql -> Execute (Lightning icon)
-- ====================================================================

-- 1. Create the Database with utf8mb4 Character Encoding
CREATE DATABASE IF NOT EXISTS smart_campus_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Create Dedicated Application User (Avoid Root Execution)
-- Replace 'Campus@Secure2026!' below with your own secure password if desired.
-- Ensure that your backend environment variable DB_PASSWORD matches this value.
CREATE USER IF NOT EXISTS 'campus_app_user'@'localhost' IDENTIFIED BY 'Campus@Secure2026!';
CREATE USER IF NOT EXISTS 'campus_app_user'@'127.0.0.1' IDENTIFIED BY 'Campus@Secure2026!';
CREATE USER IF NOT EXISTS 'campus_app_user'@'%' IDENTIFIED BY 'Campus@Secure2026!';

-- 3. Grant Required Privileges for Flyway Migrations & Application CRUD
-- Grants DDL (CREATE, ALTER, DROP, INDEX, REFERENCES) and DML (SELECT, INSERT, UPDATE, DELETE)
GRANT ALL PRIVILEGES ON smart_campus_db.* TO 'campus_app_user'@'localhost';
GRANT ALL PRIVILEGES ON smart_campus_db.* TO 'campus_app_user'@'127.0.0.1';
GRANT ALL PRIVILEGES ON smart_campus_db.* TO 'campus_app_user'@'%';

-- 4. Apply Privilege Changes
FLUSH PRIVILEGES;

-- 5. Verification Output
USE smart_campus_db;
SELECT 'Database smart_campus_db and user campus_app_user successfully configured!' AS status;

-- ====================================================================
-- Spring Boot Environment Variables Reference:
-- DB_HOST=127.0.0.1
-- DB_PORT=3306
-- DB_NAME=smart_campus_db
-- DB_USERNAME=campus_app_user
-- DB_PASSWORD=Campus@Secure2026!
--
-- JDBC URL Constructed:
-- jdbc:mysql://${DB_HOST:127.0.0.1}:${DB_PORT:3306}/${DB_NAME:smart_campus_db}
-- ====================================================================
