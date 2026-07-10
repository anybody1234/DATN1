package com.nihongoflow.service;

import com.nihongoflow.dto.UserStreakDto;
import com.nihongoflow.entity.User;
import com.nihongoflow.entity.UserStreak;
import com.nihongoflow.repository.UserRepository;
import com.nihongoflow.repository.UserStreakRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StreakService {
    private final UserStreakRepository streakRepository;
    private final UserRepository userRepository;
    // Streak tính theo ngày lịch Việt Nam — không phụ thuộc timezone server
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    @Transactional(readOnly = true)
    public UserStreakDto getStreak(User user) {
        return streakRepository.findByUserId(user.getId())
                .map(streak -> {
                    Instant last = streak.getLastActivityAt();
                    if (last != null) {
                        long daysBetween = daysBetween(last, Instant.now());
                        if (daysBetween > 1) {
                            // Bỏ ít nhất 1 ngày — hiển thị 0, không ghi DB
                            return new UserStreakDto(0, streak.getLongestStreak(), last.toString());
                        }
                    }
                    return toDto(streak);
                })
                .orElseGet(() -> new UserStreakDto(0, 0, ""));
    }

    // REQUIRES_NEW: streak chạy trong transaction riêng — nếu fail không rollback quiz save
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateOnLessonCompleted(User user) {
        UserStreak streak = streakRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserStreak s = new UserStreak();
                    // Dùng getReferenceById để tránh "detached entity" error —
                    // trả về proxy managed trong transaction hiện tại thay vì dùng entity cũ
                    s.setUser(userRepository.getReferenceById(java.util.Objects.requireNonNull(user.getId())));
                    s.setCurrentStreak(0);
                    s.setLongestStreak(0);
                    return s;
                });

        Instant now = Instant.now();
        Instant last = streak.getLastActivityAt();
        if (last == null) {
            streak.setCurrentStreak(1);
        } else {
            long daysBetween = daysBetween(last, now);
            if (daysBetween == 0) {
                // Cùng ngày — không thay đổi streak
            } else if (daysBetween == 1) {
                // Ngày liên tiếp — tăng streak
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            } else {
                // Bỏ ít nhất 1 ngày — reset
                streak.setCurrentStreak(1);
            }
        }

        if (streak.getCurrentStreak() > streak.getLongestStreak()) {
            streak.setLongestStreak(streak.getCurrentStreak());
        }
        streak.setLastActivityAt(now);
        streakRepository.save(streak);
    }

    private long daysBetween(Instant earlier, Instant later) {
        LocalDate d1 = earlier.atZone(VIETNAM_ZONE).toLocalDate();
        LocalDate d2 = later.atZone(VIETNAM_ZONE).toLocalDate();
        return ChronoUnit.DAYS.between(d1, d2);
    }

    private UserStreakDto toDto(UserStreak streak) {
        String last = streak.getLastActivityAt() != null ? streak.getLastActivityAt().toString() : "";
        return new UserStreakDto(streak.getCurrentStreak(), streak.getLongestStreak(), last);
    }
}
