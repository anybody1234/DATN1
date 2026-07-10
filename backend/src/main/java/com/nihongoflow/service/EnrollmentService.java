package com.nihongoflow.service;

import com.nihongoflow.entity.Course;
import com.nihongoflow.entity.User;
import com.nihongoflow.entity.UserCourseEnrollment;
import com.nihongoflow.entity.UserRole;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.CourseRepository;
import com.nihongoflow.repository.UserCourseEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final UserCourseEnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public void enroll(Long courseId, User user) {
        if (enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            return; // đã đăng ký rồi — idempotent
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Khoá học không tồn tại."));
        enrollmentRepository.save(new UserCourseEnrollment(user, course));
    }

    @Transactional(readOnly = true)
    public boolean isEnrolled(Long courseId, User user) {
        return enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId);
    }

    /** Admin bỏ qua check. STUDENT phải enroll, nếu không → 403 FORBIDDEN. */
    @Transactional(readOnly = true)
    public void requireEnrollment(Long courseId, User user) {
        if (user.getRole() == UserRole.ADMIN) return;
        if (!enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            throw ApiException.forbidden("Bạn chưa đăng ký khoá học này.");
        }
    }
}
