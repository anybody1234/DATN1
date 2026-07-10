package com.nihongoflow.controller;

import com.nihongoflow.config.AppCookieProperties;
import com.nihongoflow.dto.AccessTokenResponse;
import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.AuthResponse;
import com.nihongoflow.dto.LoginRequest;
import com.nihongoflow.dto.RegisterRequest;
import com.nihongoflow.dto.UserDto;
import com.nihongoflow.entity.User;
import com.nihongoflow.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final String REFRESH_COOKIE = "refreshToken";
    private final AuthService authService;
    private final AppCookieProperties cookieProperties;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthService.AuthSession session = authService.register(request.email(), request.password());
        return buildAuthResponse(session);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthService.AuthSession session = authService.login(request.email(), request.password());
        return buildAuthResponse(session);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AccessTokenResponse>> refresh(
            @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken) {
        // Token được rotate: trả về access token mới + set refresh cookie mới
        AuthService.AuthSession session = authService.refreshAccessToken(refreshToken);
        ResponseCookie cookie = buildRefreshCookie(session);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.ok(new AccessTokenResponse(session.accessToken())));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken) {
        authService.logout(refreshToken);
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE, "")
                .httpOnly(true)
                .secure(cookieProperties.isSecure())
                .sameSite(cookieProperties.getSameSite())
                .path("/api/v1/auth")
                .maxAge(0)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.ok(null, "Đã đăng xuất"));
    }

    private ResponseEntity<ApiResponse<AuthResponse>> buildAuthResponse(AuthService.AuthSession session) {
        User user = session.user();
        AuthResponse data = new AuthResponse(
                new UserDto(user.getId(), user.getEmail(), user.getRole().name(), user.getCreatedAt()),
                session.accessToken());
        ResponseCookie cookie = buildRefreshCookie(session);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.ok(data));
    }

    private ResponseCookie buildRefreshCookie(AuthService.AuthSession session) {
        long maxAge = Math.max(0,
                session.refreshToken().getExpiresAt().getEpochSecond()
                        - java.time.Instant.now().getEpochSecond());
        return ResponseCookie.from(REFRESH_COOKIE, session.refreshToken().getToken())
                .httpOnly(true)
                .secure(cookieProperties.isSecure())
                .sameSite(cookieProperties.getSameSite())
                .path("/api/v1/auth") // cookie chỉ gửi kèm các auth endpoints
                .maxAge(maxAge)
                .build();
    }
}
