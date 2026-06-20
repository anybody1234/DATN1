package com.nihongoflow.repository;

import com.nihongoflow.entity.Level;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LevelRepository extends JpaRepository<Level, Long> {
    List<Level> findAllByOrderByOrderIndexAsc();
}
