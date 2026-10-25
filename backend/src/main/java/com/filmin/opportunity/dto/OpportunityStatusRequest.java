package com.filmin.opportunity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class OpportunityStatusRequest {

    @NotBlank(message = "Status is required.")
    @Pattern(regexp = "^(OPEN|CLOSED)$", message = "Status must be either OPEN or CLOSED.")
    private String status;

    public OpportunityStatusRequest() {}

    public OpportunityStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
