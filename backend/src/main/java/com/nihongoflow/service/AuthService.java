package com.nihongoflow.service;

import com.nihongoflow.config.JwtProperties;
import com.nihongoflow.dto.AuthResponse;
import com.nihongoflow.entity.RefreshToken;
import com.nihongoflow.entity.User;
import com.nihongoflow.entity.UserRole;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.RefreshTokenRepository;
import com.nihongoflow.repository.UserRepository;
import com.nihongoflow.security.JwtService;
import java.time.Instant;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            JwtProperties jwtProperties) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    @Transactional
    public AuthSession register(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw ApiException.duplicateEmail("Email này đã được sử dụng.");
        }
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(UserRole.STUDENT);
        user = userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = createRefreshToken(user);
        return new AuthSession(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthSession login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.unauthorized("Email hoặc mật khẩu không đúng."));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw ApiException.unauthorized("Email hoặc mật khẩu không đúng.");
        }
        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = createRefreshToken(user);
        return new AuthSession(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthSession refreshAccessToken(String token) {
        if (token == null || token.isBlank()) {
            throw ApiException.unauthorized("Refresh token không hợp lệ.");
        }
        RefreshToken old = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> ApiException.unauthorized("Refresh token không hợp lệ."));
        if (old.isRevoked()) {
            throw ApiException.unauthorized("Refresh token không hợp lệ.");
        }
        if (old.getExpiresAt().isBefore(Instant.now())) {
            throw ApiException.unauthorized("Refresh token đã hết hạn.");
        }

        // Rotate: xóa tất cả token cũ qua createRefreshToken — ngăn replay attack
        User user = old.getUser();
        String newAccessToken = jwtService.generateAccessToken(user);
        RefreshToken newRefreshToken = createRefreshToken(user);
        return new AuthSession(user, newAccessToken, newRefreshToken);
    }

    @Transactional
    public void logout(String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    private RefreshToken createRefreshToken(User user) {
        // Xóa tất cả token cũ — không giữ revoked rows, tránh bảng phình vô hạn
        if (user.getId() != null) {
            refreshTokenRepository.deleteAllByUserId(user.getId());
        }
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiresAt(Instant.now().plusMillis(jwtProperties.getRefreshExpiration()));
        refreshToken.setRevoked(false);
        return refreshTokenRepository.save(refreshToken);
    }

    public record AuthSession(User user, String accessToken, RefreshToken refreshToken) {
    }
}
