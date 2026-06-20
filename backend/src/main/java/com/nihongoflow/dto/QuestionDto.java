package com.nihongoflow.dto;

import java.util.List;

// Dùng cho GET /lessons/:id/quiz — KHÔNG có correctOption để tránh leak đáp án
public record QuestionDto(Long id, Long quizId, String content, List<String> options, int orderIndex, String questionType) {
}
