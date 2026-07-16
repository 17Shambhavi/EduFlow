package com.lms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_watch_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonWatchLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    private Integer segmentStart;
    private Integer segmentEnd;
    private boolean skipped;

    private LocalDateTime watchedAt;

    @PrePersist
    public void prePersist() {
        watchedAt = LocalDateTime.now();
        skipped = false;
    }
}