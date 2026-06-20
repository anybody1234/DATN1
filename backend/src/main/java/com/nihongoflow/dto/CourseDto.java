package com.nihongoflow.dto;

public record CourseDto(
        Long id,
        Long levelId,
        String levelName,
        String title,
        String description,
        String thumbnailUrl,
        int order,
        Long lessonCount,
        Long completedLessons,
        boolean hidden,
        long price) {
}
