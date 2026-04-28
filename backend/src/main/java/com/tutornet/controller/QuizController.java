package com.tutornet.controller;

import com.tutornet.dto.QuizGradeResponse;
import com.tutornet.dto.QuizSubmissionRequest;
import com.tutornet.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/{lessonId}/submit")
    public QuizGradeResponse submitQuiz(
            @PathVariable UUID lessonId,
            @RequestBody QuizSubmissionRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        UUID learnerId = UUID.fromString(jwt.getSubject());

        return quizService.gradeAndSaveByLessonId(lessonId, request, learnerId);
    }
}