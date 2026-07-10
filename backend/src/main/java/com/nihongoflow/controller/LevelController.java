package com.nihongoflow.controller;

import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.LevelDto;
import com.nihongoflow.service.LevelService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/levels")
@RequiredArgsConstructor
public class LevelController {
    private final LevelService levelService;

    @GetMapping
    public ApiResponse<List<LevelDto>> getLevels() {
        return ApiResponse.ok(levelService.getLevels());
    }
}
