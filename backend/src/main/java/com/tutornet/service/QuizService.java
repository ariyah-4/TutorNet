package com.tutornet.service;

import com.tutornet.dto.QuizGradeResponse;
import com.tutornet.dto.QuizSubmissionRequest;
import com.tutornet.model.*;
import com.tutornet.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private SubmissionRepository submissionRepository;
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private LessonProgressService progressService;

    @Transactional
    public QuizGradeResponse gradeAndSaveByLessonId(UUID lessonId, QuizSubmissionRequest request, UUID learnerId) {
        Quiz quiz = quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No quiz found for this lesson"));

        return gradeAndSaveQuiz(quiz.getId(), request, learnerId);
    }

    @Transactional
    public QuizGradeResponse gradeAndSaveQuiz(UUID quizId, QuizSubmissionRequest request, UUID learnerId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));

        // 1. Calculate Score
        List<Question> questions = quiz.getQuestions();
        List<Integer> studentAnswers = request.getSelectedOptions();
        int correctCount = 0;

        for (int i = 0; i < questions.size(); i++) {
            if (i < studentAnswers.size() && questions.get(i).getCorrectOptionIndex().equals(studentAnswers.get(i))) {
                correctCount++;
            }
        }
        double percentage = ((double) correctCount / questions.size()) * 100;

        // 2. The Upsert Logic: Check for existing quiz submission
        Optional<Submission> existingSubmission = submissionRepository
                .findByLearnerIdAndLessonIdAndType(learnerId, quiz.getLesson().getId(), "QUIZ");

        Submission submission;
        if (existingSubmission.isPresent()) {
            submission = existingSubmission.get();
        } else {
            Profile learner = profileRepository.findById(learnerId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Learner profile not found"));

            submission = new Submission();
            submission.setLearner(learner);
            submission.setLesson(quiz.getLesson());
            submission.setType("QUIZ");
            submission.setQuiz(quiz);
        }

        // 3. Update fields with latest attempt data
        submission.setScore(percentage);
        submission.setContent("Answers: " + studentAnswers.toString());
        submission.setSubmittedAt(LocalDateTime.now());

        submissionRepository.save(submission);

        // 4. Progress Logic (70% threshold)
        if (percentage >= 70) {
            progressService.markAsComplete(learnerId, quiz.getLesson().getId());
        }

        return new QuizGradeResponse(
                percentage,
                questions.size(),
                correctCount,
                percentage >= 70 ? "Excellent! Progress saved." : "Score saved. Try again to improve!"
        );
    }
}