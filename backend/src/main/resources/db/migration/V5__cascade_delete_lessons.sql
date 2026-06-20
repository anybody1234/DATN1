-- Thêm ON DELETE CASCADE để xóa lesson tự động dọn sạch dữ liệu liên quan
ALTER TABLE user_lesson_progress DROP FOREIGN KEY fk_progress_lesson;
ALTER TABLE user_lesson_progress ADD CONSTRAINT fk_progress_lesson
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;

ALTER TABLE questions DROP FOREIGN KEY fk_questions_quiz;
ALTER TABLE questions ADD CONSTRAINT fk_questions_quiz
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE;

ALTER TABLE quiz_attempts DROP FOREIGN KEY fk_attempts_quiz;
ALTER TABLE quiz_attempts ADD CONSTRAINT fk_attempts_quiz
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE;

ALTER TABLE quizzes DROP FOREIGN KEY fk_quizzes_lesson;
ALTER TABLE quizzes ADD CONSTRAINT fk_quizzes_lesson
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;
