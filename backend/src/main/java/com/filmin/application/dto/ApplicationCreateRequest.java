package com.filmin.application.dto;

import jakarta.validation.constraints.Size;

public class ApplicationCreateRequest {

    @Size(max = 2000, message = "Cover message must not exceed 2000 characters.")
    private String coverMessage;

    public ApplicationCreateRequest() {}

    public ApplicationCreateRequest(String coverMessage) {
        this.coverMessage = coverMessage;
    }

    public String getCoverMessage() {
        return coverMessage;
    }

    public void setCoverMessage(String coverMessage) {
        this.coverMessage = coverMessage;
    }
}
