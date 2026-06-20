-- Thêm giá cho khóa học (0 = miễn phí, đơn vị VND)
ALTER TABLE courses ADD COLUMN price BIGINT NOT NULL DEFAULT 0;

-- Bảng lưu lịch sử thanh toán
CREATE TABLE payments (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT       NOT NULL,
    course_id     BIGINT       NOT NULL,
    amount        BIGINT       NOT NULL,
    vnp_txn_ref   VARCHAR(100) NOT NULL UNIQUE,
    vnp_txn_id    VARCHAR(100),
    status        VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at       TIMESTAMP,
    FOREIGN KEY (user_id)   REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE INDEX idx_payments_user_course ON payments (user_id, course_id);
CREATE INDEX idx_payments_txn_ref     ON payments (vnp_txn_ref);
