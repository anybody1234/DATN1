---
description: Behavior specifications for video player, quiz system, progress tracking, and streak/gamification
alwaysApply: false
globs:
  - "frontend/**/features/**"
  - "backend/**/service/**"
  - "backend/**/controller/**"
---

# Feature Specifications

## Video Player

- Video URL stored in `lessons.video_url` (MP4 for dev, Cloudinary HLS `.m3u8` for production)
- Auto-save watch position every **10 seconds** (debounced — only saves when delta ≥ 5 seconds)
- Resume from last saved position on re-open (`lesson.watchedSeconds`)
- A lesson is marked **complete** when:
  - **First time:** user watches the video to the **very end** (`ended` event) → auto-navigate to quiz page
  - **Or:** user passes the lesson quiz
- After quiz is completed, user **can rewatch** the video freely — no forced redirect to quiz
- Video error → show Vietnamese message "Không thể tải video. Vui lòng thử lại sau."
- Empty `videoUrl` → show placeholder "Video đang được cập nhật. Vui lòng quay lại sau."

### Routes

- `/khoa-hoc/:courseId/bai-hoc/:lessonId` — Video page (LessonPage)
- `/khoa-hoc/:courseId/bai-hoc/:lessonId/quiz` — Quiz page (QuizPage, separate from video)

### Completion Flow

```
Video page → watch to end (ended event) → save progress → navigate to QuizPage
                                                           (only on first watch)
QuizPage → submit quiz → result popup modal → "Về tổng quan" → /dashboard
```

## Quiz System

- Questions per quiz: exactly **10 questions**, mandatory structure:
  - `order_index` 1–4 : **VOCABULARY** (4 câu từ vựng liên quan video — điền từ)
  - `order_index` 5–7 : **CONTENT** (3 câu về nội dung video — trắc nghiệm)
  - `order_index` 8–10: **SEQUENCE** (3 câu về trình tự sự kiện)
- Pass threshold: **70%** N5-N3, **75%** N2, **80%** N1 (configurable per `Quiz.passScore`)
- DB schema: `questions` table has `order_index INT`, `question_type VARCHAR(20)` (V2), `correct_answer_text VARCHAR(255)`, `correct_order JSON` (V9)
- After submission: **popup modal** (`ResultModal`) shows score (passed/failed) immediately
- Closing modal → navigate to `/dashboard`
- Retries: unlimited — each attempt is a new `QuizAttempt` row
- Never delete past attempts — all history must be preserved

### Question Types & Grading

| Type           | UI                                                                                                                | Answer shape (`AnswerValue`)                        | Grading                                                            |
| -------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| **VOCABULARY** | Điền từ (`FillInBlankQuestion`, `<input type="text">`)                                                            | `string`                                            | So khớp `correctAnswerText`, **trim + không phân biệt hoa/thường** |
| **CONTENT**    | Trắc nghiệm 4 đáp án (`VocabularyQuestion`)                                                                       | `number` (0-3, chỉ số đáp án)                       | `selected === correctOption`                                       |
| **SEQUENCE**   | Click chọn theo thứ tự (`SequenceOrderQuestion`) — click 1 item = gán vị trí tiếp theo (1→4); click lại = bỏ chọn | `number[]` (mảng index theo thứ tự click, length 4) | So khớp toàn bộ mảng với `correctOrder` (exact sequence match)     |

- `QuizAttempt.answers` / `QuizAttemptRequest.answers`: `Map<Long, Object>` (backend) ↔ `Record<string, AnswerValue>` (frontend) — value type tùy theo `questionType`
- Backend validation (`QuizService.validateAnswers`): kiểm tra type của từng answer theo `questionType`; SEQUENCE phải là permutation của `{0,1,2,3}`

### Quiz Wizard — 3 trang (`frontend/src/components/quiz/`)

Sau khi xem hết video → flow 3 trang, đáp án giữ nguyên khi back/forward (state `answers`/`step` lift lên `QuizPage`):

