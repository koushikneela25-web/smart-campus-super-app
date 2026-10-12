package com.smartcampus.dashboard;

import com.smartcampus.common.ApiResponse;
import com.smartcampus.common.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Dashboards & Analytics", description = "Role-specific analytical overviews for students, faculty, and administrators")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard/student")
    @Operation(summary = "Get personalized student dashboard data")
    public ResponseEntity<ApiResponse<StudentDashboardDto>> getStudentDashboard() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStudentDashboard(currentUserId)));
    }

    @GetMapping("/dashboard/faculty")
    @Operation(summary = "Get faculty dashboard data")
    public ResponseEntity<ApiResponse<FacultyDashboardDto>> getFacultyDashboard() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getFacultyDashboard(currentUserId)));
    }

    @GetMapping("/admin/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get administrative campus-wide analytics and system stats (Admin only)")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getAdminAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminDashboard()));
    }
}
