package com.smartcampus.lostfound;

import jakarta.validation.constraints.NotNull;

public class ReviewClaimRequest {

    @NotNull(message = "Review status is required (APPROVED or REJECTED)")
    private ClaimStatus status;

    private String resolutionNotes;

    public ReviewClaimRequest() {}

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}
