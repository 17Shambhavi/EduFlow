package com.lms.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionRequest {
    private String questionText;
    private String type;
    private List<String> options;
    private String correctAnswer;
    private Integer marks;
}