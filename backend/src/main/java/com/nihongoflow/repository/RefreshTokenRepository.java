package com.nihongoflow.repository;

import com.nihongoflow.entity.RefreshToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    // Xóa tất cả token cũ của user trước khi tạo token mới
    // clearAutomatically: xóa L1 cache sau bulk operation tránh stale entity
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM RefreshToken r WHERE r.user.id = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
