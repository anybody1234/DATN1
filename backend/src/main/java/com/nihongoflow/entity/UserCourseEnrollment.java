package com.nihongoflow.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;

@Entity
@Table(name = "user_course_enrollments")
@Getter
public class UserCourseEnrollment {

    @EmbeddedId
    private UserCourseEnrollmentId id = new UserCourseEnrollmentId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(nullable = false)
    private Instant enrolledAt;

    @PrePersist
    void prePersist() {
        if (enrolledAt == null) enrolledAt = Instant.now();
    }

    public UserCourseEnrollment() {}

    public UserCourseEnrollment(User user, Course course) {
        this.user = user;
        this.course = course;
    }

}
