package com.smartcampus.lostfound;

import jakarta.validation.constraints.NotBlank;

public class SubmitClaimRequest {

    @NotBlank(message = "Description of proof/details is required")
    private String descriptionProof;

    public SubmitClaimRequest() {}
    public SubmitClaimRequest(String descriptionProof) { this.descriptionProof = descriptionProof; }

    public String getDescriptionProof() { return descriptionProof; }
    public void setDescriptionProof(String descriptionProof) { this.descriptionProof = descriptionProof; }
}
