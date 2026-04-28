package com.tutornet.repository;

import com.tutornet.model.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {
    Optional<LessonProgress> findByLearnerIdAndLessonId(UUID learnerId, UUID lessonId);

    // Counts how many lessons a learner has finished in a specific course
    long countByLearnerIdAndLesson_CourseIdAndCompletedTrue(UUID learnerId, UUID courseId);
}