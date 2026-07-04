package com.nihongoflow.service;

import com.nihongoflow.dto.QuizAttemptDto;
import com.nihongoflow.entity.Course;
import com.nihongoflow.entity.Lesson;
import com.nihongoflow.entity.Question;
import com.nihongoflow.entity.Quiz;
import com.nihongoflow.entity.QuizAttempt;
import com.nihongoflow.entity.User;
import com.nihongoflow.entity.UserRole;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.QuestionRepository;
import com.nihongoflow.repository.QuizAttemptRepository;
import com.nihongoflow.repository.QuizRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

// Sau khi đổi vai trò VOCABULARY <-> CONTENT (V10):
// VOCABULARY giờ là điền từ (so khớp correctAnswerText), CONTENT giờ là trắc nghiệm (so khớp correctOption).
@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock private QuizRepository quizRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private QuizAttemptRepository attemptRepository;
    @Mock private LessonService lessonService;
    @Mock private EnrollmentService enrollmentService;

    @InjectMocks private QuizService quizService;

    private Quiz quiz;
    private User user;

    @BeforeEach
    void setUp() {
        Course course = new Course();
        ReflectionTestUtils.setField(course, "id", 1L);

        Lesson lesson = new Lesson();
        ReflectionTestUtils.setField(lesson, "id", 1L);
        lesson.setCourse(course);
        lesson.setTitle("Bài học test");

        quiz = new Quiz();
        ReflectionTestUtils.setField(quiz, "id", 1L);
        quiz.setLesson(lesson);
        quiz.setPassScore(70);

        user = new User();
        ReflectionTestUtils.setField(user, "id", 1L);
        user.setRole(UserRole.STUDENT);

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        // lenient: các test validateAnswers throw trước khi save được gọi
        lenient().when(attemptRepository.save(any(QuizAttempt.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    private Question vocabularyQuestion(long id, String correctAnswerText) {
        Question q = new Question();
        ReflectionTestUtils.setField(q, "id", id);
        q.setQuiz(quiz);
        q.setQuestionType("VOCABULARY");
        q.setOptions(List.of("a", "b", "c", "d"));
        q.setCorrectOption(0);
        q.setCorrectAnswerText(correctAnswerText);
        q.setOrderIndex((int) id);
        return q;
    }

    private Question contentQuestion(long id, int correctOption) {
        Question q = new Question();
        ReflectionTestUtils.setField(q, "id", id);
        q.setQuiz(quiz);
        q.setQuestionType("CONTENT");
        q.setOptions(List.of("a", "b", "c", "d"));
        q.setCorrectOption(correctOption);
        q.setOrderIndex((int) id);
        return q;
    }

    private Question sequenceQuestion(long id, List<Integer> correctOrder) {
        Question q = new Question();
        ReflectionTestUtils.setField(q, "id", id);
        q.setQuiz(quiz);
        q.setQuestionType("SEQUENCE");
        q.setOptions(List.of("a", "b", "c", "d"));
        q.setCorrectOption(0);
        q.setCorrectOrder(correctOrder);
        q.setOrderIndex((int) id);
        return q;
    }

    @Test
    void vocabulary_dapAnDungKhongPhanBietHoaThuongVaKhoangTrang_chamDung() {
        Question q = vocabularyQuestion(1L, "Tokyo");
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(q));

        QuizAttemptDto result = quizService.submitAttempt(1L, Map.of(1L, "  tokyo  "), user);

        assertThat(result.score()).isEqualTo(100);
        assertThat(result.passed()).isTrue();
    }

    @Test
    void vocabulary_dapAnSai_chamSai() {
        Question q = vocabularyQuestion(1L, "Tokyo");
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(q));

        QuizAttemptDto result = quizService.submitAttempt(1L, Map.of(1L, "Osaka"), user);

        assertThat(result.score()).isEqualTo(0);
        assertThat(result.passed()).isFalse();
    }

    @Test
    void content_chonDungChiSoCorrectOption_chamDung() {
        Question q = contentQuestion(1L, 2);
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(q));

        QuizAttemptDto result = quizService.submitAttempt(1L, Map.of(1L, 2), user);

        assertThat(result.score()).isEqualTo(100);
    }

    @Test
    void content_chonSaiChiSo_chamSai() {
        Question q = contentQuestion(1L, 2);
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(q));

        QuizAttemptDto result = quizService.submitAttempt(1L, Map.of(1L, 1), user);

        assertThat(result.score()).isEqualTo(0);
    }

    @Test
    void sequence_dungToanBoThuTu_chamDung() {
        Question q = sequenceQuestion(1L, List.of(2, 0, 3, 1));
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(q));

        QuizAttemptDto result = quizService.submitAttempt(1L, Map.of(1L, List.of(2, 0, 3, 1)), user);

        assertThat(result.score()).isEqualTo(100);
    }

    @Test
    void sequence_saiThuTu_chamSai() {
        Question q = sequenceQuestion(1L, List.of(2, 0, 3, 1));
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(q));

        QuizAttemptDto result = quizService.submitAttempt(1L, Map.of(1L, List.of(0, 1, 2, 3)), user);

        assertThat(result.score()).isEqualTo(0);
    }

    @Test
    void boundary_dung7Tren10CauVoiPassScore70_dat() {
        List<Question> questions = List.of(
                contentQuestion(1L, 0), contentQuestion(2L, 0), contentQuestion(3L, 0),
                contentQuestion(4L, 0), contentQuestion(5L, 0), contentQuestion(6L, 0),
                contentQuestion(7L, 0), contentQuestion(8L, 0), contentQuestion(9L, 0),
                contentQuestion(10L, 0));
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(questions);

        // 7 đúng (id 1-7 chọn đúng option 0), 3 sai (id 8-10 chọn sai option 1)
        Map<Long, Object> answers = Map.ofEntries(
                Map.entry(1L, 0), Map.entry(2L, 0), Map.entry(3L, 0), Map.entry(4L, 0),
                Map.entry(5L, 0), Map.entry(6L, 0), Map.entry(7L, 0),
                Map.entry(8L, 1), Map.entry(9L, 1), Map.entry(10L, 1));

        QuizAttemptDto result = quizService.submitAttempt(1L, answers, user);

        assertThat(result.score()).isEqualTo(70);
        assertThat(result.passed()).isTrue();
    }

    @Test
    void boundary_dung6Tren10CauVoiPassScore70_khongDat() {
        List<Question> questions = List.of(
                contentQuestion(1L, 0), contentQuestion(2L, 0), contentQuestion(3L, 0),
                contentQuestion(4L, 0), contentQuestion(5L, 0), contentQuestion(6L, 0),
                contentQuestion(7L, 0), contentQuestion(8L, 0), contentQuestion(9L, 0),
                contentQuestion(10L, 0));
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(questions);

        Map<Long, Object> answers = Map.ofEntries(
                Map.entry(1L, 0), Map.entry(2L, 0), Map.entry(3L, 0), Map.entry(4L, 0),
                Map.entry(5L, 0), Map.entry(6L, 0),
                Map.entry(7L, 1), Map.entry(8L, 1), Map.entry(9L, 1), Map.entry(10L, 1));

        QuizAttemptDto result = quizService.submitAttempt(1L, answers, user);

        assertThat(result.score()).isEqualTo(60);
        assertThat(result.passed()).isFalse();
    }

    @Test
    void validate_contentNhanChuoiThayViSo_baoLoi() {
        Question q = contentQuestion(1L, 0);
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(q));

        assertThatThrownBy(() -> quizService.submitAttempt(1L, Map.of(1L, "0"), user))
                .isInstanceOf(ApiException.class)
                .hasMessage("Câu trả lời không hợp lệ.");
    }

    @Test
    void validate_vocabularyNhanSoThayViChuoi_baoLoi() {
        Question q = vocabularyQuestion(1L, "Tokyo");
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(q));

        assertThatThrownBy(() -> quizService.submitAttempt(1L, Map.of(1L, 0), user))
                .isInstanceOf(ApiException.class)
                .hasMessage("Câu trả lời không hợp lệ.");
    }

    @Test
    void validate_thieuCauTraLoi_baoLoi() {
        Question q1 = contentQuestion(1L, 0);
        Question q2 = contentQuestion(2L, 0);
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(q1, q2));

        assertThatThrownBy(() -> quizService.submitAttempt(1L, Map.of(1L, 0), user))
                .isInstanceOf(ApiException.class)
                .hasMessage("Vui lòng trả lời tất cả câu hỏi.");
    }

    @Test
    void validate_sequenceKhongPhaiHoanVi_baoLoi() {
        Question q = sequenceQuestion(1L, List.of(0, 1, 2, 3));
        when(questionRepository.findByQuizIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(q));

        assertThatThrownBy(() -> quizService.submitAttempt(1L, Map.of(1L, List.of(0, 0, 1, 2)), user))
                .isInstanceOf(ApiException.class)
                .hasMessage("Câu trả lời không hợp lệ.");
    }
}
