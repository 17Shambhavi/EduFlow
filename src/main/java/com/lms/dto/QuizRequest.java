package com.lms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class QuizRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private Integer timeLimitSeconds;
    private Integer maxAttempts;
    private Double passingScore;
    private Long courseId;
    private List<QuestionRequest> questions;
}