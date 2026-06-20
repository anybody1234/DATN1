package com.nihongoflow.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Map;

// answers: questionId -> Integer (VOCABULARY, 0-3) | String (CONTENT) | List<Integer> (SEQUENCE, permutation 0-3)
public record QuizAttemptRequest(
        @NotNull(message = "answers là bắt buộc")
        @Size(max = 10, message = "Tối đa 10 câu trả lời")
        Map<Long, Object> answers) {
}
