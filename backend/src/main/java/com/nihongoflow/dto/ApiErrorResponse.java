package com.nihongoflow.dto;

public record ApiErrorResponse(boolean success, ApiError error) {
    public static ApiErrorResponse of(String code, String message) {
        return new ApiErrorResponse(false, new ApiError(code, message));
    }
}
