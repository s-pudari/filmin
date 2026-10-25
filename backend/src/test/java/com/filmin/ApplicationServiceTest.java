package com.filmin;

import com.filmin.application.Application;
import com.filmin.application.ApplicationRepository;
import com.filmin.application.ApplicationService;
import com.filmin.application.dto.ApplicationCreateRequest;
import com.filmin.application.dto.ApplicationResponse;
import com.filmin.auth.User;
import com.filmin.auth.UserRepository;
import com.filmin.common.DuplicateResourceException;
import com.filmin.common.ForbiddenOperationException;
import com.filmin.common.InvalidStateTransitionException;
import com.filmin.opportunity.Opportunity;
import com.filmin.opportunity.OpportunityRepository;
import com.filmin.profile.ProfileRepository;
import com.filmin.profile.ProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private OpportunityRepository opportunityRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private ProfileService profileService;

    @InjectMocks
    private ApplicationService applicationService;

    private User creator;
    private User applicant;
    private Opportunity openOpportunity;

    @BeforeEach
    void setUp() {
        creator = new User("director@filmin.demo", "hash1");
        creator.setId(1L);

        applicant = new User("actor@filmin.demo", "hash2");
        applicant.setId(2L);

        openOpportunity = new Opportunity(
            creator,
            "Casting Female Lead",
            "FEATURE_FILM",
            "Lead Actress",
            "Description...",
            "Mumbai",
            LocalDate.now().plusDays(30)
        );
        openOpportunity.setId(100L);
    }

    @Test
    @DisplayName("T-008: Submit application successfully saves record")
    void submitApplication_success() {
        when(profileService.hasCompletedProfile(2L)).thenReturn(true);
        when(opportunityRepository.findById(100L)).thenReturn(Optional.of(openOpportunity));
        when(applicationRepository.existsByOpportunityIdAndApplicantId(100L, 2L)).thenReturn(false);
        when(userRepository.findById(2L)).thenReturn(Optional.of(applicant));

        Application savedApp = new Application(openOpportunity, applicant, "I would love this role.");
        savedApp.setId(500L);
        when(applicationRepository.save(any(Application.class))).thenReturn(savedApp);

        ApplicationResponse res = applicationService.submitApplication(2L, 100L, new ApplicationCreateRequest("I would love this role."));

        assertNotNull(res);
        assertEquals(500L, res.getId());
        assertEquals("SUBMITTED", res.getStatus());
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    @DisplayName("T-009: Prevent duplicate application to same opportunity")
    void submitApplication_duplicate_throwsDuplicateResourceException() {
        when(profileService.hasCompletedProfile(2L)).thenReturn(true);
        when(opportunityRepository.findById(100L)).thenReturn(Optional.of(openOpportunity));
        when(applicationRepository.existsByOpportunityIdAndApplicantId(100L, 2L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () ->
            applicationService.submitApplication(2L, 100L, new ApplicationCreateRequest("Another apply"))
        );
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("T-010: Prevent application to closed or expired opportunity")
    void submitApplication_closedOpportunity_throwsException() {
        openOpportunity.setStatus("CLOSED");
        when(profileService.hasCompletedProfile(2L)).thenReturn(true);
        when(opportunityRepository.findById(100L)).thenReturn(Optional.of(openOpportunity));

        assertThrows(IllegalArgumentException.class, () ->
            applicationService.submitApplication(2L, 100L, new ApplicationCreateRequest("Cover"))
        );
    }

    @Test
    @DisplayName("T-011: Prevent creator from applying to own opportunity")
    void submitApplication_creatorApplyingToOwn_throwsException() {
        when(profileService.hasCompletedProfile(1L)).thenReturn(true);
        when(opportunityRepository.findById(100L)).thenReturn(Optional.of(openOpportunity));

        assertThrows(IllegalArgumentException.class, () ->
            applicationService.submitApplication(1L, 100L, new ApplicationCreateRequest("Self apply"))
        );
    }

    @Test
    @DisplayName("T-014: Unrelated user cannot review applicants (IDOR check)")
    void getApplicationsForOpportunity_unrelatedUser_throwsForbidden() {
        when(opportunityRepository.findById(100L)).thenReturn(Optional.of(openOpportunity));

        // User 3 is neither creator (1) nor applicant
        assertThrows(ForbiddenOperationException.class, () ->
            applicationService.getApplicationsForOpportunity(3L, 100L)
        );
    }

    @Test
    @DisplayName("T-016: Cannot alter terminal application status (ACCEPTED/REJECTED)")
    void updateApplicationStatus_terminalStatus_throwsInvalidState() {
        Application application = new Application(openOpportunity, applicant, "Cover");
        application.setId(10L);
        application.setStatus("ACCEPTED");

        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        assertThrows(InvalidStateTransitionException.class, () ->
            applicationService.updateApplicationStatus(1L, 10L, "REJECTED")
        );
    }
}
