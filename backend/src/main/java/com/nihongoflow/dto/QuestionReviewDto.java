package com.nihongoflow.dto;

import java.util.List;

public record QuestionReviewDto(
        Long id,
        String content,
        List<String> options,
        String questionType,
        int orderIndex,
        Integer correctOption,      // VOCABULARY
        String correctAnswerText,   // CONTENT
        List<Integer> correctOrder, // SEQUENCE
        Object selectedAnswer       // Integer | String | List<Integer> | null nếu không trả lời
) {}
