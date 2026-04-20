package com.tutornet.controller;

import com.tutornet.model.Enrollment;
import com.tutornet.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping("/{courseId}")
    public Enrollment enroll(@PathVariable UUID courseId, @AuthenticationPrincipal Jwt jwt) {
        UUID learnerId = UUID.fromString(jwt.getSubject());

        return enrollmentService.enrollLearner(learnerId, courseId);
    }

    @GetMapping("/my-learning")
    public List<Enrollment> getMyEnrollments(@AuthenticationPrincipal Jwt jwt) {
        UUID learnerId = UUID.fromString(jwt.getSubject());
        return enrollmentService.getLearnerEnrollments(learnerId);
    }

    @PatchMapping("/{enrollmentId}/progress")
    public Enrollment updateProgress(
            @PathVariable Long enrollmentId,
            @RequestParam Integer percent) {
        return enrollmentService.updateProgress(enrollmentId, percent);
    }
}