package com.nihongoflow.controller;

import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.QuizAttemptDto;
import com.nihongoflow.dto.QuizAttemptRequest;
import com.nihongoflow.entity.User;
import com.nihongoflow.security.UserPrincipal;
import com.nihongoflow.service.QuizService;
import com.nihongoflow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/quizzes")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;
    private final UserService userService;

    @PostMapping("/{quizId}/attempts")
    public ApiResponse<QuizAttemptDto> submitAttempt(
            @PathVariable Long quizId,
            @Valid @RequestBody QuizAttemptRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        return ApiResponse.ok(quizService.submitAttempt(quizId, request.answers(), user));
    }
}
