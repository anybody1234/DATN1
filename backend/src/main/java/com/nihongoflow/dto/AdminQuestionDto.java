package com.nihongoflow.dto;

import java.util.List;

public record AdminQuestionDto(
        Long id,
        Long quizId,
        String content,
        List<String> options,
        int correctOption,
        String correctAnswerText,
        List<Integer> correctOrder,
        int orderIndex,
        String questionType
) {}
