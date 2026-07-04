package com.nihongoflow.service;

import com.nihongoflow.dto.QuestionResultDto;
import com.nihongoflow.dto.QuizAttemptDto;
import com.nihongoflow.entity.Question;
import com.nihongoflow.entity.Quiz;
import com.nihongoflow.entity.QuizAttempt;
import com.nihongoflow.entity.User;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.QuestionRepository;
import com.nihongoflow.repository.QuizAttemptRepository;
import com.nihongoflow.repository.QuizRepository;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final LessonService lessonService;
    private final EnrollmentService enrollmentService;

    public QuizService(
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            QuizAttemptRepository attemptRepository,
            LessonService lessonService,
            EnrollmentService enrollmentService) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.lessonService = lessonService;
        this.enrollmentService = enrollmentService;
    }

    @Transactional
    public QuizAttemptDto submitAttempt(Long quizId, Map<Long, Object> answers, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> ApiException.notFound("Quiz không tồn tại."));
        enrollmentService.requireEnrollment(quiz.getLesson().getCourse().getId(), user);
        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quizId);
        validateAnswers(questions, answers);

        int correct = 0;
        for (Question question : questions) {
            if (isCorrect(question, answers.get(question.getId()))) {
                correct++;
            }
        }
        int score = (int) Math.round(correct * 100.0 / questions.size());
        // Dùng số câu đúng thay vì so sánh score tròn số để tránh trường hợp
        // 70% không thể đạt được với số lẻ câu hỏi (vd: 5 câu → không có score 70)
        int requiredCorrect = (int) Math.ceil(questions.size() * quiz.getPassScore() / 100.0);
        boolean passed = correct >= requiredCorrect;

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setQuiz(quiz);
        attempt.setScore(score);
        attempt.setAnswers(answers);
        attempt.setPassed(passed);
        attempt = attemptRepository.save(attempt);

        if (passed) {
            lessonService.markCompleted(quiz.getLesson(), user);
        }

        // Trả về kết quả từng câu — đáp án đúng chỉ lộ SAU KHI nộp bài
        List<QuestionResultDto> results = questions.stream()
                .map(q -> toResultDto(q, answers.get(q.getId())))
                .toList();

        var lesson = quiz.getLesson();
        return new QuizAttemptDto(
                attempt.getId(),
                quiz.getId(),
                attempt.getScore(),
                attempt.getAnswers(),
                attempt.getAttemptedAt(),
                attempt.isPassed(),
                results,
                lesson.getTitle(),
                lesson.getId(),
                lesson.getCourse().getId());
    }

    private QuestionResultDto toResultDto(Question q, Object selected) {
        return new QuestionResultDto(
                q.getId(),
                q.getQuestionType(),
                "CONTENT".equals(q.getQuestionType()) ? q.getCorrectOption() : null,
                "VOCABULARY".equals(q.getQuestionType()) ? q.getCorrectAnswerText() : null,
                "SEQUENCE".equals(q.getQuestionType()) ? q.getCorrectOrder() : null,
                selected);
    }

    private boolean isCorrect(Question question, Object selected) {
        if (selected == null) {
            return false;
        }
        switch (question.getQuestionType()) {
            case "CONTENT" -> {
                return selected instanceof Number n && n.intValue() == question.getCorrectOption();
            }
            case "VOCABULARY" -> {
                return selected instanceof String s
                        && question.getCorrectAnswerText() != null
                        && s.trim().equalsIgnoreCase(question.getCorrectAnswerText().trim());
            }
            case "SEQUENCE" -> {
                return selected instanceof List<?> list && toIntList(list).equals(question.getCorrectOrder());
            }
            default -> {
                return false;
            }
        }
    }

    private void validateAnswers(List<Question> questions, Map<Long, Object> answers) {
        if (questions.isEmpty()) {
            throw ApiException.validation("Quiz chưa có câu hỏi.");
        }
        if (answers == null || answers.isEmpty()) {
            throw ApiException.validation("Vui lòng trả lời tất cả câu hỏi.");
        }
        Set<Long> ids = answers.keySet();
        Set<Long> questionIds = questions.stream().map(Question::getId).collect(Collectors.toSet());
        if (!ids.equals(questionIds)) {
            throw ApiException.validation("Vui lòng trả lời tất cả câu hỏi.");
        }
        for (Question question : questions) {
            Object selected = answers.get(question.getId());
            switch (question.getQuestionType()) {
                case "CONTENT" -> {
                    if (!(selected instanceof Number n) || n.intValue() < 0 || n.intValue() > 3) {
                        throw ApiException.validation("Câu trả lời không hợp lệ.");
                    }
                }
                case "VOCABULARY" -> {
                    if (!(selected instanceof String)) {
                        throw ApiException.validation("Câu trả lời không hợp lệ.");
                    }
                }
                case "SEQUENCE" -> {
                    if (!(selected instanceof List<?> list) || list.size() != 4
                            || !isPermutationOf0To3(toIntList(list))) {
                        throw ApiException.validation("Câu trả lời không hợp lệ.");
                    }
                }
                default -> throw ApiException.validation("Câu trả lời không hợp lệ.");
            }
        }
    }

    private List<Integer> toIntList(List<?> list) {
        return list.stream().map(v -> ((Number) v).intValue()).toList();
    }

    private boolean isPermutationOf0To3(List<Integer> values) {
        return Set.copyOf(values).equals(Set.of(0, 1, 2, 3));
    }
}
