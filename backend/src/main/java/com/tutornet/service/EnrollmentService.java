package com.tutornet.service;

import com.tutornet.model.Course;
import com.tutornet.model.Enrollment;
import com.tutornet.model.Profile;
import com.tutornet.repository.CourseRepository;
import com.tutornet.repository.EnrollmentRepository;
import com.tutornet.repository.LessonProgressRepository;
import com.tutornet.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private ProfileService profileService;

    public Enrollment enrollLearner(UUID learnerId, UUID courseId) {
        Profile learner = profileService.getProfileById(learnerId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        boolean alreadyEnrolled = enrollmentRepository
                .existsByLearnerIdAndCourseId(learnerId, courseId);

        if (alreadyEnrolled) {
            throw new RuntimeException("You are already enrolled in this course.");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setLearner(learner);
        enrollment.setCourse(course);

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getLearnerEnrollments(UUID learnerId) {
        return enrollmentRepository.findByLearnerId(learnerId);
    }

}