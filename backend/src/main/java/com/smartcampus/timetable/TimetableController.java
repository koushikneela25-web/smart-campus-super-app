package com.smartcampus.timetable;

import com.smartcampus.common.ApiResponse;
import com.smartcampus.common.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Timetable Management", description = "Endpoints for academic schedules, conflicts detection, and personal timetables")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @GetMapping("/timetable/my")
    @Operation(summary = "Get personal timetable based on user role and assigned section/classes")
    public ResponseEntity<ApiResponse<List<TimetableDto>>> getMyTimetable() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(timetableService.getMyTimetable(currentUserId)));
    }

    @GetMapping("/timetable")
    @Operation(summary = "List timetable entries with optional section or faculty filters")
    public ResponseEntity<ApiResponse<List<TimetableDto>>> getTimetable(
            @RequestParam(required = false) Long sectionId,
            @RequestParam(required = false) Long facultyId) {
        return ResponseEntity.ok(ApiResponse.success(timetableService.getAllTimetableEntries(sectionId, facultyId)));
    }

    @PostMapping("/admin/timetable")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create timetable slot with automatic conflict validation (Admin only)")
    public ResponseEntity<ApiResponse<TimetableDto>> createTimetableEntry(@Valid @RequestBody CreateTimetableRequest request) {
        TimetableDto created = timetableService.createTimetableEntry(request);
        return ResponseEntity.status(201).body(ApiResponse.success("Timetable slot created successfully", created));
    }

    @PutMapping("/admin/timetable/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update timetable slot with conflict validation (Admin only)")
    public ResponseEntity<ApiResponse<TimetableDto>> updateTimetableEntry(
            @PathVariable Long id,
            @Valid @RequestBody CreateTimetableRequest request) {
        TimetableDto updated = timetableService.updateTimetableEntry(id, request);
        return ResponseEntity.ok(ApiResponse.success("Timetable slot updated successfully", updated));
    }

    @DeleteMapping("/admin/timetable/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete timetable slot (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteTimetableEntry(@PathVariable Long id) {
        timetableService.deleteTimetableEntry(id);
        return ResponseEntity.ok(ApiResponse.success("Timetable slot deleted successfully", null));
    }
}
