package com.nihongoflow.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record QuizAttemptDto(
        Long id,
        Long quizId,
        int score,
        Map<Long, Object> answers,
        Instant attemptedAt,
        boolean passed,
        // Kết quả từng câu — chỉ trả về sau khi nộp bài
        List<QuestionResultDto> results,
        // Thông tin bài học — dùng cho dashboard
        String lessonTitle,
        Long lessonId,
        Long courseId) {
}
