package com.nihongoflow.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_lesson_progress")
@Getter
public class UserLessonProgress {
    @EmbeddedId
    private UserLessonProgressId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @MapsId("lessonId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    @Setter
    private boolean completed;

    @Column(nullable = false)
    @Setter
    private int watchedSeconds;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
    }

    public UserLessonProgress() {
    }

    public UserLessonProgress(User user, Lesson lesson) {
        this.id = new UserLessonProgressId(user.getId(), lesson.getId());
        this.user = user;
        this.lesson = lesson;
    }
}
