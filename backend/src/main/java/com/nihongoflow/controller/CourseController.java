package com.nihongoflow.controller;

import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.CourseDto;
import com.nihongoflow.dto.LessonDto;
import com.nihongoflow.entity.User;
import com.nihongoflow.security.UserPrincipal;
import com.nihongoflow.service.CourseService;
import com.nihongoflow.service.EnrollmentService;
import com.nihongoflow.service.UserService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {
    private final CourseService courseService;
    private final UserService userService;
    private final EnrollmentService enrollmentService;

    public CourseController(
            CourseService courseService,
            UserService userService,
            EnrollmentService enrollmentService) {
        this.courseService = courseService;
        this.userService = userService;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public ApiResponse<List<CourseDto>> getCourses(
            @RequestParam(name = "levelId", required = false) Long levelId,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        return ApiResponse.ok(courseService.getCourses(levelId, user));
    }

    @GetMapping("/{courseId}")
    public ApiResponse<CourseDto> getCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        return ApiResponse.ok(courseService.getCourse(courseId, user));
    }

    @GetMapping("/{courseId}/lessons")
    public ApiResponse<List<LessonDto>> getLessons(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        return ApiResponse.ok(courseService.getLessons(courseId, user));
    }

    @PostMapping("/{courseId}/enroll")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> enroll(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        enrollmentService.enroll(courseId, user);
        return ApiResponse.ok(null);
    }

    @GetMapping("/{courseId}/enrollment")
    public ApiResponse<Boolean> isEnrolled(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getUserOrThrow(principal.getId());
        return ApiResponse.ok(enrollmentService.isEnrolled(courseId, user));
    }
}
