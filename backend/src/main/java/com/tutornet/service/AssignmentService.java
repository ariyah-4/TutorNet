package com.tutornet.service;

import com.tutornet.model.Lesson;
import com.tutornet.model.Profile;
import com.tutornet.model.Submission;
import com.tutornet.repository.LessonRepository;
import com.tutornet.repository.ProfileRepository;
import com.tutornet.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        // 1. Verify the lesson exists
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        // 2. Fetch Learner
        Profile learner = profileRepository.findById(learnerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Learner not found"));

        // 3. Create the Submission record
        Submission submission = new Submission();
        submission.setLearner(learner);
        submission.setLesson(lesson);
        submission.setType("ASSIGNMENT");
        submission.setContent(content); // This is the learner's text or link
        submission.setScore(null);      // No score for assignments as per our design

        submissionRepository.save(submission);
    }
}