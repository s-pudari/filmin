package com.filmin.profile.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProfileRequest {

    @NotBlank(message = "Display name is required.")
    @Size(max = 150, message = "Display name must not exceed 150 characters.")
    private String displayName;

    @NotBlank(message = "Primary role is required.")
    private String primaryRole;

    private String skills;

    private String location;

    private String bio;

    @NotNull(message = "Experience years is required.")
    @Min(value = 0, message = "Experience years cannot be negative.")
    private Integer experienceYears;

    private String portfolioLinks;

    public ProfileRequest() {}

    public ProfileRequest(String displayName, String primaryRole, String skills, String location, String bio, Integer experienceYears, String portfolioLinks) {
        this.displayName = displayName;
        this.primaryRole = primaryRole;
        this.skills = skills;
        this.location = location;
        this.bio = bio;
        this.experienceYears = experienceYears;
        this.portfolioLinks = portfolioLinks;
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
}
