package com.lms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private Double progressPercent;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;

    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;

    @PrePersist
    public void prePersist() {
        enrolledAt = LocalDateTime.now();
        progressPercent = 0.0;
        status = EnrollmentStatus.ACTIVE;
    }

    public enum EnrollmentStatus {
        ACTIVE, COMPLETED, DROPPED
    }
}