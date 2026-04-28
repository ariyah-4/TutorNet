package com.tutornet.controller;

import com.tutornet.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @PostMapping("/{lessonId}/submit")
    public ResponseEntity<String> submitWork(
            @PathVariable UUID lessonId,
            @RequestBody String content,
            @AuthenticationPrincipal Jwt jwt) {

        UUID learnerId = UUID.fromString(jwt.getSubject());
        assignmentService.submitAssignment(lessonId, content, learnerId);

        return ResponseEntity.ok("Assignment submitted successfully. Check the next lesson for the solution!");
    }
}