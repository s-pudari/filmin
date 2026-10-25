package com.filmin.opportunity;

import com.filmin.auth.User;
import com.filmin.auth.UserRepository;
import com.filmin.common.ForbiddenOperationException;
import com.filmin.common.ResourceNotFoundException;
import com.filmin.opportunity.dto.*;
import com.filmin.profile.ProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public OpportunityService(OpportunityRepository opportunityRepository,
                              UserRepository userRepository,
                              ProfileRepository profileRepository) {
        this.opportunityRepository = opportunityRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public OpportunityResponse createOpportunity(Long creatorId, OpportunityCreateRequest request) {
        User creator = userRepository.findById(creatorId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Opportunity opportunity = new Opportunity(
            creator,
            request.getTitle().trim(),
            request.getOpportunityType().trim(),
            request.getRoleNeeded().trim(),
            request.getDescription().trim(),
            request.getLocation().trim(),
            request.getDeadline()
        );

        Opportunity saved = opportunityRepository.save(opportunity);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<OpportunityResponse> getOpportunities(String keyword, String role, String location, String type, int page, int size) {
        int validatedSize = Math.min(Math.max(size, 1), 50); // cap max size at 50 per PRD
        int validatedPage = Math.max(page, 0);

        Pageable pageable = PageRequest.of(validatedPage, validatedSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Opportunity> pageResult = opportunityRepository.searchOpportunities(
            keyword != null && !keyword.isBlank() ? keyword.trim() : null,
            role != null && !role.isBlank() ? role.trim() : null,
            location != null && !location.isBlank() ? location.trim() : null,
            type != null && !type.isBlank() ? type.trim() : null,
            pageable
        );

        List<OpportunityResponse> dtoList = pageResult.getContent().stream()
            .map(this::toDto)
            .collect(Collectors.toList());

        return new PageResponse<>(
            dtoList,
            pageResult.getNumber(),
            pageResult.getSize(),
            pageResult.getTotalElements(),
            pageResult.getTotalPages(),
            pageResult.isLast()
        );
    }

    @Transactional(readOnly = true)
    public OpportunityResponse getOpportunityById(Long id) {
        Opportunity opportunity = opportunityRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with ID: " + id));
        return toDto(opportunity);
    }

    @Transactional
    public OpportunityResponse updateOpportunity(Long currentUserId, Long opportunityId, OpportunityUpdateRequest request) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
            .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with ID: " + opportunityId));

        if (!opportunity.getCreator().getId().equals(currentUserId)) {
            throw new ForbiddenOperationException("You can only modify opportunities you created.");
        }

        opportunity.setTitle(request.getTitle().trim());
        opportunity.setOpportunityType(request.getOpportunityType().trim());
        opportunity.setRoleNeeded(request.getRoleNeeded().trim());
        opportunity.setDescription(request.getDescription().trim());
        opportunity.setLocation(request.getLocation().trim());
        opportunity.setDeadline(request.getDeadline());

        Opportunity saved = opportunityRepository.save(opportunity);
        return toDto(saved);
    }

    @Transactional
    public OpportunityResponse updateStatus(Long currentUserId, Long opportunityId, String status) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
            .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with ID: " + opportunityId));

        if (!opportunity.getCreator().getId().equals(currentUserId)) {
            throw new ForbiddenOperationException("You can only modify the status of opportunities you created.");
        }

        opportunity.setStatus(status.toUpperCase().trim());
        Opportunity saved = opportunityRepository.save(opportunity);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<OpportunityResponse> getMyOpportunities(Long currentUserId) {
        return opportunityRepository.findByCreatorIdOrderByCreatedAtDesc(currentUserId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public OpportunityResponse toDto(Opportunity o) {
        OpportunityResponse dto = new OpportunityResponse();
        dto.setId(o.getId());
        dto.setCreatorId(o.getCreator().getId());
        profileRepository.findByUserId(o.getCreator().getId()).ifPresent(p -> {
            dto.setCreatorName(p.getDisplayName());
        });
        if (dto.getCreatorName() == null) {
            dto.setCreatorName(o.getCreator().getEmail());
        }
        dto.setTitle(o.getTitle());
        dto.setOpportunityType(o.getOpportunityType());
        dto.setRoleNeeded(o.getRoleNeeded());
        dto.setDescription(o.getDescription());
        dto.setLocation(o.getLocation());
        dto.setDeadline(o.getDeadline());
        dto.setStatus(o.getStatus());
        dto.setCreatedAt(o.getCreatedAt());
        return dto;
    }
}
