package com.smartcampus.announcements;

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
@RequestMapping("/api/v1/announcements")
@Tag(name = "Announcements", description = "Campus announcements with audience targeting and priority alerts")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    @Operation(summary = "Get campus announcements filtered for current user role")
    public ResponseEntity<ApiResponse<List<AnnouncementDto>>> getAnnouncements() {
        String role = null;
        try {
            role = SecurityUtils.getCurrentUser().getRole().name();
        } catch (Exception ignored) {}

        return ResponseEntity.ok(ApiResponse.success(announcementService.getAnnouncementsForRole(role)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Publish a new announcement (Admin only)")
    public ResponseEntity<ApiResponse<AnnouncementDto>> createAnnouncement(@Valid @RequestBody CreateAnnouncementRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        AnnouncementDto created = announcementService.createAnnouncement(currentUserId, request);
        return ResponseEntity.status(201).body(ApiResponse.success("Announcement published successfully", created));
    }
}
