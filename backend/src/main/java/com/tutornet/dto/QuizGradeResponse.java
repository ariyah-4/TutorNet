package com.tutornet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizGradeResponse {
    private double score;
    private int totalQuestions;
    private int correctAnswers;
    private String message;

}