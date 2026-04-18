package com.tutornet.repository;

import com.tutornet.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    // This allows us to find all courses belonging to a specific tutor
    List<Course> findByTutorId(UUID tutorId);
}