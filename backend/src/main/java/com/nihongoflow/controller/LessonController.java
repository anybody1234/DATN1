package com.nihongoflow.controller;

import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.LessonDto;
import com.nihongoflow.dto.LessonProgressRequest;
import com.nihongoflow.dto.QuizDto;
import com.nihongoflow.entity.User;
import com.nihongoflow.security.UserPrincipal;
import com.nihongoflow.service.LessonService;
import com.nihongoflow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/lessons")
@RequiredArgsConstructor
public class LessonController {
    private final LessonService lessonService;
    private final UserService userService;

    @GetMapping("/{lessonId}")
    public ApiResponse<LessonDto> getLesson(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        return ApiResponse.ok(lessonService.getLesson(lessonId, user));
    }

    @GetMapping("/{lessonId}/quiz")
    public ApiResponse<QuizDto> getQuiz(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        return ApiResponse.ok(lessonService.getQuiz(lessonId, user));
    }

    @PostMapping("/{lessonId}/progress")
    public ApiResponse<Void> updateProgress(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonProgressRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        lessonService.updateProgress(
                lessonId, request.watchedSeconds(), Boolean.TRUE.equals(request.completed()), user);
        return ApiResponse.ok(null);
    }
}
