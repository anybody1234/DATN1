package com.nihongoflow.controller;

import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.CourseDto;
import com.nihongoflow.dto.CourseRequest;
import com.nihongoflow.service.AdminCourseService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/courses")
@RequiredArgsConstructor
public class AdminCourseController {
    private final AdminCourseService adminCourseService;

    @GetMapping
    public ApiResponse<List<CourseDto>> getAll() {
        return ApiResponse.ok(adminCourseService.getAllCourses());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CourseDto> create(@Valid @RequestBody CourseRequest req) {
        return ApiResponse.ok(adminCourseService.createCourse(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<CourseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest req) {
        return ApiResponse.ok(adminCourseService.updateCourse(id, req));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        adminCourseService.deleteCourse(id);
    }

    @PatchMapping("/{id}/visibility")
    public ApiResponse<CourseDto> toggleVisibility(@PathVariable Long id) {
        return ApiResponse.ok(adminCourseService.toggleVisibility(id));
    }
}
