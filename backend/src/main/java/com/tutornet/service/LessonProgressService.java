package com.tutornet.service;

import com.tutornet.model.LessonProgress;
import com.tutornet.repository.LessonProgressRepository;
import com.tutornet.repository.LessonRepository;
import com.tutornet.repository.ProfileRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class LessonProgressService {

    @Autowired
    private LessonProgressRepository progressRepository;
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private ProfileRepository profileRepository;

    @Transactional
    public void markAsComplete(UUID learnerId, UUID lessonId) {
        LessonProgress progress = progressRepository.findByLearnerIdAndLessonId(learnerId, lessonId)
                .orElseGet(() -> {
                    LessonProgress newProgress = new LessonProgress();
                    newProgress.setLearner(profileRepository.getReferenceById(learnerId));
                    newProgress.setLesson(lessonRepository.getReferenceById(lessonId));
                    return newProgress;
                });

        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        progressRepository.save(progress);
    }

    @Transactional
    public void markAsIncomplete(UUID learnerId, UUID lessonId) {
        LessonProgress progress = progressRepository.findByLearnerIdAndLessonId(learnerId, lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No progress record found for this lesson"));

        progress.setCompleted(false);
        progress.setCompletedAt(null); // Clear the timestamp
        progressRepository.save(progress);
    }

    public Map<String, Object> calculateCourseProgress(UUID learnerId, UUID courseId) {
        long totalLessons = lessonRepository.countByCourseId(courseId);
        long completedLessons = progressRepository.countByLearnerIdAndLesson_CourseIdAndCompletedTrue(learnerId, courseId);

        double percentage = totalLessons > 0 ? ((double) completedLessons / totalLessons) * 100 : 0;
        double roundedPercentage = Math.round(percentage * 100.0) / 100.0;

        return Map.of(
                "completedCount", completedLessons,
                "totalCount", totalLessons,
                "percentage", roundedPercentage
        );
    }
}