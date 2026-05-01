package com.tutornet.repository;

import com.tutornet.model.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {
    Optional<LessonProgress> findByLearnerIdAndLessonId(UUID learnerId, UUID lessonId);

    List<LessonProgress> findAllByLearnerIdAndLesson_CourseIdAndCompletedTrue(UUID learnerId, UUID courseId);

}