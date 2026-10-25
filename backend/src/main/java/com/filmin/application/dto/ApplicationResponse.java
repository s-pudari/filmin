package com.filmin.application.dto;

import com.filmin.profile.dto.ProfileResponse;
import java.time.Instant;

public class ApplicationResponse {
    private Long id;
    private Long opportunityId;
    private String opportunityTitle;
    private String opportunityRole;
    private Long applicantId;
    private String applicantName;
    private String coverMessage;
    private String status;
    private Instant submittedAt;
    private Instant updatedAt;
    private ProfileResponse applicantProfile;

    public ApplicationResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOpportunityId() { return opportunityId; }
    public void setOpportunityId(Long opportunityId) { this.opportunityId = opportunityId; }
    public String getOpportunityTitle() { return opportunityTitle; }
    public void setOpportunityTitle(String opportunityTitle) { this.opportunityTitle = opportunityTitle; }
    public String getOpportunityRole() { return opportunityRole; }
    public void setOpportunityRole(String opportunityRole) { this.opportunityRole = opportunityRole; }
    public Long getApplicantId() { return applicantId; }
    public void setApplicantId(Long applicantId) { this.applicantId = applicantId; }
    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }
    public String getCoverMessage() { return coverMessage; }
    public void setCoverMessage(String coverMessage) { this.coverMessage = coverMessage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public ProfileResponse getApplicantProfile() { return applicantProfile; }
    public void setApplicantProfile(ProfileResponse applicantProfile) { this.applicantProfile = applicantProfile; }
}
