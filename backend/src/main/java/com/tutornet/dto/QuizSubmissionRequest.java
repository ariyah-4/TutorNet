package com.tutornet.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuizSubmissionRequest {
    // A list of the chosen option indices, e.g., [1, 0, 2]
    private List<Integer> selectedOptions;

}