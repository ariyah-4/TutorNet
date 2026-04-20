package com.tutornet.controller;

import com.tutornet.model.Profile;
import com.tutornet.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/me")
    public Profile getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return profileService.getProfileById(userId);
    }

    @PutMapping("/me")
    public Profile updateProfile(@AuthenticationPrincipal Jwt jwt, @RequestBody Profile updatedData) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return profileService.updateProfile(userId, updatedData);
    }

    @PostMapping("/become-tutor")
    public Profile becomeTutor(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return profileService.promoteToTutor(userId);
    }
}
