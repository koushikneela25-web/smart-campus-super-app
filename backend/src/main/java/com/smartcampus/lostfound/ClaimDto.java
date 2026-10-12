package com.smartcampus.lostfound;

import java.time.Instant;

public class ClaimDto {
    private Long id;
    private Long itemId;
    private String itemTitle;
    private Long claimantId;
    private String claimantName;
    private String descriptionProof;
    private ClaimStatus status;
    private String resolutionNotes;
    private Instant createdAt;

    public ClaimDto() {}

    public ClaimDto(LostFoundClaim c) {
        this.id = c.getId();
        if (c.getItem() != null) {
            this.itemId = c.getItem().getId();
            this.itemTitle = c.getItem().getTitle();
        }
        if (c.getClaimant() != null) {
            this.claimantId = c.getClaimant().getId();
            this.claimantName = c.getClaimant().getFullName();
        }
        this.descriptionProof = c.getDescriptionProof();
        this.status = c.getStatus();
        this.resolutionNotes = c.getResolutionNotes();
        this.createdAt = c.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }
    public Long getClaimantId() { return claimantId; }
    public void setClaimantId(Long claimantId) { this.claimantId = claimantId; }
    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }
    public String getDescriptionProof() { return descriptionProof; }
    public void setDescriptionProof(String descriptionProof) { this.descriptionProof = descriptionProof; }
    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
