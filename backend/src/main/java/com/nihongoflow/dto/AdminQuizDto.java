package com.nihongoflow.dto;

import java.util.List;

public record AdminQuizDto(
        Long id,
        Long lessonId,
        int passScore,
        List<AdminQuestionDto> questions
) {}
