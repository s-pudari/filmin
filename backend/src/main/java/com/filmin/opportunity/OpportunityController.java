package com.filmin.opportunity;

import com.filmin.auth.AuthService;
import com.filmin.opportunity.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityService opportunityService;
    private final AuthService authService;

    public OpportunityController(OpportunityService opportunityService, AuthService authService) {
        this.opportunityService = opportunityService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<OpportunityResponse>> listOpportunities(
        @RequestParam(value = "keyword", required = false) String keyword,
        @RequestParam(value = "role", required = false) String role,
        @RequestParam(value = "location", required = false) String location,
        @RequestParam(value = "type", required = false) String type,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        PageResponse<OpportunityResponse> result = opportunityService.getOpportunities(keyword, role, location, type, page, size);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<OpportunityResponse> createOpportunity(@Valid @RequestBody OpportunityCreateRequest request) {
        Long currentUserId = authService.getAuthenticatedUserId();
        OpportunityResponse created = opportunityService.createOpportunity(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpportunityResponse> getOpportunityById(@PathVariable("id") Long id) {
        OpportunityResponse response = opportunityService.getOpportunityById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpportunityResponse> updateOpportunity(
        @PathVariable("id") Long id,
        @Valid @RequestBody OpportunityUpdateRequest request
    ) {
        Long currentUserId = authService.getAuthenticatedUserId();
        OpportunityResponse updated = opportunityService.updateOpportunity(currentUserId, id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OpportunityResponse> updateOpportunityStatus(
        @PathVariable("id") Long id,
        @Valid @RequestBody OpportunityStatusRequest request
    ) {
        Long currentUserId = authService.getAuthenticatedUserId();
        OpportunityResponse updated = opportunityService.updateStatus(currentUserId, id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<OpportunityResponse>> getMyOpportunities() {
        Long currentUserId = authService.getAuthenticatedUserId();
        List<OpportunityResponse> list = opportunityService.getMyOpportunities(currentUserId);
        return ResponseEntity.ok(list);
    }
}
