-- ====================================================================
-- V2__seed_demo_data.sql : Initial Demonstration & Development Seed Data
-- Passwords:
-- Admin:   Admin@123
-- Faculty: Faculty@123
-- Student: Student@123
-- ====================================================================

-- 1. Insert Departments
INSERT INTO departments (id, code, name, description) VALUES
(1, 'CSE', 'Computer Science & Engineering', 'Department of Computer Science and Engineering'),
(2, 'ECE', 'Electronics & Communication Engineering', 'Department of Electronics and Communication'),
(3, 'ME', 'Mechanical Engineering', 'Department of Mechanical Engineering')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Courses
INSERT INTO courses (id, code, name, department_id, credits) VALUES
(1, 'BTECH-CSE', 'B.Tech in Computer Science', 1, 160),
(2, 'BTECH-ECE', 'B.Tech in Electronics & Communication', 2, 160),
(3, 'BTECH-ME', 'B.Tech in Mechanical Engineering', 3, 160)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Insert Sections
INSERT INTO sections (id, name, course_id, semester, academic_year) VALUES
(1, 'Section A', 1, 5, '2025-2026'),
(2, 'Section B', 1, 5, '2025-2026'),
(3, 'Section A', 2, 5, '2025-2026')
ON DUPLICATE KEY UPDATE academic_year=VALUES(academic_year);

-- 4. Insert Classrooms
INSERT INTO classrooms (id, room_number, building, capacity) VALUES
(1, 'LH-101', 'Academic Block A', 70),
(2, 'LH-102', 'Academic Block A', 60),
(3, 'CS-LAB-1', 'Turing Innovation Centre', 45),
(4, 'AUDITORIUM', 'Main Administrative Complex', 350)
ON DUPLICATE KEY UPDATE capacity=VALUES(capacity);

-- 5. Insert Subjects
INSERT INTO subjects (id, code, name, department_id, credits, semester) VALUES
(1, 'CS301', 'Data Structures & Algorithms', 1, 4, 5),
(2, 'CS302', 'Database Management Systems', 1, 4, 5),
(3, 'CS303', 'Operating Systems & Security', 1, 4, 5),
(4, 'EC301', 'Digital Signal Processing', 2, 4, 5)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 6. Insert Users
-- Passwords:
-- admin@campus.edu       -> Admin@123
-- prof.sharma@campus.edu  -> Faculty@123
-- prof.patel@campus.edu   -> Faculty@123
-- student.rahul@campus.edu -> Student@123
-- student.priya@campus.edu -> Student@123
-- student.amit@campus.edu  -> Student@123
INSERT INTO users (id, email, password_hash, full_name, college_id, role, status, phone_number) VALUES
(1, 'admin@campus.edu', '$2a$10$y/HfOtW9rk7rY3TFxgYv5.94fb4DB5tP4u947zg66fVdNgI8R4n0K', 'System Administrator', 'ADM-001', 'ADMIN', 'ACTIVE', '+91 98765 00001'),
(2, 'prof.sharma@campus.edu', '$2a$10$hmwt1DM8v3fM6/VDBfh.s.nq8nLQDHfc8RJ5KQuBX/r6/p1KQgDGy', 'Dr. Rajesh Sharma', 'FAC-101', 'FACULTY', 'ACTIVE', '+91 98765 00101'),
(3, 'prof.patel@campus.edu', '$2a$10$hmwt1DM8v3fM6/VDBfh.s.nq8nLQDHfc8RJ5KQuBX/r6/p1KQgDGy', 'Prof. Ananya Patel', 'FAC-102', 'FACULTY', 'ACTIVE', '+91 98765 00102'),
(4, 'student.rahul@campus.edu', '$2a$10$YcXEuT51IctQvGAdnWmwCuUZ2yRACupXMbc1o1am91LGHKEwbYWBG', 'Rahul Verma', 'STU-2021001', 'STUDENT', 'ACTIVE', '+91 98765 00201'),
(5, 'student.priya@campus.edu', '$2a$10$YcXEuT51IctQvGAdnWmwCuUZ2yRACupXMbc1o1am91LGHKEwbYWBG', 'Priya Nair', 'STU-2021002', 'STUDENT', 'ACTIVE', '+91 98765 00202'),
(6, 'student.amit@campus.edu', '$2a$10$YcXEuT51IctQvGAdnWmwCuUZ2yRACupXMbc1o1am91LGHKEwbYWBG', 'Amit Kumar', 'STU-2021003', 'STUDENT', 'ACTIVE', '+91 98765 00203')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 7. Insert Profiles
INSERT INTO faculty_profiles (id, user_id, department_id, designation, qualification) VALUES
(1, 2, 1, 'Associate Professor', 'Ph.D. in Computer Science'),
(2, 3, 2, 'Assistant Professor', 'M.Tech in ECE')
ON DUPLICATE KEY UPDATE designation=VALUES(designation);

