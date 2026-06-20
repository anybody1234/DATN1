package com.nihongoflow.dto;

import java.time.Instant;
import java.util.List;

public record AttemptReviewDto(
        Long id,
        String lessonTitle,
        Long lessonId,
        Long courseId,
        int score,
        int passScore,
        boolean passed,
        Instant attemptedAt,
        List<QuestionReviewDto> questions
) {}
