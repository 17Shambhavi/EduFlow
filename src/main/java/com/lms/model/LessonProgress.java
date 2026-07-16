package com.lms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    private boolean completed;
    private Double watchedPercent;
    private LocalDateTime completedAt;
    private LocalDateTime lastWatchedAt;

    @PrePersist
    public void prePersist() {
        completed = false;
        watchedPercent = 0.0;
        lastWatchedAt = LocalDateTime.now();
    }
}