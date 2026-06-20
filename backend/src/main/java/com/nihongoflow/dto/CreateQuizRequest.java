package com.nihongoflow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record CreateQuizRequest(
        @Min(0) @Max(100) int passScore
) {}
