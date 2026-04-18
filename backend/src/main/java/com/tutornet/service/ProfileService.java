package com.tutornet.service;

import com.tutornet.model.Profile;
import com.tutornet.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    public Profile getOrCreateProfile(UUID id, String email) {
        return profileRepository.findById(id)
                .orElseGet(() -> profileRepository.save(new Profile(id, email, "TUTOR")));
    }
}