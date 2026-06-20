package com.nihongoflow.service;

import com.nihongoflow.dto.CourseDto;
import com.nihongoflow.dto.LessonDto;
import com.nihongoflow.entity.Course;
import com.nihongoflow.entity.Lesson;
import com.nihongoflow.entity.User;
import com.nihongoflow.entity.UserLessonProgress;
import com.nihongoflow.entity.UserRole;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.CourseRepository;
import com.nihongoflow.repository.LessonRepository;
import com.nihongoflow.repository.UserLessonProgressRepository;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserLessonProgressRepository progressRepository;

    public CourseService(
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            UserLessonProgressRepository progressRepository) {
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.progressRepository = progressRepository;
    }

    @Transactional(readOnly = true)
    public List<CourseDto> getCourses(Long levelId, User user) {
        List<Course> courses = levelId == null
                ? courseRepository.findByHiddenFalseOrderByOrderIndexAsc()
                : courseRepository.findByLevelIdAndHiddenFalseOrderByOrderIndexAsc(levelId);
        return toCourseDtos(courses, user);
    }

    @Transactional(readOnly = true)
    public List<CourseDto> getCoursesByIds(Collection<Long> ids, User user) {
        if (ids.isEmpty()) return List.of();
        List<Course> courses = courseRepository.findByIdInOrderByOrderIndexAsc(ids);
        return toCourseDtos(courses, user);
    }

    @Transactional(readOnly = true)
    public CourseDto getCourse(Long courseId, User user) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Khoá học không tồn tại."));
        if (course.isHidden() && user.getRole() != UserRole.ADMIN) {
            throw ApiException.notFound("Khoá học không tồn tại.");
        }
        return toCourseDtos(List.of(course), user).get(0);
    }

    @Transactional(readOnly = true)
    public List<LessonDto> getLessons(Long courseId, User user) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Khoá học không tồn tại."));
        if (course.isHidden() && user.getRole() != UserRole.ADMIN) {
            throw ApiException.notFound("Khoá học không tồn tại.");
        }
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        List<Long> lessonIds = lessons.stream().map(Lesson::getId).toList();
        Map<Long, UserLessonProgress> progressMap = lessonIds.isEmpty()
                ? Map.of()
                : progressRepository.findByUserIdAndLessonIdIn(user.getId(), lessonIds)
                        .stream()
                        .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));

        return lessons.stream()
                .map(lesson -> {
                    UserLessonProgress progress = progressMap.get(lesson.getId());
                    return new LessonDto(
                            lesson.getId(),
                            lesson.getCourse().getId(),
                            lesson.getTitle(),
                            lesson.getVideoUrl(),
                            lesson.getDuration(),
                            lesson.getOrderIndex(),
                            progress != null && progress.isCompleted(),
                            progress != null ? progress.getWatchedSeconds() : 0);
                })
                .toList();
    }

    /** Batch: 1 query lesson count + 1 query completed count cho toàn bộ danh sách course */
    private List<CourseDto> toCourseDtos(List<Course> courses, User user) {
        if (courses.isEmpty()) return List.of();

        List<Long> courseIds = courses.stream().map(Course::getId).toList();

        Map<Long, Long> lessonCounts = lessonRepository.countGroupByCourse(courseIds)
                .stream()
                .collect(Collectors.toMap(r -> (Long) r[0], r -> (Long) r[1]));

        Map<Long, Long> completedCounts = progressRepository
                .countCompletedGroupByCourse(user.getId(), courseIds)
                .stream()
                .collect(Collectors.toMap(r -> (Long) r[0], r -> (Long) r[1]));

        return courses.stream()
                .map(course -> new CourseDto(
                        course.getId(),
                        course.getLevel().getId(),
                        course.getLevel().getName(),
                        course.getTitle(),
                        course.getDescription(),
                        course.getThumbnailUrl(),
                        course.getOrderIndex(),
                        lessonCounts.getOrDefault(course.getId(), 0L),
                        completedCounts.getOrDefault(course.getId(), 0L),
                        course.isHidden(),
                        course.getPrice()))
                .toList();
    }
}
