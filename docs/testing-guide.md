# Smart Campus Super App — Testing & Quality Assurance Guide

## 1. Overview
The **Smart Campus Super App** follows a multi-tiered testing strategy spanning unit tests, integration tests, transactional business logic verification, and strict compile-time TypeScript type checking.

---

## 2. Backend Automated Test Suite (JUnit 5 + Mockito)

### 2.1 Execution
Execute the full test suite using Maven or the Maven Wrapper in PowerShell:
```powershell
cd backend
.\mvnw.cmd test
# Or:
mvn test
```

### 2.2 Verified Test Results
```text
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.smartcampus.AttendanceServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.508 s -- in com.smartcampus.AttendanceServiceTest
[INFO] Running com.smartcampus.AuthServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.075 s -- in com.smartcampus.AuthServiceTest
[INFO] Running com.smartcampus.EventServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.041 s -- in com.smartcampus.EventServiceTest
[INFO] Running com.smartcampus.LostFoundServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.057 s -- in com.smartcampus.LostFoundServiceTest
[INFO] Running com.smartcampus.NotificationServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.015 s -- in com.smartcampus.NotificationServiceTest
[INFO] Running com.smartcampus.PasswordGenTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.199 s -- in com.smartcampus.PasswordGenTest
[INFO] Running com.smartcampus.TimetableServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.083 s -- in com.smartcampus.TimetableServiceTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

---

## 3. Test Cases Breakdown

### 3.1 Authentication & Security (`AuthServiceTest.java`)
1. `testLogin_Success`: Verifies BCrypt hash matching, generation of access & refresh tokens, and emission of a `LOGIN_SUCCESS` audit log.
2. `testRegister_RejectAdminRole`: Enforces security constraint prohibiting public self-registration of administrative accounts.
3. `testRegister_DuplicateEmail_ThrowsException`: Ensures duplicate registration attempts with existing email trigger `DuplicateResourceException`.

### 3.2 Timetable Conflict Engine (`TimetableServiceTest.java`)
1. `testCreateTimetable_Success`: Verifies smooth persistence when the schedule slot is free.
2. `testCreateTimetable_FacultyConflict_ThrowsException`: Simulates two lectures assigned to the same instructor with overlapping start and end times; verifies rejection with `TimetableConflictException`.

### 3.3 Dynamic QR & Geofence Attendance (`AttendanceServiceTest.java`)
1. `testCheckIn_Success`: Validates that a student within the configured radius is recorded as `PRESENT` and a notification is dispatched.
2. `testCheckIn_OutOfBounds_ThrowsException`: Validates that coordinates exceeding the geofence radius trigger `BadRequestException`.
3. `testCheckIn_DuplicateSubmission_ThrowsException`: Tests duplicate check-in prevention, ensuring subsequent submissions by the same student fail with `DuplicateResourceException`.

### 3.4 Campus Event Reservation (`EventServiceTest.java`)
1. `testRsvp_FullCapacity_ThrowsBadRequest`: Simulates an overbooked event (`registeredCount >= maxCapacity`) and verifies rejection with `BadRequestException`.
2. `testRsvp_DuplicateRegistration_ThrowsDuplicateException`: Verifies duplicate RSVP rejection with `DuplicateResourceException`.

### 3.5 Lost & Found Permissions (`LostFoundServiceTest.java`)
1. `testSubmitClaim_SelfClaim_ThrowsBadRequestException`: Verifies that a user cannot submit an ownership claim on an item reported by themselves.
2. `testGetItemClaims_UnauthorizedStudent_ThrowsBadRequestException`: Ensures only the item reporter or an administrator can view submitted claims.
3. `testSubmitClaim_ValidClaimant_Success`: Verifies valid claim submission, item status transition to `CLAIM_PENDING`, and reporter notification.

### 3.6 Notification Privacy (`NotificationServiceTest.java`)
1. `testGetUserNotifications_Success`: Verifies that users retrieve only their own notifications ordered by timestamp.
2. `testMarkAsRead_OtherUser_ThrowsBadRequestException`: Enforces privacy protection: attempts by user A to mark or mutate user B's notification are rejected.
3. `testMarkAsRead_Owner_Success`: Verifies owner successfully marks notification as read.

---

## 4. Frontend Type Checking & Production Build Validation
The frontend is built with strict TypeScript compiler checks (`tsc`) and Vite:
```powershell
cd frontend
npm run build
```
**Result**:
- Modules Transformed: 2,520 modules
- TypeScript Errors: 0
- Artifacts Generated: `dist/index.html`, `dist/assets/index-Cw5IdEy-.css`, `dist/assets/index-CQdvfYrj.js`
- Exit Code: 0
