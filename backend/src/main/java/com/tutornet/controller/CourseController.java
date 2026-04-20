package com.tutornet.controller;

import com.tutornet.model.Course;
import com.tutornet.model.Profile;
import com.tutornet.repository.CourseRepository;
import com.tutornet.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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
}