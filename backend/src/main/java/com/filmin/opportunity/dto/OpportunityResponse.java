package com.filmin.opportunity.dto;

import java.time.Instant;
import java.time.LocalDate;

public class OpportunityResponse {
    private Long id;
    private Long creatorId;
    private String creatorName;
    private String title;
    private String opportunityType;
    private String roleNeeded;
    private String description;
    private String location;
    private LocalDate deadline;
    private String status;
    private Instant createdAt;
    private long applicantCount;

    public OpportunityResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }
    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getOpportunityType() { return opportunityType; }
    public void setOpportunityType(String opportunityType) { this.opportunityType = opportunityType; }
    public String getRoleNeeded() { return roleNeeded; }
    public void setRoleNeeded(String roleNeeded) { this.roleNeeded = roleNeeded; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public long getApplicantCount() { return applicantCount; }
    public void setApplicantCount(long applicantCount) { this.applicantCount = applicantCount; }
}
