package com.lms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    private Double score;
    private Integer totalMarks;
    private boolean passed;

    @Column(columnDefinition = "TEXT")
    private String submittedAnswers;

    private LocalDateTime attemptedAt;
    private LocalDateTime completedAt;

    @PrePersist
    public void prePersist() {
        attemptedAt = LocalDateTime.now();
        passed = false;
    }
}