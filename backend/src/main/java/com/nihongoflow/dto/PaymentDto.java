package com.nihongoflow.dto;

public record PaymentDto(
        Long courseId,
        long amount,
        String status,
        String paymentUrl
) {}
