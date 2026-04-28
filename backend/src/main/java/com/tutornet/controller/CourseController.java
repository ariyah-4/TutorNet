package com.tutornet.controller;

import com.tutornet.model.Course;
import com.tutornet.model.Enrollment;
import com.tutornet.model.Lesson;
import com.tutornet.model.Profile;
import com.tutornet.repository.CourseRepository;
import com.tutornet.repository.LessonRepository;
import com.tutornet.service.EnrollmentService;
import com.tutornet.service.LessonProgressService;
import com.tutornet.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private LessonProgressService progressService;

    // Allows learners to view all available courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Allows a tutor to see the courses they have created
    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('TUTOR')")
    public List<Course> getMyCourses(@AuthenticationPrincipal Jwt jwt) {
        UUID tutorId = UUID.fromString(jwt.getSubject());
        return courseRepository.findByTutorId(tutorId);
    }

    // Tutors can create a new course
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('TUTOR')")
    public Course createCourse(@RequestBody Course course, @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());

        Profile profile = profileService.getProfileById(userId);

        course.setTutor(profile);
        return courseRepository.save(course);
    }

    @GetMapping("/{courseId}/lessons")
    public List<Lesson> getLessonsForCourse(@PathVariable UUID courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    @PostMapping("/{courseId}/lessons")
    @PreAuthorize("hasRole('TUTOR')")
    public Lesson createLesson(
            @PathVariable UUID courseId,
            @RequestBody Lesson lesson,
            @AuthenticationPrincipal Jwt jwt) {

        // 1. Find the parent Course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        // 2. Ownership Check: Ensure the Tutor owns this course
        UUID currentTutorId = UUID.fromString(jwt.getSubject());
        if (!course.getTutor().getId().equals(currentTutorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You are not the author of this course.");
        }

        // 3. Link the child to the parent
        lesson.setCourse(course);

        // 4. Save via the LessonRepository (which you'll need to @Autowired here)
        return lessonRepository.save(lesson);
    }

    @GetMapping("/{courseId}/progress")
    public Map<String, Object> getCourseProgress(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal Jwt jwt) {

        return progressService.calculateCourseProgress(
                UUID.fromString(jwt.getSubject()),
                courseId
        );
    }

    @PostMapping("/{courseId}/enroll")
    public Enrollment enroll(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal Jwt jwt) {

        UUID learnerId = UUID.fromString(jwt.getSubject());
        return enrollmentService.enrollLearner(learnerId, courseId);
    }

    // --- LEARNER VIEWS ---
    @GetMapping("/my-learning")
    public List<Enrollment> getMyEnrollments(@AuthenticationPrincipal Jwt jwt) {
        UUID learnerId = UUID.fromString(jwt.getSubject());
        return enrollmentService.getLearnerEnrollments(learnerId);
    }
}