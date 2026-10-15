package com.lms.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;
    @Column(nullable = false)
    private String title;
    @Enumerated(EnumType.STRING)
    private LessonType type;
    private String contentUrl;
    private String description;
    private Integer orderIndex;
    private Integer durationSeconds;
    private LocalDateTime createdAt;
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
    public enum LessonType {
        VIDEO, PDF, TEXT, DOWNLOADABLE
    }
}