package com.tutornet.repository;

import com.tutornet.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    // This will be useful later for showing a learner their own grades
    List<Submission> findByLearnerId(UUID learnerId);
}