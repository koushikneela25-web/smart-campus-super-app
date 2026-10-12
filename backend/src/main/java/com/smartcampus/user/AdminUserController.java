package com.smartcampus.user;

import com.smartcampus.audit.AuditLog;
import com.smartcampus.audit.AuditService;
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
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "User Administration", description = "Admin user provisioning, status management, and audit log inspection")
public class AdminUserController {

    private final UserService userService;
    private final AuditService auditService;

    public AdminUserController(UserService userService, AuditService auditService) {
        this.userService = userService;
        this.auditService = auditService;
    }

    @GetMapping("/users")
    @Operation(summary = "List all campus users with optional role filter")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers(@RequestParam(required = false) Role role) {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers(role)));
    }

    @PostMapping("/users")
    @Operation(summary = "Create a new user account (Admin only)")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody CreateUserRequest request) {
        Long adminId = SecurityUtils.getCurrentUserId();
        UserDto created = userService.createUser(request, adminId);
        return ResponseEntity.status(201).body(ApiResponse.success("User created successfully", created));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Update user status (ACTIVE, INACTIVE, SUSPENDED)")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(@PathVariable Long id, @RequestParam UserStatus status) {
        Long adminId = SecurityUtils.getCurrentUserId();
        UserDto updated = userService.updateUserStatus(id, status, adminId);
        return ResponseEntity.ok(ApiResponse.success("User status updated", updated));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get recent system security and audit logs (Admin only)")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success(auditService.getRecentLogs()));
    }
}
