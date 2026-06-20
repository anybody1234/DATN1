package com.nihongoflow.dto;

import java.util.List;

public record QuizDto(Long id, Long lessonId, int passScore, List<QuestionDto> questions) {
}
