package com.tutornet.controller;

import com.tutornet.model.Profile;
import com.tutornet.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/tutor")
public class TutorController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/dashboard")
    public Profile getDashboard(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        String email = jwt.getClaimAsString("email");

        // This links the Supabase Auth user to our local DB Profile
        return profileService.getOrCreateProfile(userId, email);
    }
}