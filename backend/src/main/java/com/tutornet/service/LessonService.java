package com.tutornet.service;

import com.tutornet.model.Lesson;
import com.tutornet.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    public Lesson updateLesson(UUID lessonId, Lesson details) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lesson.setTitle(details.getTitle());
        lesson.setContent(details.getContent());
        lesson.setOrderIndex(details.getOrderIndex());

        return lessonRepository.save(lesson);
    }

    public void deleteLesson(UUID lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new RuntimeException("Lesson not found");
        }
        lessonRepository.deleteById(lessonId);
    }
}