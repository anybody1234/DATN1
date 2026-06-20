package com.nihongoflow.dto;

public record LessonDto(
                Long id,
                Long courseId,
                String title,
                String videoUrl,
                int duration,
                int order,
                Boolean completed,
                Integer watchedSeconds) {
}
