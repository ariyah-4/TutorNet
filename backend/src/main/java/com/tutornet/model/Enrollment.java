package com.tutornet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "learner_id")
    private Profile learner;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "progress_percent")
    private Integer progressPercent = 0;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt = LocalDateTime.now();
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}