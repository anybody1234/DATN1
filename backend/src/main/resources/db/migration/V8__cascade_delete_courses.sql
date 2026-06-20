-- Thêm ON DELETE CASCADE để xóa course tự động dọn sạch dữ liệu liên quan.
-- Thiếu CASCADE này khiến AdminCourseService.deleteCourse() ném FK constraint error
-- bất cứ khi nào course có lesson, enrollment, hoặc payment.

-- 1. courses → lessons
ALTER TABLE lessons DROP FOREIGN KEY fk_lessons_course;
ALTER TABLE lessons ADD CONSTRAINT fk_lessons_course
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- 2. courses → user_course_enrollments
ALTER TABLE user_course_enrollments DROP FOREIGN KEY fk_enrollment_course;
ALTER TABLE user_course_enrollments ADD CONSTRAINT fk_enrollment_course
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- 3. courses → payments (FK không có tên — dùng information_schema để tìm tên động)
SET @fk_payments_course = (
    SELECT CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'payments'
      AND COLUMN_NAME = 'course_id'
      AND REFERENCED_TABLE_NAME = 'courses'
);
SET @sql = CONCAT('ALTER TABLE payments DROP FOREIGN KEY `', @fk_payments_course, '`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE payments ADD CONSTRAINT fk_payments_course
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
