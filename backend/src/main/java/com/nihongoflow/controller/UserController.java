package com.nihongoflow.controller;

import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.AttemptReviewDto;
import com.nihongoflow.dto.CourseDto;
import com.nihongoflow.dto.QuizAttemptDto;
import com.nihongoflow.dto.UserStreakDto;
import com.nihongoflow.entity.User;
import com.nihongoflow.security.UserPrincipal;
import com.nihongoflow.service.StreakService;
import com.nihongoflow.service.UserDashboardService;
import com.nihongoflow.service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final StreakService streakService;
    private final UserDashboardService dashboardService;

    @GetMapping("/streak")
    public ApiResponse<UserStreakDto> getStreak(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        return ApiResponse.ok(streakService.getStreak(user));
    }

    @GetMapping("/courses")
    public ApiResponse<List<CourseDto>> getMyCourses(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        return ApiResponse.ok(dashboardService.getMyCourses(user));
    }

    @GetMapping("/quiz-attempts")
    public ApiResponse<List<QuizAttemptDto>> getQuizAttempts(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        User user = userService.getUserOrThrow(principal.getId());
        int limit = size <= 0 ? 5 : Math.min(size, 50);
        return ApiResponse.ok(dashboardService.getRecentAttempts(user, limit));
    }

    @GetMapping("/quiz-attempts/{attemptId}")
    public ApiResponse<AttemptReviewDto> getAttemptReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long attemptId) {
        User user = userService.getUserOrThrow(principal.getId());
        return ApiResponse.ok(dashboardService.getAttemptReview(attemptId, user));
    }
}
