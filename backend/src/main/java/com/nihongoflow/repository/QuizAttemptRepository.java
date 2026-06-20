package com.nihongoflow.repository;

import com.nihongoflow.entity.QuizAttempt;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    // JOIN FETCH quiz+lesson+course trong 1 query — tránh N+1 cho getRecentAttempts
    @Query("""
            SELECT a FROM QuizAttempt a
            JOIN FETCH a.quiz q
            JOIN FETCH q.lesson l
            JOIN FETCH l.course
            WHERE a.user.id = :userId
            ORDER BY a.attemptedAt DESC
            """)
    List<QuizAttempt> findRecentByUserIdWithDetails(
            @Param("userId") Long userId, Pageable pageable);

    Optional<QuizAttempt> findByIdAndUserId(Long id, Long userId);
}
