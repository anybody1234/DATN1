package com.nihongoflow.service;

import com.nihongoflow.dto.AdminQuestionDto;
import com.nihongoflow.dto.AdminQuizDto;
import com.nihongoflow.dto.CreateQuizRequest;
import com.nihongoflow.dto.QuestionRequest;
import com.nihongoflow.entity.Lesson;
import com.nihongoflow.entity.Question;
import com.nihongoflow.entity.Quiz;
import com.nihongoflow.exception.ApiException;
import com.nihongoflow.repository.LessonRepository;
import com.nihongoflow.repository.QuestionRepository;
import com.nihongoflow.repository.QuizRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminQuizService {

    private record QuestionTemplate(int orderIndex, String questionType) {}

    private static final List<QuestionTemplate> QUESTION_TEMPLATES = List.of(
        new QuestionTemplate(1,  "VOCABULARY"), new QuestionTemplate(2,  "VOCABULARY"),
        new QuestionTemplate(3,  "VOCABULARY"), new QuestionTemplate(4,  "VOCABULARY"),
        new QuestionTemplate(5,  "CONTENT"),    new QuestionTemplate(6,  "CONTENT"),
        new QuestionTemplate(7,  "CONTENT"),
        new QuestionTemplate(8,  "SEQUENCE"),   new QuestionTemplate(9,  "SEQUENCE"),
        new QuestionTemplate(10, "SEQUENCE")
    );

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final LessonRepository lessonRepository;

    @Transactional(readOnly = true)
    public AdminQuizDto getQuizByLesson(Long lessonId) {
        Quiz quiz = quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> ApiException.notFound("Quiz không tồn tại cho bài học này"));
        List<AdminQuestionDto> questions = questionRepository
                .findByQuizIdOrderByOrderIndexAsc(quiz.getId())
                .stream()
                .map(this::toDto)
                .toList();
        return new AdminQuizDto(quiz.getId(), lessonId, quiz.getPassScore(), questions);
    }

    @Transactional
    public AdminQuizDto createQuiz(Long lessonId, CreateQuizRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> ApiException.notFound("Bài học không tồn tại"));
        if (quizRepository.findByLessonId(lessonId).isPresent()) {
            throw ApiException.alreadyExists("Bài học này đã có quiz");
        }

        Quiz quiz = new Quiz();
        quiz.setLesson(lesson);
        quiz.setPassScore(request.passScore());
        quizRepository.save(quiz);

        List<Question> questions = new ArrayList<>();
        for (QuestionTemplate tmpl : QUESTION_TEMPLATES) {
            Question q = new Question();
            q.setQuiz(quiz);
            q.setOrderIndex(tmpl.orderIndex());
            q.setQuestionType(tmpl.questionType());
            q.setContent("Câu hỏi " + tmpl.orderIndex());
            q.setOptions(List.of("Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"));
            q.setCorrectOption(0);
            if ("VOCABULARY".equals(tmpl.questionType())) {
                q.setCorrectAnswerText("Đáp án mẫu");
            } else if ("SEQUENCE".equals(tmpl.questionType())) {
                q.setCorrectOrder(List.of(0, 1, 2, 3));
            }
            questions.add(q);
        }
        questionRepository.saveAll(questions);

        List<AdminQuestionDto> questionDtos = questions.stream().map(this::toDto).toList();
        return new AdminQuizDto(quiz.getId(), lessonId, quiz.getPassScore(), questionDtos);
    }

    @Transactional
    public void deleteQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> ApiException.notFound("Quiz không tồn tại"));
        quizRepository.delete(quiz);
    }

    @Transactional
    public AdminQuestionDto updateQuestion(Long questionId, QuestionRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> ApiException.notFound("Câu hỏi không tồn tại"));
        question.setContent(request.content());
        question.setOptions(request.options());

        switch (question.getQuestionType()) {
            case "CONTENT" -> question.setCorrectOption(request.correctOption());
            case "VOCABULARY" -> {
                if (request.correctAnswerText() == null || request.correctAnswerText().isBlank()) {
                    throw ApiException.validation("Vui lòng nhập đáp án đúng.");
                }
                question.setCorrectAnswerText(request.correctAnswerText());
            }
            case "SEQUENCE" -> {
                List<Integer> order = request.correctOrder();
                if (order == null || order.size() != 4 || !Set.copyOf(order).equals(Set.of(0, 1, 2, 3))) {
                    throw ApiException.validation("Mỗi vị trí 1-4 phải được chọn đúng một lần.");
                }
                question.setCorrectOrder(order);
            }
            default -> { }
        }

        return toDto(questionRepository.save(question));
    }

    private AdminQuestionDto toDto(Question q) {
        return new AdminQuestionDto(
                q.getId(),
                q.getQuiz().getId(),
                q.getContent(),
                q.getOptions(),
                q.getCorrectOption(),
                q.getCorrectAnswerText(),
                q.getCorrectOrder(),
                q.getOrderIndex(),
                q.getQuestionType()
        );
    }
}
