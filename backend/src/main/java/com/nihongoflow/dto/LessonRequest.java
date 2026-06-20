package com.nihongoflow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record LessonRequest(
        @NotBlank String title,
        String videoUrl,
        @Min(value = 0, message = "Thời lượng không được âm") int duration,
        @Min(value = 1, message = "Thứ tự phải >= 1") int orderIndex) {
}
