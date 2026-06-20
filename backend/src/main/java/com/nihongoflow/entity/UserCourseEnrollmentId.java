package com.nihongoflow.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserCourseEnrollmentId implements Serializable {
    private Long userId;
    private Long courseId;

    protected UserCourseEnrollmentId() {}

    public UserCourseEnrollmentId(Long userId, Long courseId) {
        this.userId = userId;
        this.courseId = courseId;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserCourseEnrollmentId that)) return false;
        return Objects.equals(userId, that.userId) && Objects.equals(courseId, that.courseId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, courseId);
    }
}
