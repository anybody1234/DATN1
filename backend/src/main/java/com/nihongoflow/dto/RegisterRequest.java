package com.nihongoflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Email(message = "Email không hợp lệ")
        @NotBlank(message = "Email không được để trống")
        @Size(max = 255, message = "Email không được vượt quá 255 ký tự")
        String email,

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 8, max = 72, message = "Mật khẩu phải từ 8 đến 72 ký tự")
        // max=72: bcrypt silently truncates passwords longer than 72 bytes
        String password) {
}
