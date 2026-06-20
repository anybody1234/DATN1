package com.nihongoflow.dto;

public record AuthResponse(UserDto user, String accessToken) {
}
