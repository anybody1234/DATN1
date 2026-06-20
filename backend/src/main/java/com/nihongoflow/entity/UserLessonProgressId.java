package com.nihongoflow.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserLessonProgressId implements Serializable {
    private Long userId;
    private Long lessonId;

    protected UserLessonProgressId() {
    }

    public UserLessonProgressId(Long userId, Long lessonId) {
        this.userId = userId;
        this.lessonId = lessonId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof UserLessonProgressId that))
            return false;
        return Objects.equals(userId, that.userId) && Objects.equals(lessonId, that.lessonId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, lessonId);
    }
}
