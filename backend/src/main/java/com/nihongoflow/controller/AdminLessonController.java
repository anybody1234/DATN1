package com.nihongoflow.controller;

import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.LessonDto;
import com.nihongoflow.dto.LessonRequest;
import com.nihongoflow.service.AdminLessonService;
import jakarta.validation.Valid;
import java.util.List;
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
public class AdminLessonController {
    private final AdminLessonService adminLessonService;

    public AdminLessonController(AdminLessonService adminLessonService) {
        this.adminLessonService = adminLessonService;
    }

    @GetMapping("/courses/{courseId}/lessons")
    public ApiResponse<List<LessonDto>> getLessons(@PathVariable Long courseId) {
        return ApiResponse.ok(adminLessonService.getLessons(courseId));
    }

    @PostMapping("/courses/{courseId}/lessons")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LessonDto> createLesson(
            @PathVariable Long courseId,
            @Valid @RequestBody LessonRequest request) {
        return ApiResponse.ok(adminLessonService.createLesson(courseId, request));
    }

    @PutMapping("/lessons/{lessonId}")
    public ApiResponse<LessonDto> updateLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonRequest request) {
        return ApiResponse.ok(adminLessonService.updateLesson(lessonId, request));
    }

    @DeleteMapping("/lessons/{lessonId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLesson(@PathVariable Long lessonId) {
        adminLessonService.deleteLesson(lessonId);
    }
}
