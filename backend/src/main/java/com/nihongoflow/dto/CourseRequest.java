package com.nihongoflow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CourseRequest(
        @NotBlank String title,
        @NotBlank String description,
        String thumbnailUrl,
        @NotNull Long levelId,
        @Min(value = 1, message = "Thứ tự phải >= 1") int orderIndex,
        @Min(0) long price) {
}
