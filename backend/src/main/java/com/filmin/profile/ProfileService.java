package com.filmin.profile;

import com.filmin.auth.User;
import com.filmin.auth.UserRepository;
import com.filmin.common.ResourceNotFoundException;
import com.filmin.profile.dto.ProfileRequest;
import com.filmin.profile.dto.ProfileResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfileByUserId(Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Profile not found. Please complete your profile."));
        return toDto(profile);
    }

    @Transactional
    public ProfileResponse createOrUpdateProfile(Long userId, ProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Profile profile = profileRepository.findByUserId(userId)
            .orElseGet(() -> new Profile(user, request.getDisplayName(), request.getPrimaryRole()));

        profile.setDisplayName(request.getDisplayName().trim());
        profile.setPrimaryRole(request.getPrimaryRole().trim());
        profile.setSkills(request.getSkills() != null ? request.getSkills().trim() : null);
        profile.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);
        profile.setBio(request.getBio() != null ? request.getBio().trim() : null);
        profile.setExperienceYears(request.getExperienceYears());
        profile.setPortfolioLinks(request.getPortfolioLinks());
        profile.setUpdatedAt(Instant.now());

        Profile saved = profileRepository.save(profile);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public boolean hasCompletedProfile(Long userId) {
        return profileRepository.findByUserId(userId)
            .map(p -> p.getDisplayName() != null && !p.getDisplayName().isBlank() &&
                      p.getPrimaryRole() != null && !p.getPrimaryRole().isBlank())
            .orElse(false);
    }

    public ProfileResponse toDto(Profile p) {
        return new ProfileResponse(
            p.getId(),
            p.getUser().getId(),
            p.getDisplayName(),
            p.getPrimaryRole(),
            p.getSkills(),
            p.getLocation(),
            p.getBio(),
            p.getExperienceYears(),
            p.getPortfolioLinks(),
            p.getUpdatedAt()
        );
    }
}
