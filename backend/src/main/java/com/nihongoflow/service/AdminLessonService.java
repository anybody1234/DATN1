package com.nihongoflow.service;

import com.nihongoflow.dto.LessonDto;
import com.nihongoflow.dto.LessonRequest;
import com.nihongoflow.entity.Course;
import com.nihongoflow.entity.Lesson;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.CourseRepository;
import com.nihongoflow.repository.LessonRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminLessonService {
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    public AdminLessonService(LessonRepository lessonRepository, CourseRepository courseRepository) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional(readOnly = true)
    public List<LessonDto> getLessons(Long courseId) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Khoá học không tồn tại."));
        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public LessonDto createLesson(Long courseId, LessonRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Khoá học không tồn tại."));
        Lesson lesson = new Lesson();
        lesson.setCourse(course);
        lesson.setTitle(request.title());
        lesson.setVideoUrl(request.videoUrl() != null ? request.videoUrl() : "");
        lesson.setDuration(request.duration());
        // Auto-increment: orderIndex = max trong course + 1, bỏ qua request.orderIndex()
        int nextOrder = lessonRepository.findMaxOrderIndexByCourseId(courseId).orElse(0) + 1;
        lesson.setOrderIndex(nextOrder);
        return toDto(lessonRepository.save(lesson));
    }

    @Transactional
    public LessonDto updateLesson(Long lessonId, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> ApiException.notFound("Bài học không tồn tại."));
        lesson.setTitle(request.title());
        lesson.setVideoUrl(request.videoUrl() != null ? request.videoUrl() : "");
        lesson.setDuration(request.duration());
        lesson.setOrderIndex(request.orderIndex());
        return toDto(lessonRepository.save(lesson));
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> ApiException.notFound("Bài học không tồn tại."));
        lessonRepository.delete(lesson);
    }

    private LessonDto toDto(Lesson l) {
        // completed/watchedSeconds không áp dụng cho admin context — trả về false/0
        return new LessonDto(
                l.getId(),
                l.getCourse().getId(),
                l.getTitle(),
                l.getVideoUrl(),
                l.getDuration(),
                l.getOrderIndex(),
                false,
                0);
    }
}
