package com.nihongoflow.repository;

import com.nihongoflow.entity.UserLessonProgress;
import com.nihongoflow.entity.UserLessonProgressId;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, UserLessonProgressId> {
    Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<UserLessonProgress> findByUserIdAndLessonIdIn(Long userId, Collection<Long> lessonIds);

    // Batch: trả về số bài hoàn thành theo từng course — tránh N+1 trong getCourses()
    @Query("""
            select p.lesson.course.id, count(p)
            from UserLessonProgress p
            where p.user.id = :userId
              and p.lesson.course.id in :courseIds
              and p.completed = true
            group by p.lesson.course.id
            """)
    List<Object[]> countCompletedGroupByCourse(
            @Param("userId") Long userId, @Param("courseIds") Collection<Long> courseIds);
}
