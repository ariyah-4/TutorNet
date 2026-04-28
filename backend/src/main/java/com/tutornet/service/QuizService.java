package com.tutornet.service;

import com.tutornet.dto.QuizGradeResponse;
import com.tutornet.dto.QuizSubmissionRequest;
import com.tutornet.model.*;
import com.tutornet.repository.LessonProgressRepository;
import com.tutornet.repository.ProfileRepository;
import com.tutornet.repository.QuizRepository;
import com.tutornet.repository.SubmissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
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
        // Look up the quiz associated with this specific lesson
        Quiz quiz = quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No quiz found for this lesson"));

        return gradeAndSaveQuiz(quiz.getId(), request, learnerId);
    }

    @Transactional // Ensures the grade is only saved if everything works
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

        // 2. Fetch Learner Profile
        Profile learner = profileRepository.findById(learnerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Learner profile not found"));

        // 3. Create and Save Submission
        Submission submission = new Submission();
        submission.setLearner(learner);
        submission.setLesson(quiz.getLesson());
        submission.setType("QUIZ");
        submission.setScore(percentage);
        // We could save the answers stringified here if we wanted to
        submission.setContent("Answers: " + studentAnswers.toString());

        submissionRepository.save(submission);

        if (percentage >= 70) {
            progressService.markAsComplete(learnerId, quiz.getLesson().getId());
        }

        // 4. Return the response to the frontend
        return new QuizGradeResponse(
                percentage,
                questions.size(),
                correctCount,
                percentage >= 70 ? "Excellent! Progress saved." : "Score saved. Try again to improve!"
        );
    }
}