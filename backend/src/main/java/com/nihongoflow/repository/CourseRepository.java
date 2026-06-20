package com.nihongoflow.repository;

import com.nihongoflow.entity.Course;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByOrderByOrderIndexAsc();

    List<Course> findByLevelIdOrderByOrderIndexAsc(Long levelId);

    List<Course> findByHiddenFalseOrderByOrderIndexAsc();

    List<Course> findByLevelIdAndHiddenFalseOrderByOrderIndexAsc(Long levelId);

    List<Course> findByIdInOrderByOrderIndexAsc(Collection<Long> ids);

    long countByLevelId(Long levelId);

    @Query("select c.level.id, count(c) from Course c group by c.level.id")
    List<Object[]> countGroupByLevel();

    @Query("select max(c.orderIndex) from Course c")
    Optional<Integer> findMaxOrderIndex();
}
