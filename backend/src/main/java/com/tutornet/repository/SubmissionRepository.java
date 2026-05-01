package com.tutornet.repository;

import com.tutornet.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    // Finds the specific assignment submission for a learner in a lesson
    Optional<Submission> findByLearnerIdAndLessonIdAndType(UUID learnerId, UUID lessonId, String type);
}