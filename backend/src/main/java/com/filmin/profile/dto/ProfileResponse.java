package com.filmin.profile.dto;

import java.time.Instant;

public class ProfileResponse {
    private Long id;
    private Long userId;
    private String displayName;
    private String primaryRole;
    private String skills;
    private String location;
    private String bio;
    private Integer experienceYears;
    private String portfolioLinks;
    private Instant updatedAt;

    public ProfileResponse() {}

    public ProfileResponse(Long id, Long userId, String displayName, String primaryRole, String skills, String location, String bio, Integer experienceYears, String portfolioLinks, Instant updatedAt) {
        this.id = id;
        this.userId = userId;
        this.displayName = displayName;
        this.primaryRole = primaryRole;
        this.skills = skills;
        this.location = location;
        this.bio = bio;
        this.experienceYears = experienceYears;
        this.portfolioLinks = portfolioLinks;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPrimaryRole() {
        return primaryRole;
    }

    public void setPrimaryRole(String primaryRole) {
        this.primaryRole = primaryRole;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getPortfolioLinks() {
        return portfolioLinks;
    }

    public void setPortfolioLinks(String portfolioLinks) {
        this.portfolioLinks = portfolioLinks;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
