package com.nihongoflow.dto;

import java.time.Instant;

public record UserDto(Long id, String email, String role, Instant createdAt) {
}
