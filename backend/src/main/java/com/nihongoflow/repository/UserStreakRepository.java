package com.nihongoflow.repository;

import com.nihongoflow.entity.UserStreak;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserStreakRepository extends JpaRepository<UserStreak, Long> {
    Optional<UserStreak> findByUserId(Long userId);
}
