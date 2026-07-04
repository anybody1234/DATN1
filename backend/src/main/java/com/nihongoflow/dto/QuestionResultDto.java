package com.nihongoflow.dto;

import java.util.List;

// Dùng trong kết quả attempt — đáp án đúng chỉ lộ SAU KHI nộp bài.
// Chỉ field tương ứng questionType được điền, còn lại null.
public record QuestionResultDto(
        Long questionId,
        String questionType,
        Integer correctOption,      // CONTENT
        String correctAnswerText,   // VOCABULARY
        List<Integer> correctOrder, // SEQUENCE
        Object selectedAnswer       // Integer | String | List<Integer> | null nếu không trả lời
) {}
