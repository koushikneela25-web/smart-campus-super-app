package com.smartcampus.attendance;

import com.smartcampus.common.ApiResponse;
import com.smartcampus.common.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@Tag(name = "Attendance Management", description = "Dynamic QR code generation, check-in with optional geofencing, and summaries")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/sessions")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    @Operation(summary = "Start a new temporary QR attendance session (Faculty/Admin only)")
    public ResponseEntity<ApiResponse<SessionDto>> startSession(@Valid @RequestBody StartSessionRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        SessionDto session = attendanceService.startSession(currentUserId, request);
        return ResponseEntity.status(201).body(ApiResponse.success("Attendance session started", session));
    }

    @GetMapping("/sessions")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    @Operation(summary = "List all attendance sessions for current faculty")
    public ResponseEntity<ApiResponse<List<SessionDto>>> getMySessions() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getFacultySessions(currentUserId)));
    }

    @GetMapping("/sessions/{id}")
    @Operation(summary = "Get attendance session details by ID")
    public ResponseEntity<ApiResponse<SessionDto>> getSession(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getSessionById(id)));
    }

    @GetMapping("/sessions/{id}/records")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    @Operation(summary = "List check-in records for a specific attendance session")
    public ResponseEntity<ApiResponse<List<RecordDto>>> getSessionRecords(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getSessionRecords(id)));
    }

    @PostMapping("/sessions/{id}/close")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    @Operation(summary = "Close an attendance session early")
    public ResponseEntity<ApiResponse<SessionDto>> closeSession(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Session closed", attendanceService.closeSession(id, currentUserId)));
    }

    @PostMapping("/check-in")
    @Operation(summary = "Submit attendance check-in using scanned QR token and optional GPS location")
    public ResponseEntity<ApiResponse<RecordDto>> checkIn(@Valid @RequestBody CheckInRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        RecordDto record = attendanceService.submitCheckIn(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Attendance verified successfully! Marked PRESENT.", record));
    }

    @GetMapping("/my-records")
    @Operation(summary = "Get attendance records for current student")
    public ResponseEntity<ApiResponse<List<RecordDto>>> getMyRecords() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getMyRecords(currentUserId)));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get overall attendance statistics and subject-wise percentages")
    public ResponseEntity<ApiResponse<AttendanceSummaryDto>> getMySummary() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentSummary(currentUserId)));
    }

    @GetMapping("/reports/export-csv")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    @Operation(summary = "Export attendance records to CSV format")
    public ResponseEntity<byte[]> exportCsv(@RequestParam(required = false) Long sessionId) {
        String csv = attendanceService.generateCsvReport(sessionId);
        byte[] bytes = csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"attendance_report_" + System.currentTimeMillis() + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(bytes);
    }
}
