package com.nihongoflow.repository;

import com.nihongoflow.entity.Quiz;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByLessonId(Long lessonId);
}
