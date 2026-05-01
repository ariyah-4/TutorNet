package com.tutornet.service;

import com.tutornet.model.*;
import com.tutornet.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AssignmentService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public void submitAssignment(UUID lessonId, String content, UUID learnerId) {
        // 1. Verify the Lesson exists
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        // 2. Ensure the lesson actually has an assignment attached
        Assignment assignment = lesson.getAssignment();
        if (assignment == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This lesson has no assignment requirements.");
        }

        // 3. Check if a submission already exists for this learner and lesson
        Optional<Submission> existingSubmission = submissionRepository
                .findByLearnerIdAndLessonIdAndType(learnerId, lessonId, "ASSIGNMENT");

        Submission submission;

        if (existingSubmission.isPresent()) {
            // UPDATE: Student is revising their work
            submission = existingSubmission.get();
        } else {
            // CREATE: First time the student is submitting work
            Profile learner = profileRepository.findById(learnerId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Learner not found"));

            submission = new Submission();
            submission.setLearner(learner);
            submission.setLesson(lesson);
            submission.setAssignment(assignment);
            submission.setType("ASSIGNMENT");
        }

        // 4. Update the dynamic fields
        submission.setContent(content);

        // We reset the score to null so the tutor knows it needs re-grading
        // after the student updates their content.
        submission.setScore(null);
        submission.setSubmittedAt(LocalDateTime.now());

        submissionRepository.save(submission);
    }
}