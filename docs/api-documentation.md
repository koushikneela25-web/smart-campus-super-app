# Smart Campus Super App — REST API Documentation

## 1. Overview
The **Smart Campus Super App** provides a RESTful API versioned under `/api/v1`. All endpoints accept and produce `application/json` (unless designated for file downloads like CSV export).

- **Base URL (Local)**: `http://localhost:8080/api/v1`
- **Base URL (Production)**: `https://smart-campus-backend.onrender.com/api/v1`
- **Interactive Swagger UI**: Available at `http://localhost:8080/swagger-ui.html` (or `https://smart-campus-backend.onrender.com/swagger-ui.html`)
- **OpenAPI JSON Spec**: Available at `http://localhost:8080/api-docs`

---

## 2. Standard API Envelope
All responses return a consistent JSON envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-10-12T18:30:00Z"
}
```

In the event of an error:
```json
{
  "success": false,
  "message": "Resource conflict or validation error description",
  "data": null,
  "timestamp": "2026-10-12T18:30:00Z"
}
```

---

## 3. Authentication Endpoints (`/api/v1/auth`)

### 3.1 User Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "identifier": "admin@campus.edu",
    "password": "Admin@123"
  }
  ```
  *(Note: `identifier` accepts either the user's registered Email Address OR College ID).*
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
      "tokenType": "Bearer",
      "expiresInMs": 86400000,
      "user": {
        "id": 1,
        "email": "admin@campus.edu",
        "collegeId": "ADM001",
        "fullName": "Administrator",
        "role": "ADMIN",
        "status": "ACTIVE"
      }
    }
  }
  ```

### 3.2 User Registration
- **Endpoint**: `POST /api/v1/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "fullName": "Koushik Sen",
    "email": "koushik@campus.edu",
    "collegeId": "STU1088",
    "password": "Student@123",
    "role": "STUDENT",
    "phoneNumber": "+91 9876543210"
  }
  ```
- **Response (201 Created)**: Returns the newly provisioned User profile and JWT bearer tokens.

### 3.3 Get Current User Profile
- **Endpoint**: `GET /api/v1/auth/me`
- **Header**: `Authorization: Bearer <accessToken>`
- **Response (200 OK)**: Current authenticated user details.

---

## 4. Attendance Management (`/api/v1/attendance`)

### 4.1 Start QR Attendance Session
- **Endpoint**: `POST /api/v1/attendance/sessions`
- **Header**: `Authorization: Bearer <accessToken>` (Faculty or Admin only)
- **Request Body**:
  ```json
  {
    "subjectId": 1,
    "sectionId": 1,
    "classroomId": 1,
    "durationMinutes": 10,
    "geofenceEnabled": true,
    "latitude": 12.971598,
    "longitude": 77.594566,
    "radiusMeters": 100
  }
  ```
- **Response (201 Created)**: Returns the created session with dynamic `qrToken` and `qrExpiresAt`.

### 4.2 Submit Student Check-In
- **Endpoint**: `POST /api/v1/attendance/check-in`
- **Header**: `Authorization: Bearer <accessToken>` (Student)
- **Request Body**:
  ```json
  {
    "qrToken": "550e8400-e29b-41d4-a716-446655440000",
    "latitude": 12.971605,
    "longitude": 77.594572
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Attendance verified successfully! Marked PRESENT.",
    "data": {
      "id": 42,
      "sessionId": 1,
      "status": "PRESENT",
      "distanceMeters": 3.4,
      "checkInTime": "2026-10-12T18:35:12Z"
    }
  }
  ```

### 4.3 Student Attendance Summary
- **Endpoint**: `GET /api/v1/attendance/summary`
- **Header**: `Authorization: Bearer <accessToken>`
- **Response (200 OK)**: Overall attendance percentage, attended classes, total classes, and subject-wise percentages.

### 4.4 Close Session Early
- **Endpoint**: `POST /api/v1/attendance/sessions/{id}/close`
- **Header**: `Authorization: Bearer <accessToken>` (Faculty/Admin)

### 4.5 Export Attendance CSV
- **Endpoint**: `GET /api/v1/attendance/reports/export-csv` (Optional param: `?sessionId=1`)
- **Header**: `Authorization: Bearer <accessToken>`
- **Response**: `text/csv` stream with header `Content-Disposition: attachment; filename="attendance_report_...csv"`.

---

## 5. Academic Timetable (`/api/v1/timetable`)

### 5.1 My Timetable Schedule
- **Endpoint**: `GET /api/v1/timetable/my`
- **Header**: `Authorization: Bearer <accessToken>`
- **Response (200 OK)**: List of lecture allocations mapped to the current student's section or current faculty's assignments.

### 5.2 Create Timetable Slot (Conflict-Checked)
- **Endpoint**: `POST /api/v1/admin/timetable`
- **Header**: `Authorization: Bearer <accessToken>` (Admin)
- **Request Body**:
  ```json
  {
    "subjectId": 1,
    "facultyId": 2,
    "sectionId": 1,
    "classroomId": 1,
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "10:00"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: "Conflict: Faculty is already assigned to another class during this time slot."
  - `400 Bad Request`: "Conflict: Classroom is occupied by another session during this time slot."

---

## 6. Campus Events (`/api/v1/events`)

### 6.1 List Campus Events
- **Endpoint**: `GET /api/v1/events` (Optional params: `?category=TECHNICAL&status=UPCOMING`)
- **Access**: Authenticated

### 6.2 Reserve Spot (RSVP)
- **Endpoint**: `POST /api/v1/events/{id}/rsvp`
- **Header**: `Authorization: Bearer <accessToken>`
- **Response (200 OK)**: Increments `registered_count` and records RSVP. Fails with `400 Bad Request` if capacity full.

### 6.3 Cancel RSVP
- **Endpoint**: `DELETE /api/v1/events/{id}/rsvp`
- **Header**: `Authorization: Bearer <accessToken>`

---

## 7. Lost & Found Desk (`/api/v1/lost-found`)

### 7.1 Report Item
- **Endpoint**: `POST /api/v1/lost-found`
- **Header**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "title": "Black ThinkPad Laptop Charger",
    "description": "65W USB-C charger left on desk 402 with green tape on cable",
    "category": "ELECTRONICS",
    "itemType": "LOST",
    "location": "Turing Block Room 402"
  }
  ```

### 7.2 Submit Ownership Claim
- **Endpoint**: `POST /api/v1/lost-found/{itemId}/claims`
- **Header**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "descriptionProof": "Has a distinct red sticker with initials 'KS' near the plug."
  }
  ```

### 7.3 Review Claim (Admin)
- **Endpoint**: `PATCH /api/v1/lost-found/claims/{claimId}/review`
- **Header**: `Authorization: Bearer <accessToken>` (Admin)
- **Request Body**:
  ```json
  {
    "status": "APPROVED",
    "resolutionNotes": "Verified in person with matching student ID."
  }
  ```

---

## 8. Administrative Endpoints (`/api/v1/admin`)

- `GET /api/v1/admin/analytics`: Institutional KPI statistics, weekly chart points, and recent audit logs.
- `GET /api/v1/admin/users`: List users filtered by role (`?role=STUDENT`).
- `POST /api/v1/admin/users`: Provision new user account.
- `PATCH /api/v1/admin/users/{id}/status?status=SUSPENDED`: Suspend or activate account.
- `GET /api/v1/admin/audit-logs`: Complete security audit logs.
