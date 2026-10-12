package com.smartcampus.lostfound;

import com.smartcampus.common.ApiResponse;
import com.smartcampus.common.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lost-found")
@Tag(name = "Lost and Found", description = "Endpoints for reporting lost/found items, submitting claims, and moderation")
public class LostFoundController {

    private final LostFoundService lostFoundService;

    public LostFoundController(LostFoundService lostFoundService) {
        this.lostFoundService = lostFoundService;
    }

    @GetMapping
    @Operation(summary = "Search lost and found items with keyword, type, category, and status filters")
    public ResponseEntity<ApiResponse<List<LostFoundItemDto>>> getItems(
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) ItemCategory category,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(ApiResponse.success(lostFoundService.searchItems(type, category, status, query)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lost/found item details")
    public ResponseEntity<ApiResponse<LostFoundItemDto>> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(lostFoundService.getItemById(id)));
    }

    @PostMapping
    @Operation(summary = "Report a new lost or found item")
    public ResponseEntity<ApiResponse<LostFoundItemDto>> createItem(@Valid @RequestBody CreateLostFoundRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        LostFoundItemDto created = lostFoundService.createItem(currentUserId, request);
        return ResponseEntity.status(201).body(ApiResponse.success("Item report submitted", created));
    }

    @GetMapping("/my")
    @Operation(summary = "Get items reported by the authenticated user")
    public ResponseEntity<ApiResponse<List<LostFoundItemDto>>> getMyItems() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(lostFoundService.getMyItems(currentUserId)));
    }

    @PostMapping("/{id}/claims")
    @Operation(summary = "Submit an ownership claim for a found item with proof description")
    public ResponseEntity<ApiResponse<ClaimDto>> submitClaim(@PathVariable Long id, @Valid @RequestBody SubmitClaimRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        ClaimDto claim = lostFoundService.submitClaim(id, currentUserId, request);
        return ResponseEntity.status(201).body(ApiResponse.success("Claim submitted successfully", claim));
    }

    @GetMapping("/{id}/claims")
    @Operation(summary = "List claims for an item (item reporter or Admin only)")
    public ResponseEntity<ApiResponse<List<ClaimDto>>> getItemClaims(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(lostFoundService.getItemClaims(id, currentUserId)));
    }

    @GetMapping("/claims/my")
    @Operation(summary = "List claims submitted by the authenticated user")
    public ResponseEntity<ApiResponse<List<ClaimDto>>> getMyClaims() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(lostFoundService.getMyClaims(currentUserId)));
    }

    @PatchMapping("/claims/{claimId}/review")
    @Operation(summary = "Approve or reject a claim (item reporter or Admin only)")
    public ResponseEntity<ApiResponse<ClaimDto>> reviewClaim(@PathVariable Long claimId, @Valid @RequestBody ReviewClaimRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        ClaimDto reviewed = lostFoundService.reviewClaim(claimId, currentUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Claim review updated", reviewed));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update status of an item (e.g. RESOLVED)")
    public ResponseEntity<ApiResponse<LostFoundItemDto>> updateStatus(@PathVariable Long id, @RequestParam ItemStatus status) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        LostFoundItemDto updated = lostFoundService.updateItemStatus(id, status, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Item status updated", updated));
    }
}
