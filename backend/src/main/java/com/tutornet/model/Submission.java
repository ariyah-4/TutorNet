package com.tutornet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // The learner who did the work
    @ManyToOne
    @JoinColumn(name = "learner_id", nullable = false)
    private Profile learner;

    // The lesson this submission belongs to
    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    // Type helps us distinguish between the two quickly
    private String type; // "QUIZ" or "ASSIGNMENT"

    // For Quizzes: stores the percentage
    private Double score;

    // For Assignments: stores the learner's text response or a link to a file
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();
}