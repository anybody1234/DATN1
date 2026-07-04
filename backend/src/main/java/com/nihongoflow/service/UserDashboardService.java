package com.nihongoflow.service;

import com.nihongoflow.dto.AttemptReviewDto;
import com.nihongoflow.dto.CourseDto;
import com.nihongoflow.dto.QuestionReviewDto;
import com.nihongoflow.dto.QuizAttemptDto;
import com.nihongoflow.entity.QuizAttempt;
import com.nihongoflow.entity.User;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.QuestionRepository;
import com.nihongoflow.repository.QuizAttemptRepository;
import com.nihongoflow.repository.UserCourseEnrollmentRepository;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDashboardService {
    private final CourseService courseService;
    private final QuizAttemptRepository attemptRepository;
    private final QuestionRepository questionRepository;
    private final UserCourseEnrollmentRepository enrollmentRepository;

    public UserDashboardService(
            CourseService courseService,
            QuizAttemptRepository attemptRepository,
            QuestionRepository questionRepository,
            UserCourseEnrollmentRepository enrollmentRepository) {
        this.courseService = courseService;
        this.attemptRepository = attemptRepository;
        this.questionRepository = questionRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public List<CourseDto> getMyCourses(User user) {
        List<Long> enrolledIds = enrollmentRepository.findCourseIdsByUserId(user.getId());
        if (enrolledIds.isEmpty()) return List.of();
        // Fetch trực tiếp theo IDs — tránh load toàn bộ catalog rồi filter
        return courseService.getCoursesByIds(enrolledIds, user);
    }

    @Transactional(readOnly = true)
    public List<QuizAttemptDto> getRecentAttempts(User user, int size) {
        List<QuizAttempt> attempts = attemptRepository.findRecentByUserIdWithDetails(
                user.getId(),
                PageRequest.of(0, size));
        return attempts.stream()
                .map(a -> {
                    var lesson = a.getQuiz().getLesson();
                    return new QuizAttemptDto(
                            a.getId(),
                            a.getQuiz().getId(),
                            a.getScore(),
                            a.getAnswers(),
                            a.getAttemptedAt(),
                            a.isPassed(),
                            List.of(),
                            lesson.getTitle(),
                            lesson.getId(),
                            lesson.getCourse().getId());
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public AttemptReviewDto getAttemptReview(Long attemptId, User user) {
        QuizAttempt attempt = attemptRepository
                .findByIdAndUserId(attemptId, user.getId())
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy lần làm bài."));

        var quiz = attempt.getQuiz();
        var lesson = quiz.getLesson();
        Map<Long, Object> userAnswers = attempt.getAnswers();

        List<QuestionReviewDto> questions = questionRepository
                .findByQuizIdOrderByOrderIndexAsc(quiz.getId())
                .stream()
                .map(q -> new QuestionReviewDto(
                        q.getId(),
                        q.getContent(),
                        q.getOptions(),
                        q.getQuestionType(),
                        q.getOrderIndex(),
                        "CONTENT".equals(q.getQuestionType()) ? q.getCorrectOption() : null,
                        "VOCABULARY".equals(q.getQuestionType()) ? q.getCorrectAnswerText() : null,
                        "SEQUENCE".equals(q.getQuestionType()) ? q.getCorrectOrder() : null,
                        userAnswers.get(q.getId())))
                .toList();

        return new AttemptReviewDto(
                attempt.getId(),
                lesson.getTitle(),
                lesson.getId(),
                lesson.getCourse().getId(),
                attempt.getScore(),
                quiz.getPassScore(),
                attempt.isPassed(),
                attempt.getAttemptedAt(),
                questions);
    }
}
