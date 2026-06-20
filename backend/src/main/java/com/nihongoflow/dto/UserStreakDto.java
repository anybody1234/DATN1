package com.nihongoflow.dto;

public record UserStreakDto(int currentStreak, int longestStreak, String lastActivityDate) {
}
