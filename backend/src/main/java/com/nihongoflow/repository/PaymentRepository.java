package com.nihongoflow.repository;

import com.nihongoflow.entity.Payment;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByVnpTxnRef(String vnpTxnRef);

    boolean existsByUserIdAndCourseIdAndStatus(Long userId, Long courseId, String status);
}
