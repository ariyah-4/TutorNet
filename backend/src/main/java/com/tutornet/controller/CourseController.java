package com.tutornet.controller;

import com.tutornet.model.Course;
import com.tutornet.model.Profile;
import com.tutornet.repository.CourseRepository;
import com.tutornet.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ProfileService profileService;

    // Tutors can create a new course listing
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Course createCourse(@RequestBody Course course, @AuthenticationPrincipal Jwt jwt) {
        UUID tutorId = UUID.fromString(jwt.getSubject());
        String email = jwt.getClaimAsString("email");

        // Link the course to the authenticated tutor's profile
        Profile tutor = profileService.getOrCreateProfile(tutorId, email);
        course.setTutor(tutor);

        return courseRepository.save(course);
    }

    // Allows students to view all available courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Allows a tutor to see only the courses they have created
    @GetMapping("/my-courses")
    public List<Course> getMyCourses(@AuthenticationPrincipal Jwt jwt) {
        UUID tutorId = UUID.fromString(jwt.getSubject());
        return courseRepository.findByTutorId(tutorId);
    }
}