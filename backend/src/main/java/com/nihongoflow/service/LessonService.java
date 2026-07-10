package com.nihongoflow.service;

import com.nihongoflow.dto.LessonDto;
import com.nihongoflow.dto.QuestionDto;
import com.nihongoflow.dto.QuizDto;
import com.nihongoflow.entity.Lesson;
import com.nihongoflow.entity.Question;
import com.nihongoflow.entity.Quiz;
import com.nihongoflow.entity.User;
import com.nihongoflow.entity.UserLessonProgress;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.LessonRepository;
import com.nihongoflow.repository.QuestionRepository;
import com.nihongoflow.repository.QuizRepository;
import com.nihongoflow.repository.UserLessonProgressRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final UserLessonProgressRepository progressRepository;
    private final StreakService streakService;
    private final EnrollmentService enrollmentService;

    @Transactional(readOnly = true)
    public LessonDto getLesson(Long lessonId, User user) {
        Lesson lesson = lessonRepository.findByIdWithCourse(lessonId)
                .orElseThrow(() -> ApiException.notFound("Bài học không tồn tại."));
        enrollmentService.requireEnrollment(lesson.getCourse().getId(), user);
        UserLessonProgress progress = progressRepository.findByUserIdAndLessonId(user.getId(), lessonId).orElse(null);
        return new LessonDto(
                lesson.getId(),
                lesson.getCourse().getId(),
                lesson.getTitle(),
                lesson.getVideoUrl(),
                lesson.getDuration(),
                lesson.getOrderIndex(),
                progress != null && progress.isCompleted(),
                progress != null ? progress.getWatchedSeconds() : 0);
    }

    @Transactional(readOnly = true)
    public QuizDto getQuiz(Long lessonId, User user) {
        Quiz quiz = quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> ApiException.notFound("Quiz không tồn tại."));
        enrollmentService.requireEnrollment(quiz.getLesson().getCourse().getId(), user);
        List<QuestionDto> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId())
                .stream()
                .map(this::toQuestionDto)
                .toList();
        return new QuizDto(quiz.getId(), quiz.getLesson().getId(), quiz.getPassScore(), questions);
    }

    @Transactional
    public void updateProgress(Long lessonId, int watchedSeconds, boolean completed, User user) {
        Lesson lesson = lessonRepository.findByIdWithCourse(lessonId)
                .orElseThrow(() -> ApiException.notFound("Bài học không tồn tại."));
        enrollmentService.requireEnrollment(lesson.getCourse().getId(), user);
        UserLessonProgress progress = progressRepository
                .findByUserIdAndLessonId(user.getId(), lessonId)
                .orElseGet(() -> new UserLessonProgress(user, lesson));

        // KHÔNG auto-complete tại 80% — spec yêu cầu xem hết video (ended event),
        // báo qua flag `completed` khi frontend nhận onComplete.
        int clamped = lesson.getDuration() > 0
                ? Math.min(watchedSeconds, lesson.getDuration())
                : watchedSeconds;
        if (clamped > progress.getWatchedSeconds()) {
            progress.setWatchedSeconds(clamped);
        }

        boolean newlyCompleted = completed && !progress.isCompleted();
        if (newlyCompleted) {
            progress.setCompleted(true);
            if (lesson.getDuration() > 0) {
                progress.setWatchedSeconds(lesson.getDuration());
            }
        }
        progressRepository.save(progress);
        if (newlyCompleted) {
            streakService.updateOnLessonCompleted(user);
        }
    }

    @Transactional
    public void markCompleted(Lesson lesson, User user) {
        UserLessonProgress progress = progressRepository
                .findByUserIdAndLessonId(user.getId(), lesson.getId())
                .orElseGet(() -> new UserLessonProgress(user, lesson));
        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            // Đặt watchedSeconds = duration để lần mở lại không resume từ 0
            if (lesson.getDuration() > 0) {
                progress.setWatchedSeconds(lesson.getDuration());
            }
            progressRepository.save(progress);
            streakService.updateOnLessonCompleted(user);
        }
    }

    private QuestionDto toQuestionDto(Question question) {
        // correctOption KHÔNG được trả về ở đây — tránh leak đáp án trước khi nộp bài
        return new QuestionDto(
                question.getId(),
                question.getQuiz().getId(),
                question.getContent(),
                question.getOptions(),
                question.getOrderIndex(),
                question.getQuestionType());
    }
}
