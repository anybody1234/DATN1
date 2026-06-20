package com.nihongoflow.repository;

import com.nihongoflow.entity.UserCourseEnrollment;
import com.nihongoflow.entity.UserCourseEnrollmentId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserCourseEnrollmentRepository
        extends JpaRepository<UserCourseEnrollment, UserCourseEnrollmentId> {

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    @Query("select e.course.id from UserCourseEnrollment e where e.user.id = :userId")
    List<Long> findCourseIdsByUserId(@Param("userId") Long userId);
}
