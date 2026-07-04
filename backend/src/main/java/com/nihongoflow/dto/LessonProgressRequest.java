package com.nihongoflow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record LessonProgressRequest(
                @NotNull(message = "watchedSeconds là bắt buộc")
                @Min(value = 0, message = "watchedSeconds phải >= 0")
                @Max(value = 86400, message = "watchedSeconds không được vượt quá 24 giờ")
                Integer watchedSeconds,
                Boolean completed) {
}
