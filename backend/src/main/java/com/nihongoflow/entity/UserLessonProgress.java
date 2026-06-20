package com.nihongoflow.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_lesson_progress")
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
    private boolean completed;

    @Column(nullable = false)
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

    public UserLessonProgressId getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public int getWatchedSeconds() {
        return watchedSeconds;
    }

    public void setWatchedSeconds(int watchedSeconds) {
        this.watchedSeconds = watchedSeconds;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
