package com.nihongoflow.repository;

import com.nihongoflow.entity.Lesson;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseIdOrderByOrderIndexAsc(Long courseId);

    long countByCourseId(Long courseId);

    // Batch: trả về số bài học theo từng course — tránh N+1 trong getCourses()
    @Query("select l.course.id, count(l) from Lesson l where l.course.id in :courseIds group by l.course.id")
    List<Object[]> countGroupByCourse(@Param("courseIds") Collection<Long> courseIds);

    @Query("select max(l.orderIndex) from Lesson l where l.course.id = :courseId")
    java.util.Optional<Integer> findMaxOrderIndexByCourseId(@Param("courseId") Long courseId);

    // Fetch lesson + course trong 1 query — tránh lazy load lesson.getCourse()
    @Query("SELECT l FROM Lesson l JOIN FETCH l.course WHERE l.id = :id")
    java.util.Optional<Lesson> findByIdWithCourse(@Param("id") Long id);
}
