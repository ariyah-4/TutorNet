package com.tutornet.repository;

import com.tutornet.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByCourseIdOrderByOrderIndexAsc(UUID courseId);

    // This allows the ProgressController to see how big the course is
    long countByCourseId(UUID courseId);
}
