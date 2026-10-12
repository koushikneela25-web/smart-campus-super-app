# Smart Campus Super App — Testing & Quality Assurance Guide

## 1. Overview
The **Smart Campus Super App** follows a multi-tiered testing strategy spanning unit tests, integration tests, transactional business logic verification, and strict compile-time TypeScript type checking.

---

## 2. Backend Automated Test Suite (JUnit 5 + Mockito)

### 2.1 Execution
Execute the full test suite using the standalone helper runner:
```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\koush\.gemini\antigravity-ide\scratch\run_mvn.ps1 -Command "test"
```

### 2.2 Test Results Summary
```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.smartcampus.AttendanceServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.624 s -- in com.smartcampus.AttendanceServiceTest
[INFO] Running com.smartcampus.AuthServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.147 s -- in com.smartcampus.AuthServiceTest
[INFO] Running com.smartcampus.EventServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.126 s -- in com.smartcampus.EventServiceTest
[INFO] Running com.smartcampus.TimetableServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.138 s -- in com.smartcampus.TimetableServiceTest
[INFO]
[INFO] Results:
[INFO]
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] BUILD SUCCESS
```

---

## 3. Test Cases Breakdown

### 3.1 Authentication & Security ([AuthServiceTest.java](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/backend/src/test/java/com/smartcampus/AuthServiceTest.java))
1. `login_WithValidCredentials_ReturnsJwtTokens`: Verifies BCrypt hash matching, generation of access & refresh tokens, and emission of a `USER_LOGIN` audit log.
2. `login_WithInvalidPassword_ThrowsBadCredentials`: Validates that incorrect passwords throw an `ApiException` with HTTP 401 Unauthorized.
3. `register_WhenCollegeIdExists_ThrowsConflictException`: Ensures duplicate student registration attempts with identical college IDs trigger HTTP 409 Conflict.

### 3.2 Timetable Conflict Engine ([TimetableServiceTest.java](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/backend/src/test/java/com/smartcampus/TimetableServiceTest.java))
1. `createEntry_WhenFacultyHasOverlappingClass_ThrowsConflict`: Simulates two lectures assigned to the same instructor with overlapping start and end times; verifies rejection with a descriptive message.
2. `createEntry_WhenClassroomIsOccupied_ThrowsConflict`: Simulates two distinct instructors attempting to book the same room simultaneously; verifies room conflict enforcement.
3. `createEntry_WhenNoConflict_SavesSuccessfully`: Verifies smooth persistence when the schedule is mutually disjoint.

### 3.3 Dynamic QR & Geofence Attendance ([AttendanceServiceTest.java](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/backend/src/test/java/com/smartcampus/AttendanceServiceTest.java))
1. `submitCheckIn_WithValidTokenWithinGeofence_MarksPresent`: Validates that a student within the configured radius (3.4m < 100m) is successfully recorded with status `PRESENT`.
2. `submitCheckIn_WhenOutsideGeofence_ThrowsException`: Tests that check-in attempts from coordinates exceeding the geofence radius trigger `ApiException` ("Check-in denied: You are ... meters away from the classroom").
3. `submitCheckIn_WhenAlreadyCheckedIn_ThrowsException`: Tests duplicate check-in prevention, ensuring subsequent submissions by the same student for the same session fail.

### 3.4 Campus Event Reservation ([EventServiceTest.java](file:///C:/Users/koush/.gemini/antigravity-ide/scratch/smart-campus-super-app/backend/src/test/java/com/smartcampus/EventServiceTest.java))
1. `rsvp_WhenCapacityAvailable_RegistersStudent`: Verifies seat decrement and registration record creation.
2. `rsvp_WhenEventAtFullCapacity_ThrowsConflict`: Simulates an overbooked event (`registeredCount >= maxCapacity`) and verifies rejection with HTTP 400 Bad Request ("Event is already at full capacity").

---

## 4. Frontend Type Checking & Production Build Validation
The frontend is built with strict TypeScript compiler checks (`tsc --noEmit`) and Vite:
```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\koush\.gemini\antigravity-ide\scratch\run_npm.ps1 -Command "build"
```
**Result**:
- Modules Transformed: 2,520 modules
- TypeScript Errors: 0
- Artifacts Generated: `dist/index.html`, `dist/assets/index-Cw5IdEy-.css`, `dist/assets/index-CQdvfYrj.js`
- Exit Code: 0
