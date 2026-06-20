package com.nihongoflow.controller;

import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.LevelDto;
import com.nihongoflow.service.LevelService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/levels")
public class LevelController {
    private final LevelService levelService;

    public LevelController(LevelService levelService) {
        this.levelService = levelService;
    }

    @GetMapping
    public ApiResponse<List<LevelDto>> getLevels() {
        return ApiResponse.ok(levelService.getLevels());
    }
}
