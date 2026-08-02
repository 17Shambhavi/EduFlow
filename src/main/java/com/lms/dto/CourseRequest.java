package com.lms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private Double price;
    private String category;
    private String level;
    private String thumbnailUrl;
}