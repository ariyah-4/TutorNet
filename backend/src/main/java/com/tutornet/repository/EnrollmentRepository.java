package com.tutornet.repository;

import com.tutornet.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByLearnerId(UUID learnerId);

    boolean existsByLearnerIdAndCourseId(UUID learnerId, UUID courseId);
}
