package com.nihongoflow.service;

import com.nihongoflow.dto.LevelDto;
import com.nihongoflow.entity.Level;
import com.nihongoflow.repository.CourseRepository;
import com.nihongoflow.repository.LevelRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class LevelService {
    private final LevelRepository levelRepository;
    private final CourseRepository courseRepository;

    public LevelService(LevelRepository levelRepository, CourseRepository courseRepository) {
        this.levelRepository = levelRepository;
        this.courseRepository = courseRepository;
    }

    public List<LevelDto> getLevels() {
        List<Level> levels = levelRepository.findAllByOrderByOrderIndexAsc();
        Map<Long, Long> countByLevel = courseRepository.countGroupByLevel()
                .stream()
                .collect(Collectors.toMap(r -> (Long) r[0], r -> (Long) r[1]));
        return levels.stream()
                .map(level -> new LevelDto(
                        level.getId(),
                        level.getName(),
                        level.getDescription(),
                        level.getOrderIndex(),
                        countByLevel.getOrDefault(level.getId(), 0L)))
                .toList();
    }
}
