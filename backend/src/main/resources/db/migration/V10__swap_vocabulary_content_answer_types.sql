-- Đổi cách trả lời giữa 2 loại câu hỏi:
--   VOCABULARY: trắc nghiệm -> điền từ (tự luận, dùng correct_answer_text)
--   CONTENT:    điền từ -> trắc nghiệm (dùng correct_option như cũ)
--
-- CONTENT đã có options/correct_option hợp lệ từ V1 nên không cần xử lý thêm.
-- VOCABULARY cần correct_answer_text — backfill bằng text của correct_option hiện tại.
UPDATE questions
SET correct_answer_text = JSON_UNQUOTE(JSON_EXTRACT(options, CONCAT('$[', correct_option, ']')))
WHERE question_type = 'VOCABULARY';
