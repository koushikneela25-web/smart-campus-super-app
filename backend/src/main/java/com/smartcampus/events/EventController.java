package com.smartcampus.events;

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
@RequestMapping("/api/v1/events")
@Tag(name = "Campus Events", description = "Endpoints for event discovery, RSVP, capacity tracking, and management")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    @Operation(summary = "Search and list campus events with optional category, status, and text search")
    public ResponseEntity<ApiResponse<List<EventDto>>> getEvents(
            @RequestParam(required = false) EventCategory category,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(required = false) String search) {
        Long currentUserId = null;
        try {
            currentUserId = SecurityUtils.getCurrentUserId();
        } catch (Exception ignored) {}

        List<EventDto> events = eventService.getEvents(category, status, search, currentUserId);
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single event details with RSVP status for current user")
    public ResponseEntity<ApiResponse<EventDto>> getEventById(@PathVariable Long id) {
        Long currentUserId = null;
        try {
            currentUserId = SecurityUtils.getCurrentUserId();
        } catch (Exception ignored) {}

        return ResponseEntity.ok(ApiResponse.success(eventService.getEventById(id, currentUserId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    @Operation(summary = "Create a new campus event (Faculty/Admin only)")
    public ResponseEntity<ApiResponse<EventDto>> createEvent(@Valid @RequestBody CreateEventRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        EventDto created = eventService.createEvent(currentUserId, request);
        return ResponseEntity.status(201).body(ApiResponse.success("Event created successfully", created));
    }

    @PostMapping("/{id}/rsvp")
    @Operation(summary = "Register (RSVP) for an event with capacity validation")
    public ResponseEntity<ApiResponse<Void>> rsvpEvent(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        eventService.rsvpEvent(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Successfully registered for event!", null));
    }

    @DeleteMapping("/{id}/rsvp")
    @Operation(summary = "Cancel RSVP for an event")
    public ResponseEntity<ApiResponse<Void>> cancelRsvp(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        eventService.cancelRsvp(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("RSVP cancelled successfully", null));
    }
}
