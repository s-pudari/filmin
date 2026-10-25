package com.filmin.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ApplicationStatusUpdateRequest {

    @NotBlank(message = "Status is required.")
    @Pattern(regexp = "^(SUBMITTED|SHORTLISTED|ACCEPTED|REJECTED)$", message = "Status must be SUBMITTED, SHORTLISTED, ACCEPTED, or REJECTED.")
    private String status;

    public ApplicationStatusUpdateRequest() {}

    public ApplicationStatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
