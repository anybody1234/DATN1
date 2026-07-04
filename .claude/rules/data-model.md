---
description: Database schema, content hierarchy, core entities, and user roles for NihongoFlow
alwaysApply: false
globs:
  - "backend/**/entity/**"
  - "backend/**/repository/**"
  - "backend/**/dto/**"
  - "backend/**/service/**"
---

# Data Model

## Content Hierarchy

```
Level (N5, N4, N3, N2, N1)
  └── Course  (e.g., "Giao tiếp cơ bản N5")
        └── Lesson  (video + description)
              └── Quiz  (multiple-choice questions)
```

## Core Entities

| Entity                   | Key Fields                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **User**                 | id, email, password (bcrypt), role (STUDENT/ADMIN), createdAt                                                                                    |
| **Level**                | id, name (N5–N1), description, order                                                                                                             |
| **Course**               | id, levelId, title, description, thumbnailUrl, order                                                                                             |
| **Lesson**               | id, courseId, title, videoUrl (Cloudinary), duration, order                                                                                      |
| **Quiz**                 | id, lessonId, passScore (default 70%)                                                                                                            |
| **Question**             | id, quizId, content, options (JSON array), correctOption, **orderIndex**, **questionType**, **correctAnswerText**, **correctOrder** (JSON array) |
| **UserCourseEnrollment** | userId, courseId, enrolledAt — PK composite (userId, courseId)                                                                                   |
| **UserLessonProgress**   | userId, lessonId, completed (bool), watchedSeconds                                                                                               |
| **QuizAttempt**          | id, userId, quizId, score, answers (JSON), attemptedAt, passed                                                                                   |
| **UserStreak**           | userId, currentStreak, longestStreak, lastActivityDate                                                                                           |

## Flyway Migrations

| Version | File                                            | Nội dung                                                                                                 |
| ------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| V1      | `V1__init.sql`                                  | Schema gốc — tất cả bảng cơ bản                                                                          |
| V2      | `V2__add_question_fields.sql`                   | Thêm `order_index`, `question_type` vào `questions`                                                      |
| V3      | `V3__add_course_enrollment.sql`                 | Tạo bảng `user_course_enrollments`                                                                       |
| V9      | `V9__add_question_answer_types.sql`             | Thêm `correct_answer_text`, `correct_order` vào `questions` (đáp án CONTENT/SEQUENCE)                    |
| V10     | `V10__swap_vocabulary_content_answer_types.sql` | Backfill `correct_answer_text` cho VOCABULARY (đổi vai trò: VOCABULARY → điền từ, CONTENT → trắc nghiệm) |

## Question Type Structure

Mỗi quiz có **đúng 10 câu**, chia 3 nhóm bắt buộc:

| orderIndex | questionType | Số câu |
| ---------- | ------------ | ------ |
| 1–4        | `VOCABULARY` | 4      |
| 5–7        | `CONTENT`    | 3      |
| 8–10       | `SEQUENCE`   | 3      |

## User Roles

### STUDENT

- Register, log in
- Đăng ký khóa học (`UserCourseEnrollment`) — phải đăng ký mới được xem bài học
- Browse Levels → Courses → Lessons (chỉ xem được bài trong khóa đã đăng ký)
- Watch videos with progress tracking
- Take quizzes after each lesson (unlimited retries)
- View personal quiz history and scores (with AttemptReview)
- Track daily learning streak

### ADMIN

- All STUDENT permissions
- Create / edit / delete Levels, Courses, Lessons
- Upload videos to Cloudinary
- Create / edit quiz questions
- View all users and their progress

## Notes

- `options` in Question is a JSON array of 4 strings
- `answers` in QuizAttempt is a JSON map of `questionId → answer`, where answer type depends on `questionType`:
  `VOCABULARY` → string (điền từ), `CONTENT` → number (0-3, trắc nghiệm), `SEQUENCE` → number[] (thứ tự click)
- `order` fields are 1-based integers used to sequence content
- `questionType` values: `'VOCABULARY'`, `'CONTENT'`, `'SEQUENCE'`
- `correctAnswerText` chỉ dùng cho `VOCABULARY`; `correctOrder` (JSON array index 0-3) chỉ dùng cho `SEQUENCE`; `correctOption` dùng cho `CONTENT`
- Never expose entity classes directly in API responses — always use DTOs
- Run seed: `cmd /c "mysql.exe -u nihongo -p123456 nihongoflow < seed-data.sql"` (dùng cmd /c, không dùng PowerShell pipe để tránh encoding lỗi)
