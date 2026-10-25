package com.filmin.application;

import com.filmin.application.dto.ApplicationCreateRequest;
import com.filmin.application.dto.ApplicationResponse;
import com.filmin.auth.User;
import com.filmin.auth.UserRepository;
import com.filmin.common.DuplicateResourceException;
import com.filmin.common.ForbiddenOperationException;
import com.filmin.common.InvalidStateTransitionException;
import com.filmin.common.ResourceNotFoundException;
import com.filmin.opportunity.Opportunity;
import com.filmin.opportunity.OpportunityRepository;
import com.filmin.profile.ProfileRepository;
import com.filmin.profile.ProfileService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ProfileService profileService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              OpportunityRepository opportunityRepository,
                              UserRepository userRepository,
                              ProfileRepository profileRepository,
                              ProfileService profileService) {
        this.applicationRepository = applicationRepository;
        this.opportunityRepository = opportunityRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.profileService = profileService;
    }

    @Transactional
    public ApplicationResponse submitApplication(Long applicantId, Long opportunityId, ApplicationCreateRequest request) {
        // 1. Check profile completed
        if (!profileService.hasCompletedProfile(applicantId)) {
            throw new IllegalArgumentException("Please complete your profile before applying to opportunities.");
        }

        // 2. Opportunity checks
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
            .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with ID: " + opportunityId));

        if (!"OPEN".equalsIgnoreCase(opportunity.getStatus())) {
            throw new IllegalArgumentException("This opportunity is currently closed for applications.");
        }

        if (opportunity.getDeadline().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("The deadline for this opportunity has already passed.");
        }

        // 3. Prevent creator from applying to own opportunity
        if (opportunity.getCreator().getId().equals(applicantId)) {
            throw new IllegalArgumentException("You cannot apply to an opportunity you created.");
        }

        // 4. Application service-level uniqueness check
        if (applicationRepository.existsByOpportunityIdAndApplicantId(opportunityId, applicantId)) {
            throw new DuplicateResourceException("You have already applied to this opportunity.");
        }

        User applicant = userRepository.findById(applicantId)
            .orElseThrow(() -> new ResourceNotFoundException("Applicant not found."));

        Application application = new Application(opportunity, applicant, request.getCoverMessage());

        try {
            Application saved = applicationRepository.save(application);
            return toDto(saved, false);
        } catch (DataIntegrityViolationException ex) {
            // Catches concurrent race conditions against the database unique constraint
            throw new DuplicateResourceException("You have already applied to this opportunity.");
        }
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(Long applicantId) {
        return applicationRepository.findByApplicantIdOrderBySubmittedAtDesc(applicantId).stream()
            .map(app -> toDto(app, false))
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsForOpportunity(Long currentUserId, Long opportunityId) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
            .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with ID: " + opportunityId));

        // IDOR Authorization check: creator only
        if (!opportunity.getCreator().getId().equals(currentUserId)) {
            throw new ForbiddenOperationException("Only the opportunity creator can review applicants.");
        }

        return applicationRepository.findByOpportunityIdOrderBySubmittedAtDesc(opportunityId).stream()
            .map(app -> toDto(app, true))
            .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long currentUserId, Long applicationId, String newStatusStr) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        // IDOR Authorization check: opportunity creator only
        if (!application.getOpportunity().getCreator().getId().equals(currentUserId)) {
            throw new ForbiddenOperationException("Only the opportunity creator can update application status.");
        }

        String currentStatus = application.getStatus().toUpperCase();
        String targetStatus = newStatusStr.toUpperCase().trim();

        // Enforce valid status transitions per PRD Section 6
        if ("ACCEPTED".equals(currentStatus) || "REJECTED".equals(currentStatus)) {
            throw new InvalidStateTransitionException("Terminal status cannot be altered (current: " + currentStatus + ").");
        }

        if (!List.of("SHORTLISTED", "ACCEPTED", "REJECTED").contains(targetStatus)) {
            throw new InvalidStateTransitionException("Invalid target status: " + targetStatus);
        }

        application.setStatus(targetStatus);
        application.setUpdatedAt(Instant.now());
        Application saved = applicationRepository.save(application);

        return toDto(saved, true);
    }

    public ApplicationResponse toDto(Application app, boolean includeProfile) {
        ApplicationResponse dto = new ApplicationResponse();
        dto.setId(app.getId());
        dto.setOpportunityId(app.getOpportunity().getId());
        dto.setOpportunityTitle(app.getOpportunity().getTitle());
        dto.setOpportunityRole(app.getOpportunity().getRoleNeeded());
        dto.setApplicantId(app.getApplicant().getId());
        dto.setCoverMessage(app.getCoverMessage());
        dto.setStatus(app.getStatus());
        dto.setSubmittedAt(app.getSubmittedAt());
        dto.setUpdatedAt(app.getUpdatedAt());

        profileRepository.findByUserId(app.getApplicant().getId()).ifPresent(profile -> {
            dto.setApplicantName(profile.getDisplayName());
            if (includeProfile) {
                dto.setApplicantProfile(profileService.toDto(profile));
            }
        });

        if (dto.getApplicantName() == null) {
            dto.setApplicantName(app.getApplicant().getEmail());
        }

        return dto;
    }
}
