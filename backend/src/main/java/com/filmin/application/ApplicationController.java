package com.filmin.application;

import com.filmin.application.dto.ApplicationCreateRequest;
import com.filmin.application.dto.ApplicationResponse;
import com.filmin.application.dto.ApplicationStatusUpdateRequest;
import com.filmin.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final AuthService authService;

    public ApplicationController(ApplicationService applicationService, AuthService authService) {
        this.applicationService = applicationService;
        this.authService = authService;
    }

    @PostMapping("/opportunities/{id}/applications")
    public ResponseEntity<ApplicationResponse> apply(
        @PathVariable("id") Long opportunityId,
        @Valid @RequestBody ApplicationCreateRequest request
    ) {
        Long currentUserId = authService.getAuthenticatedUserId();
        ApplicationResponse response = applicationService.submitApplication(currentUserId, opportunityId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/applications/mine")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications() {
        Long currentUserId = authService.getAuthenticatedUserId();
        List<ApplicationResponse> response = applicationService.getMyApplications(currentUserId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/opportunities/{id}/applications")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsForOpportunity(@PathVariable("id") Long opportunityId) {
        Long currentUserId = authService.getAuthenticatedUserId();
        List<ApplicationResponse> response = applicationService.getApplicationsForOpportunity(currentUserId, opportunityId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
        @PathVariable("id") Long applicationId,
        @Valid @RequestBody ApplicationStatusUpdateRequest request
    ) {
        Long currentUserId = authService.getAuthenticatedUserId();
        ApplicationResponse response = applicationService.updateApplicationStatus(currentUserId, applicationId, request.getStatus());
        return ResponseEntity.ok(response);
    }
}
