package com.lms.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "forum_replies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumReply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "thread_id", nullable = false)
    private ForumThread thread;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(columnDefinition = "TEXT")
    private String content;
    private Integer upvotes;
    private LocalDateTime createdAt;
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        upvotes = 0;
    }
}