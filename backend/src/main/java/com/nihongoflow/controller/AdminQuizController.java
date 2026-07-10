package com.nihongoflow.controller;

import com.nihongoflow.dto.AdminQuestionDto;
import com.nihongoflow.dto.AdminQuizDto;
import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.CreateQuizRequest;
import com.nihongoflow.dto.QuestionRequest;
import com.nihongoflow.service.AdminQuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminQuizController {

    private final AdminQuizService adminQuizService;

    @GetMapping("/lessons/{lessonId}/quiz")
    public ApiResponse<AdminQuizDto> getQuiz(@PathVariable Long lessonId) {
        return ApiResponse.ok(adminQuizService.getQuizByLesson(lessonId));
    }

    @PostMapping("/lessons/{lessonId}/quiz")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdminQuizDto> createQuiz(
            @PathVariable Long lessonId,
            @Valid @RequestBody CreateQuizRequest request) {
        return ApiResponse.ok(adminQuizService.createQuiz(lessonId, request));
    }

    @DeleteMapping("/quizzes/{quizId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuiz(@PathVariable Long quizId) {
        adminQuizService.deleteQuiz(quizId);
    }

    @PutMapping("/questions/{questionId}")
    public ApiResponse<AdminQuestionDto> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionRequest request) {
        return ApiResponse.ok(adminQuizService.updateQuestion(questionId, request));
    }
}
