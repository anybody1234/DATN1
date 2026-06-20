package com.nihongoflow.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private long amount;

    @Column(name = "vnp_txn_ref", nullable = false, unique = true, length = 100)
    private String vnpTxnRef;

    @Column(name = "vnp_txn_id", length = 100)
    private String vnpTxnId;

    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    @Column(name = "paid_at")
    private Instant paidAt;

    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public long getAmount() { return amount; }
    public void setAmount(long amount) { this.amount = amount; }

    public String getVnpTxnRef() { return vnpTxnRef; }
    public void setVnpTxnRef(String vnpTxnRef) { this.vnpTxnRef = vnpTxnRef; }

    public String getVnpTxnId() { return vnpTxnId; }
    public void setVnpTxnId(String vnpTxnId) { this.vnpTxnId = vnpTxnId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }

    public Instant getPaidAt() { return paidAt; }
    public void setPaidAt(Instant paidAt) { this.paidAt = paidAt; }
}
