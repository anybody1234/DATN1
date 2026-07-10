package com.nihongoflow.entity;

import jakarta.persistence.*;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "questions")
@Getter
@Setter
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "json")
    private List<String> options;

    @Column(nullable = false)
    private int correctOption;

    @Column(nullable = false)
    private int orderIndex;

    @Column(nullable = false, length = 20)
    private String questionType;

    @Column(name = "correct_answer_text", length = 255)
    private String correctAnswerText;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "correct_order", columnDefinition = "json")
    private List<Integer> correctOrder;
}
