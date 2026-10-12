package com.smartcampus.lostfound;

import com.smartcampus.audit.AuditService;
import com.smartcampus.common.BadRequestException;
import com.smartcampus.common.ResourceNotFoundException;
import com.smartcampus.notifications.Notification;
import com.smartcampus.notifications.NotificationRepository;
import com.smartcampus.notifications.NotificationType;
import com.smartcampus.user.Role;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LostFoundService {

    private final LostFoundRepository lostFoundRepository;
    private final LostFoundClaimRepository claimRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final AuditService auditService;

    public LostFoundService(LostFoundRepository lostFoundRepository,
                            LostFoundClaimRepository claimRepository,
                            UserRepository userRepository,
                            NotificationRepository notificationRepository,
                            AuditService auditService) {
        this.lostFoundRepository = lostFoundRepository;
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.auditService = auditService;
    }

    public List<LostFoundItemDto> searchItems(ItemType type, ItemCategory category, ItemStatus status, String query) {
        return lostFoundRepository.searchItems(type, category, status, query).stream()
                .map(LostFoundItemDto::new)
                .collect(Collectors.toList());
    }

    public LostFoundItemDto getItemById(Long id) {
        LostFoundItem item = lostFoundRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return new LostFoundItemDto(item);
    }

    public List<LostFoundItemDto> getMyItems(Long userId) {
        return lostFoundRepository.findByReportedByIdOrderByCreatedAtDesc(userId).stream()
                .map(LostFoundItemDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public LostFoundItemDto createItem(Long reporterId, CreateLostFoundRequest request) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LostFoundItem item = new LostFoundItem();
        item.setTitle(request.getTitle().trim());
        item.setDescription(request.getDescription().trim());
        item.setCategory(request.getCategory());
        item.setItemType(request.getItemType());
        item.setLocation(request.getLocation().trim());
        item.setDateRecorded(request.getDateRecorded() != null ? request.getDateRecorded() : LocalDate.now());
        item.setStatus(request.getItemType() == ItemType.LOST ? ItemStatus.LOST : ItemStatus.FOUND);
        item.setReportedBy(reporter);
        item.setImageUrl(request.getImageUrl());

        LostFoundItem saved = lostFoundRepository.save(item);
        auditService.log("LOST_FOUND_CREATE", "LostFoundItem", saved.getId().toString(), reporterId,
                "Reported " + saved.getItemType() + " item: " + saved.getTitle(), "127.0.0.1");

        return new LostFoundItemDto(saved);
    }

    @Transactional
    public ClaimDto submitClaim(Long itemId, Long claimantId, SubmitClaimRequest request) {
        LostFoundItem item = lostFoundRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        User claimant = userRepository.findById(claimantId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (item.getReportedBy().getId().equals(claimantId)) {
            throw new BadRequestException("You cannot submit a claim for an item reported by yourself.");
        }

        if (item.getStatus() == ItemStatus.RESOLVED) {
            throw new BadRequestException("This item has already been resolved.");
        }

        LostFoundClaim claim = new LostFoundClaim();
        claim.setItem(item);
        claim.setClaimant(claimant);
        claim.setDescriptionProof(request.getDescriptionProof().trim());
        claim.setStatus(ClaimStatus.PENDING);

        LostFoundClaim saved = claimRepository.save(claim);

        // Update item status to CLAIM_PENDING
        item.setStatus(ItemStatus.CLAIM_PENDING);
        lostFoundRepository.save(item);

        // Notify item reporter about the new claim
        Notification notif = new Notification(
                item.getReportedBy(),
                "New Claim Submitted for " + item.getTitle(),
                claimant.getFullName() + " has submitted a claim for this item. Please review.",
                NotificationType.LOST_FOUND,
                saved.getId()
        );
        notificationRepository.save(notif);

        return new ClaimDto(saved);
    }

    public List<ClaimDto> getItemClaims(Long itemId, Long currentUserId) {
        LostFoundItem item = lostFoundRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Only reporter or ADMIN can view claims
        if (currentUser.getRole() != Role.ADMIN && !item.getReportedBy().getId().equals(currentUserId)) {
            throw new BadRequestException("Unauthorized: Only the item reporter or an admin can view item claims.");
        }

        return claimRepository.findByItemIdOrderByCreatedAtDesc(itemId).stream()
                .map(ClaimDto::new)
                .collect(Collectors.toList());
    }

    public List<ClaimDto> getMyClaims(Long claimantId) {
        return claimRepository.findByClaimantIdOrderByCreatedAtDesc(claimantId).stream()
                .map(ClaimDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClaimDto reviewClaim(Long claimId, Long reviewerId, ReviewClaimRequest request) {
        LostFoundClaim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + claimId));

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LostFoundItem item = claim.getItem();

        if (reviewer.getRole() != Role.ADMIN && !item.getReportedBy().getId().equals(reviewerId)) {
            throw new BadRequestException("Unauthorized: Only the item reporter or an admin can review this claim.");
        }

        claim.setStatus(request.getStatus());
        claim.setReviewedBy(reviewer);
        claim.setResolutionNotes(request.getResolutionNotes());
        LostFoundClaim saved = claimRepository.save(claim);

        if (request.getStatus() == ClaimStatus.APPROVED) {
            item.setStatus(ItemStatus.RESOLVED);
            lostFoundRepository.save(item);
        }

        // Notify claimant of the decision
        String message = request.getStatus() == ClaimStatus.APPROVED
                ? "Your claim for '" + item.getTitle() + "' has been APPROVED! Contact the desk for handover."
                : "Your claim for '" + item.getTitle() + "' was not approved. Notes: " + (request.getResolutionNotes() != null ? request.getResolutionNotes() : "Verification failed.");

        Notification notif = new Notification(
                claim.getClaimant(),
                "Claim Decision: " + request.getStatus(),
                message,
                NotificationType.LOST_FOUND,
                claim.getId()
        );
        notificationRepository.save(notif);

        return new ClaimDto(saved);
    }

    @Transactional
    public LostFoundItemDto updateItemStatus(Long itemId, ItemStatus status, Long userId) {
        LostFoundItem item = lostFoundRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.ADMIN && !item.getReportedBy().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to modify status of this item.");
        }

        item.setStatus(status);
        return new LostFoundItemDto(lostFoundRepository.save(item));
    }
}
