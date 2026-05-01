package com.tutornet.repository;

import com.tutornet.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByLearnerId(UUID learnerId);

    boolean existsByLearnerIdAndCourseId(UUID learnerId, UUID courseId);
}