```
VocabularyStep (4 câu VOCABULARY — điền từ)
   "Tiếp theo" (phải, disable nếu chưa trả lời hết)
        ↓
ContentStep (3 câu CONTENT — trắc nghiệm)
   "Quay lại" (trái) / "Tiếp theo" (phải, disable nếu còn ô trống)
        ↓
SequenceStep (3 câu SEQUENCE — click sắp xếp)
   "Quay lại" (trái) / "Nộp bài" (phải, disable nếu chưa sắp xếp đủ)
        → submit cả 10 câu 1 lần → ResultModal
```

- **Mỗi trang có 1 câu "Ví dụ minh họa" tĩnh ở đầu** (`ExampleCard` + `EXAMPLE_QUESTIONS` trong `lib/quiz-constants.ts`) — hardcode trong frontend, không từ DB, không tính điểm, chỉ minh họa cách làm cho từng loại câu hỏi
- Components: `VocabularyQuestion`, `FillInBlankQuestion`, `SequenceOrderQuestion`, `ExampleCard`, `ResultModal`, `VocabularyStep`, `ContentStep`, `SequenceStep` — tất cả trong `frontend/src/components/quiz/`
- `QuizSection.tsx` (single-page, single-submit UI cũ) đã bị xóa, thay bằng wizard trên

### Seed Data — CẦN ADMIN RÀ SOÁT

- Sau khi đổi vai trò VOCABULARY ↔ CONTENT (V10): VOCABULARY (điền từ) và CONTENT (trắc nghiệm) đều dùng `options`/`correct_option` gốc từ V1 — **dữ liệu seed hợp lệ, không phải placeholder**, không cần admin sửa
- Riêng **SEQUENCE** vẫn chỉ có placeholder hợp lệ về kiểu dữ liệu (`correct_order` = `[0,1,2,3]`, thứ tự đồng nhất, không phải thứ tự đúng thật) — admin **phải** vào `AdminQuizPage` sắp đúng thứ tự cho 72 câu SEQUENCE trước khi dùng thật

### Quiz Result Popup

- Overlay modal with blur background
- Shows: icon (✓/✗), score %, pass threshold, "Về tổng quan" button
- If failed: also shows "Làm lại" button (resets quiz form)
- "Về tổng quan" → navigate to `/dashboard`

## Progress Tracking

- `UserLessonProgress` tracks completion status + `watchedSeconds` per lesson
- Per-course completion = `completedLessons / totalLessons` (percentage)
- Dashboard shows:
  - Per-course progress bar
  - Quiz attempt history: lesson title + score + date + clickable to review
- Clicking a quiz attempt in dashboard → opens **AttemptReviewModal**:
  - Fetches `GET /api/v1/users/me/quiz-attempts/:id`
  - Shows all 10 questions grouped by section (VOCABULARY / CONTENT / SEQUENCE)
  - Highlights correct answers (green) and wrong selected answers (red)

## Streak / Gamification

- Streak increments when user completes **at least 1 lesson** in a calendar day
- Streak resets to **0** if no qualifying activity for **24+ hours**
- Store: `UserStreak.currentStreak`, `UserStreak.longestStreak`, `UserStreak.lastActivityDate`
- Display both current streak and all-time longest streak on dashboard
- Streak update logic runs server-side at lesson completion — never trust client timestamps

## Content Access Control

- STUDENT: read-only access to content; write access only to own progress/attempts
- ADMIN: full CRUD on Levels, Courses, Lessons, Quizzes, Questions
- Lesson order within a course is enforced by the `order` field — do not skip levels

## Seed Data (Development)

- 5 levels: N5 → N1 (ordered 1–5)
- 10 courses: 2 per level
- 24 lessons: 2–3 per course
- 24 quizzes: 1 per lesson, 10 questions each (240 total)
- Video URLs: `media.w3.org` public MP4s (dev placeholder — replace with Cloudinary for production)
- Run: `cmd /c "mysql.exe -u nihongo -p123456 nihongoflow < seed-data.sql"` (use cmd /c, not PowerShell pipe)
