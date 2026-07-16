package com.lms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    private String fileUrl;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Double grade;
    private boolean graded;

    private LocalDateTime submittedAt;
    private LocalDateTime gradedAt;

    @PrePersist
    public void prePersist() {
        submittedAt = LocalDateTime.now();
        graded = false;
    }
}