package com.nihongoflow.service;

import com.nihongoflow.dto.CourseDto;
import com.nihongoflow.dto.CourseRequest;
import com.nihongoflow.entity.Course;
import com.nihongoflow.entity.Level;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.CourseRepository;
import com.nihongoflow.repository.LessonRepository;
import com.nihongoflow.repository.LevelRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminCourseService {
    private final CourseRepository courseRepository;
    private final LevelRepository levelRepository;
    private final LessonRepository lessonRepository;

    @Transactional(readOnly = true)
    public List<CourseDto> getAllCourses() {
        List<Course> courses = courseRepository.findAllByOrderByOrderIndexAsc();
        if (courses.isEmpty()) return List.of();

        // Batch: 1 query cho tất cả lesson counts — tránh N+1
        List<Long> courseIds = courses.stream().map(Course::getId).toList();
        Map<Long, Long> lessonCounts = lessonRepository.countGroupByCourse(courseIds)
                .stream()
                .collect(Collectors.toMap(r -> (Long) r[0], r -> (Long) r[1]));

        return courses.stream()
                .map(c -> toDto(c, lessonCounts.getOrDefault(c.getId(), 0L)))
                .toList();
    }

    @Transactional
    public CourseDto createCourse(CourseRequest req) {
        Level level = findLevel(req.levelId());
        Course course = new Course();
        applyRequest(course, req, level);
        // Auto-increment: orderIndex = max hiện tại + 1, bỏ qua req.orderIndex()
        int nextOrder = courseRepository.findMaxOrderIndex().orElse(0) + 1;
        course.setOrderIndex(nextOrder);
        return toDto(courseRepository.save(course), 0L);
    }

    @Transactional
    public CourseDto updateCourse(Long courseId, CourseRequest req) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Khoá học không tồn tại."));
        Level level = findLevel(req.levelId());
        applyRequest(course, req, level);
        course.setOrderIndex(req.orderIndex()); // update: dùng giá trị admin nhập
        long count = lessonRepository.countByCourseId(courseId);
        return toDto(courseRepository.save(course), count);
    }

    @Transactional
    public void deleteCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw ApiException.notFound("Khoá học không tồn tại.");
        }
        courseRepository.deleteById(courseId);
    }

    @Transactional
    public CourseDto toggleVisibility(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Khoá học không tồn tại."));
        course.setHidden(!course.isHidden());
        long count = lessonRepository.countByCourseId(courseId);
        return toDto(courseRepository.save(course), count);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Level findLevel(Long levelId) {
        return levelRepository.findById(levelId)
                .orElseThrow(() -> ApiException.notFound("Cấp độ không tồn tại."));
    }

    /**
     * Áp dụng các field chung (title, description, level, thumbnail) vào entity.
     * orderIndex KHÔNG được đặt ở đây — create tự tính auto-increment,
     * update dùng giá trị từ request riêng.
     */
    private void applyRequest(Course course, CourseRequest req, Level level) {
        course.setLevel(level);
        course.setTitle(req.title());
        course.setDescription(req.description());
        course.setPrice(req.price());
        if (req.thumbnailUrl() != null) {
            course.setThumbnailUrl(req.thumbnailUrl());
        } else if (course.getThumbnailUrl() == null) {
            course.setThumbnailUrl(""); // đảm bảo NOT NULL khi tạo mới
        }
    }

    private CourseDto toDto(Course course, long lessonCount) {
        // completedLessons = 0 trong admin context — không cần tính per-user
        return new CourseDto(
                course.getId(),
                course.getLevel().getId(),
                course.getLevel().getName(),
                course.getTitle(),
                course.getDescription(),
                course.getThumbnailUrl(),
                course.getOrderIndex(),
                lessonCount,
                0L,
                course.isHidden(),
                course.getPrice());
    }
}
