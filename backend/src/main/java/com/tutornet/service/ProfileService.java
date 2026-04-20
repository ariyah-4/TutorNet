package com.tutornet.service;

import com.tutornet.model.Profile;
import com.tutornet.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    public Profile getProfileById(UUID id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public Profile updateProfile(UUID userId, Profile updatedData) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setFirstName(updatedData.getFirstName());
        profile.setLastName(updatedData.getLastName());
        profile.setBio(updatedData.getBio());
        profile.setAvatarUrl(updatedData.getAvatarUrl());
        profile.setUpdatedAt(java.time.LocalDateTime.now());

        return profileRepository.save(profile);
    }

    public Profile promoteToTutor(UUID userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setRole("TUTOR");
        profile.setUpdatedAt(java.time.LocalDateTime.now());
        return profileRepository.save(profile);
    }
}