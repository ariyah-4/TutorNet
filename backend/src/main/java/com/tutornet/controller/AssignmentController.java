package com.tutornet.controller;

import com.tutornet.model.Submission;
import com.tutornet.repository.SubmissionRepository;
import com.tutornet.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private SubmissionRepository submissionRepository;

    @PostMapping("/{lessonId}/submit")
    @PreAuthorize("hasRole('LEARNER')")
    public ResponseEntity<String> submit(
            @PathVariable UUID lessonId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Jwt jwt) {

        // Get ID from the secure token, not the request body
        UUID learnerId = UUID.fromString(jwt.getSubject());
        String content = body.get("content");

        assignmentService.submitAssignment(lessonId, content, learnerId);
        return ResponseEntity.ok("Assignment successfully submitted!");
    }

    @GetMapping("/{lessonId}/my-submission")
    public ResponseEntity<Submission> getMySubmission(
            @PathVariable UUID lessonId,
            @AuthenticationPrincipal Jwt jwt) {

        UUID learnerId = UUID.fromString(jwt.getSubject());

        // We look for a submission matching this specific learner, lesson, and type
        return submissionRepository.findByLearnerIdAndLessonIdAndType(learnerId, lessonId, "ASSIGNMENT")
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build()); // Returns 204 if they haven't submitted yet
    }
}