INSERT INTO student_profiles (id, user_id, department_id, section_id, roll_number, admission_year) VALUES
(1, 4, 1, 1, '21CS001', 2023),
(2, 5, 1, 1, '21CS002', 2023),
(3, 6, 2, 3, '21EC001', 2023)
ON DUPLICATE KEY UPDATE roll_number=VALUES(roll_number);

-- 8. Faculty Subject Assignments
INSERT INTO faculty_subject_assignments (id, faculty_id, subject_id, section_id) VALUES
(1, 2, 1, 1), -- Dr. Sharma teaches CS301 (DSA) to Section A
(2, 2, 2, 1), -- Dr. Sharma teaches CS302 (DBMS) to Section A
(3, 3, 4, 3)  -- Prof. Patel teaches EC301 (DSP) to Section A
ON DUPLICATE KEY UPDATE section_id=VALUES(section_id);

-- 9. Enrollments
INSERT INTO enrollments (id, student_id, subject_id, section_id) VALUES
(1, 4, 1, 1), -- Rahul in CS301
(2, 4, 2, 1), -- Rahul in CS302
(3, 4, 3, 1), -- Rahul in CS303
(4, 5, 1, 1), -- Priya in CS301
(5, 5, 2, 1), -- Priya in CS302
(6, 6, 4, 3)  -- Amit in EC301
ON DUPLICATE KEY UPDATE section_id=VALUES(section_id);

-- 10. Timetable Entries
INSERT INTO timetable_entries (id, subject_id, faculty_id, section_id, classroom_id, day_of_week, start_time, end_time) VALUES
(1, 1, 2, 1, 1, 'MONDAY', '09:00:00', '10:00:00'),
(2, 2, 2, 1, 1, 'MONDAY', '10:15:00', '11:15:00'),
(3, 1, 2, 1, 3, 'TUESDAY', '11:30:00', '13:00:00'),
(4, 3, 2, 1, 2, 'WEDNESDAY', '09:00:00', '10:00:00'),
(5, 2, 2, 1, 1, 'THURSDAY', '14:00:00', '15:00:00'),
(6, 1, 2, 1, 1, 'FRIDAY', '10:00:00', '11:00:00')
ON DUPLICATE KEY UPDATE day_of_week=VALUES(day_of_week);

-- 11. Initial Attendance Sessions & Records
INSERT INTO attendance_sessions (id, faculty_id, subject_id, section_id, classroom_id, session_date, start_time, end_time, qr_token, qr_expires_at, is_active, geofence_enabled, latitude, longitude, radius_meters) VALUES
(1, 2, 1, 1, 1, CURRENT_DATE(), '09:00:00', '10:00:00', 'DEMO-QR-CS301-SEC-A-01', DATE_ADD(NOW(), INTERVAL 2 HOUR), TRUE, TRUE, 12.9716000, 77.5946000, 100.0)
ON DUPLICATE KEY UPDATE is_active=VALUES(is_active);

