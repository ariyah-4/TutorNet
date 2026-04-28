package com.tutornet.controller;

import com.tutornet.model.*;
import com.tutornet.repository.*;
import com.tutornet.service.LessonProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LessonProgressService progressService;

    // --- GETTERS (Protected by Gatekeeper) ---

    @GetMapping("/{lessonId}/quiz")
    public Quiz getQuizByLesson(@PathVariable UUID lessonId, @AuthenticationPrincipal Jwt jwt) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        // The Gatekeeper Check
        validateAccess(lesson, jwt);

        return quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No quiz found for this lesson"));
    }

    @GetMapping("/{lessonId}/assignment")
    public Assignment getAssignmentByLesson(@PathVariable UUID lessonId, @AuthenticationPrincipal Jwt jwt) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        // The Gatekeeper Check
        validateAccess(lesson, jwt);

        return assignmentRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No assignment found for this lesson"));
    }

    // --- TUTOR ACTIONS (Creation) ---

    @PostMapping("/{lessonId}/quiz")
    @PreAuthorize("hasRole('TUTOR')")
    public Quiz createQuiz(
            @PathVariable UUID lessonId,
            @RequestBody Quiz quiz,
            @AuthenticationPrincipal Jwt jwt) {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        // Security: Ensure the Tutor owns the Course this lesson belongs to
        verifyTutorOwnership(lesson, jwt);

        quiz.setLesson(lesson);
        if (quiz.getQuestions() != null) {
            quiz.getQuestions().forEach(q -> q.setQuiz(quiz));
        }

        return quizRepository.save(quiz);
    }

    @PostMapping("/{lessonId}/assignment")
    @PreAuthorize("hasRole('TUTOR')")
    public Assignment createAssignment(
            @PathVariable UUID lessonId,
            @RequestBody Assignment assignment,
            @AuthenticationPrincipal Jwt jwt) {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        // Security: Ownership check
        verifyTutorOwnership(lesson, jwt);

        assignment.setLesson(lesson);
        return assignmentRepository.save(assignment);
    }

    @PostMapping("/{lessonId}/complete")
    public ResponseEntity<String> completeLesson(
            @PathVariable UUID lessonId,
            @AuthenticationPrincipal Jwt jwt) {

        progressService.markAsComplete(UUID.fromString(jwt.getSubject()), lessonId);
        return ResponseEntity.ok("Lesson marked as complete!");
    }

    @PostMapping("/{lessonId}/incomplete")
    public ResponseEntity<String> markIncomplete(
            @PathVariable UUID lessonId,
            @AuthenticationPrincipal Jwt jwt) {

        progressService.markAsIncomplete(UUID.fromString(jwt.getSubject()), lessonId);
        return ResponseEntity.ok("Lesson marked as incomplete.");
    }

    // --- PRIVATE SECURITY HELPERS ---

    /**
     * The "Gatekeeper": Checks if the user (Tutor or Learner)
     * has the right to view this lesson's content.
     */
    private void validateAccess(Lesson lesson, Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        // Assuming roles are stored in the 'role' claim as a simple string
        String role = jwt.getClaimAsString("role");

        if ("TUTOR".equals(role)) {
            verifyTutorOwnership(lesson, jwt);
        } else if ("LEARNER".equals(role)) {
            boolean isEnrolled = enrollmentRepository.existsByLearnerIdAndCourseId(userId, lesson.getCourse().getId());
            if (!isEnrolled) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You must enroll in this course first.");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Role not recognized.");
        }
    }

    /**
     * Checks if the current Tutor owns the course this lesson belongs to.
     */
    private void verifyTutorOwnership(Lesson lesson, Jwt jwt) {
        UUID currentTutorId = UUID.fromString(jwt.getSubject());
        if (!lesson.getCourse().getTutor().getId().equals(currentTutorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You do not own this course.");
        }
    }
}