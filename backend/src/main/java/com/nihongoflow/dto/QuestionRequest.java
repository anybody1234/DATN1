package com.nihongoflow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record QuestionRequest(
        @NotBlank String content,
        @NotNull @Size(min = 4, max = 4, message = "Phải có đúng 4 đáp án") List<String> options,
        @Min(0) @Max(3) int correctOption,
        // Bắt buộc nếu questionType = CONTENT — validate trong AdminQuizService
        String correctAnswerText,
        // Bắt buộc nếu questionType = SEQUENCE (permutation của 0-3) — validate trong AdminQuizService
        List<Integer> correctOrder
) {}