INSERT INTO attendance_records (id, session_id, student_id, status, check_in_time, student_latitude, student_longitude, distance_meters, remarks) VALUES
(1, 1, 4, 'PRESENT', NOW(), 12.9716200, 77.5946100, 2.5, 'On-time QR check-in verified')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 12. Campus Events
INSERT INTO campus_events (id, title, description, category, venue, organizer_id, start_time, end_time, max_capacity, registered_count, status, image_url) VALUES
(1, 'InnovateX 2026: Annual Tech Symposium', 'Keynotes by industry leaders, 24-hour hackathon, robotics arena, and project displays.', 'TECHNICAL', 'Main Auditorium & Turing Lab', 2, DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY), 250, 42, 'UPCOMING', '/assets/events/hackathon.jpg'),
(2, 'AI & Next-Gen Cloud Workshop', 'Hands-on bootcamp covering modern LLM agentic architectures and distributed cloud deployment.', 'WORKSHOP', 'Seminar Hall 2', 3, DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY), 80, 28, 'UPCOMING', '/assets/events/workshop.jpg'),
(3, 'Campus Pulse Cultural Fest 2026', 'Inter-collegiate music, dance, theatrical drama, and street arts extravaganza.', 'CULTURAL', 'University Open Amphitheatre', 1, DATE_ADD(NOW(), INTERVAL 14 DAY), DATE_ADD(NOW(), INTERVAL 16 DAY), 500, 115, 'UPCOMING', '/assets/events/cultural.jpg')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 13. Event Registrations
INSERT INTO event_registrations (id, event_id, user_id, status) VALUES
(1, 1, 4, 'CONFIRMED'),
(2, 1, 5, 'CONFIRMED')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 14. Lost and Found Items & Claims
INSERT INTO lost_found_items (id, title, description, category, item_type, location, date_recorded, status, reported_by_user_id) VALUES
(1, 'Midnight Blue HydroFlask Water Bottle', 'Found near Row 3 LH-101 after the 10:00 AM DSA lecture. Has custom stickers on the lid.', 'ACCESSORIES', 'FOUND', 'Academic Block A, LH-101', CURRENT_DATE(), 'FOUND', 2),
(2, 'Texas Instruments Scientific Calculator (TI-84)', 'Misplaced during DSP lab session. Has initials RV engraved on the rear battery cover.', 'ELECTRONICS', 'LOST', 'Turing Innovation Centre Lab-3', CURRENT_DATE(), 'LOST', 4),
(3, 'Black Leather Cardholder / ID Wallet', 'Contains college ID card STU-2021002 and metro smart card.', 'ID_CARDS', 'FOUND', 'Central Library Reception', CURRENT_DATE(), 'CLAIM_PENDING', 3)
ON DUPLICATE KEY UPDATE title=VALUES(title);

INSERT INTO lost_found_claims (id, item_id, claimant_user_id, description_proof, status) VALUES
(1, 3, 5, 'Matches Priya Nair college ID STU-2021002 with university card lanyard.', 'PENDING')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 15. Announcements
INSERT INTO announcements (id, title, content, target_role, author_id, priority) VALUES
(1, 'Welcome to the New Academic Semester 2026', 'All students and faculty are requested to verify their timetable schedules and complete elective enrollments by Friday.', 'ALL', 1, 'HIGH'),
(2, 'Smart Campus Super App Released for Campus-Wide Access', 'The new unified platform is live for dynamic QR attendance, timetable alerts, event RSVP, and lost & found reporting.', 'ALL', 1, 'URGENT'),
(3, 'Faculty Meeting: Mid-Semester Evaluation Criteria', 'All department heads and faculty members are invited to the Academic Council meeting this Thursday at 4 PM in Board Room 1.', 'FACULTY', 1, 'NORMAL')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 16. In-App Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, reference_id) VALUES
(1, 4, 'Attendance Confirmed', 'You were marked PRESENT for CS301 (Data Structures) today at 09:05 AM.', 'ATTENDANCE', FALSE, 1),
(2, 4, 'Event Registration Success', 'Your registration for InnovateX 2026 has been confirmed. Entry pass generated.', 'EVENT', FALSE, 1),
(3, 5, 'Claim Under Review', 'Your claim for Black Leather Cardholder has been submitted and is pending verification.', 'LOST_FOUND', FALSE, 1),
(4, 2, 'Active Session Alert', 'CS301 Section A attendance session is active. 1 student has checked in so far.', 'ATTENDANCE', FALSE, 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);
