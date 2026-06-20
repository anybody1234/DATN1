-- Hỗ trợ 3 loại câu hỏi với cách chấm khác nhau:
--   VOCABULARY: trắc nghiệm (dùng correct_option như cũ)
--   CONTENT: điền từ (correct_answer_text)
--   SEQUENCE: sắp xếp theo thứ tự click (correct_order)
--
-- LƯU Ý: dữ liệu CONTENT/SEQUENCE hiện có (seed) chỉ được gán giá trị PLACEHOLDER
-- để hợp lệ về kiểu dữ liệu. Admin cần rà soát và chỉnh lại nội dung thật
-- (câu có chỗ trống, đáp án điền từ, thứ tự đúng) qua AdminQuizPage.
ALTER TABLE questions
    ADD COLUMN correct_answer_text VARCHAR(255) NULL,
    ADD COLUMN correct_order JSON NULL;

-- CONTENT: placeholder = text của correct_option hiện tại
UPDATE questions
SET correct_answer_text = JSON_UNQUOTE(JSON_EXTRACT(options, CONCAT('$[', correct_option, ']')))
WHERE question_type = 'CONTENT';

-- SEQUENCE: placeholder thứ tự đồng nhất [0,1,2,3]
UPDATE questions
SET correct_order = JSON_ARRAY(0, 1, 2, 3)
WHERE question_type = 'SEQUENCE';
