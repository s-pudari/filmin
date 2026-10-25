package com.filmin.profile;

import com.filmin.auth.AuthService;
import com.filmin.profile.dto.ProfileRequest;
import com.filmin.profile.dto.ProfileResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;
    private final AuthService authService;

    public ProfileController(ProfileService profileService, AuthService authService) {
        this.profileService = profileService;
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        Long currentUserId = authService.getAuthenticatedUserId();
        ProfileResponse response = profileService.getProfileByUserId(currentUserId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateMyProfile(@Valid @RequestBody ProfileRequest request) {
        Long currentUserId = authService.getAuthenticatedUserId();
        ProfileResponse response = profileService.createOrUpdateProfile(currentUserId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfileResponse> getPublicProfile(@PathVariable("id") Long userId) {
        ProfileResponse response = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(response);
    }
}
