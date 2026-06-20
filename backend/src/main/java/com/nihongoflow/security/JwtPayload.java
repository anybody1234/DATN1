package com.nihongoflow.security;

public record JwtPayload(Long userId, String role) {
}
