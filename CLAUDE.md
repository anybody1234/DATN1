# NihongoFlow — Japanese Learning Platform

Online Japanese learning platform through video lessons with integrated quizzes.
Bachelor's thesis — HUST SOICT, Semester 2025.2.

**Student:** Phan Hoàng Long (20225738) · **Supervisor:** Trịnh Anh Phúc · **Timeline:** 27/02/2026–28/06/2026

## Quy trình theo lệnh "cập nhật"

> **Chỉ thực hiện khi người dùng nói "cập nhật"** — không tự động chạy sau mỗi lần thay đổi code.
>
> **QUAN TRỌNG: Test, fix và review là toàn bộ codebase, KHÔNG phải chỉ phần vừa thay đổi.**

### Bước 1 — Test toàn bộ hệ thống

Kiểm tra **tất cả** các luồng chính:

1. **Backend** → `mvn compile`, đảm bảo không có lỗi compile
2. **Frontend** → `npx tsc -b`, đảm bảo không có TypeScript error (**không dùng** `npx tsc --noEmit` — `tsconfig.json` gốc dùng project references với `files: []`, nên `tsc --noEmit` chạy trực tiếp sẽ check 0 file và luôn "pass" giả; phải dùng `-b` để resolve references và thực sự type-check `src/`)

### Bước 2 — QA scan + tự fix (agent `qa-tester`)

Chạy `qa-tester` agent để **scan toàn bộ codebase**:

```
Mục tiêu: tìm bug tiềm ẩn, logic sai, security issue, performance bottleneck,
bad practices, memory leak, race condition, API issue, frontend state issue,
duplicate logic, dead code, scalability issue — trên TOÀN BỘ codebase.

Yêu cầu:
- Đọc và phân tích TẤT CẢ file backend và frontend (không bỏ sót file nào)
- Liệt kê vấn đề theo mức độ nghiêm trọng (CRITICAL → HIGH → MEDIUM → LOW)
- Giải thích nguyên nhân gốc rễ
- Đề xuất cách sửa cụ thể
- KHÔNG rewrite toàn bộ
- Ưu tiên bug nghiêm trọng trước
```

Sau khi có báo cáo → **tự fix tất cả issues** theo thứ tự severity, không hỏi lại người dùng.
Sau khi fix xong → chạy lại `mvn compile` và `npx tsc -b` để xác nhận không có lỗi mới.

### Bước 3 — Code Review + tự fix (agent `code-reviewer`)

Chạy `code-reviewer` agent để **review toàn bộ codebase**:

```
Đọc và review TẤT CẢ file theo các nguyên tắc:
- SOLID, DRY, KISS
- Single Responsibility Principle
- Tên biến/hàm rõ ràng, function nhỏ và rõ nghĩa
- Tách layer rõ ràng (Page → hooks → lib)
- Không dead code, không unused imports
- Không magic numbers/strings
- Không inline style với hardcoded hex color (dùng CSS variable)
- useCallback, useEffect cleanup đúng chuẩn
- Query keys nhất quán (không mix string/number)
- Tách business logic khỏi UI
- Ưu tiên readability hơn clever code
```

Sau khi có báo cáo → **tự fix tất cả violations**, không bỏ qua dù là LOW severity.
Sau khi fix xong → chạy lại `mvn compile` và `npx tsc -b` để xác nhận sạch.

### Bước 4 — Báo cáo tóm tắt

Sau khi hoàn tất tất cả bước trên, báo cáo ngắn gọn:

- Số issues đã fix (CRITICAL / HIGH / MEDIUM / LOW)
- Các file đã thay đổi
- Kết quả compile cuối cùng

---

## Code Quality Rules

Các nguyên tắc này **bắt buộc** áp dụng cho mọi code mới. Đây là chuẩn đã được refactor và review trong dự án.

### Frontend (TypeScript / React)

#### Tách layer rõ ràng — Single Responsibility

| Layer                             | Trách nhiệm                                      | KHÔNG được làm                                                      |
| --------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| **Page component**                | Render UI, đọc data từ hooks, xử lý navigation   | Gọi `api` trực tiếp, chứa `useQuery`/`useMutation` inline           |
| **Custom hook** (`src/hooks/`)    | Fetch data, mutation, cache invalidation         | Render JSX, chứa state UI (loading spinner state, modal open state) |
| **Lib util** (`src/lib/`)         | Pure functions, constants, external API wrappers | React hooks, side effects                                           |
| **Component** (`src/components/`) | UI có thể tái sử dụng                            | Gọi `api` trực tiếp, business logic phức tạp                        |

#### Quy tắc Custom Hooks

- **Mọi `useQuery`/`useMutation` phải nằm trong `src/hooks/`** — không inline trong component hay page
- Đặt tên hook theo domain: `useCourse`, `useLesson`, `useQuiz`, `useDashboard`
- Hook xử lý toàn bộ `onSuccess` invalidation; component xử lý UI state qua `mutate(data, { onSuccess })`
- File hiện có: `useLogout`, `useBootstrapAuth`, `useCourse`, `useLesson`, `useQuiz`, `useDashboard`, `useAdminCourse`, `useAdminLesson`, `useAdminQuiz`, `usePayment`

#### Quy tắc Query Keys

- **Dùng string nhất quán** — không mix `Number(id)` và `id` trong cùng một key
- `["course", courseId]` — luôn string, không ép kiểu Number
- `["lesson", Number(lessonId)]` — luôn Number (vì lessonId param từ URL là string nhưng key dùng number)
- Query key phải bao gồm tất cả param ảnh hưởng đến data: `["recent-attempts", size]` không phải `["recent-attempts"]`
- Magic string query keys → tập trung vào hook file tương ứng, không rải rác

#### DRY — Không lặp code

- **Constants dùng chung**: `QUESTION_SECTION_ORDER`, `QUESTION_SECTION_META` → `src/lib/quiz-constants.ts` (`QUESTION_SECTION_LABELS` đã xóa — dùng `QUESTION_SECTION_META[type].label`)
- **Logout logic**: dùng `useLogout(redirectTo)` — không viết lại `handleLogout` trong từng component
- **YouTube utils**: `isYouTube`, `toEmbedUrl`, `extractYouTubeId`, `detectDuration` → `src/lib/youtube.ts`
- **Format helpers**: `formatDuration` (student UI: `1:05`), `formatDurationLong` (admin: `1m 05s`) → `src/lib/utils.ts`

#### KISS — Ưu tiên đơn giản, dễ đọc

- Dùng `cn()` từ `lib/utils` thay vì template literal cho conditional class
- Gộp import từ cùng một module: `import { formatDate, cn } from "@/lib/utils"` không phải 2 dòng riêng
- `const DELAY_MS = 1500` thay vì magic number `setTimeout(..., 1500)`
- `useCallback` cho hàm truyền qua props hoặc trả từ hook để tránh re-render không cần thiết

#### Cleanup & Side Effects

- `setTimeout` trong `useEffect` → luôn `return () => clearTimeout(id)` để tránh memory leak
- Ref reset khi dependency thay đổi: `useEffect(() => { ref.current = false; }, [lessonId])`
- `useLogout` trả `useCallback` — stable reference giữa renders

#### CSS / Styling

- Dùng CSS `line-clamp-1` thay vì JS `.slice(0, N) + "..."` — tránh cắt giữa ký tự đa byte (tiếng Việt/Nhật)
- Không dùng template literal để nối Tailwind class — dùng `cn()`
- Inline `style={{ background: "var(--bg)" }}` lặp nhiều lần → đặt vào `globals.css` class

### Frontend — Cấu trúc thư mục chuẩn

```
src/
├── components/          # UI components tái sử dụng
│   ├── ui/              # shadcn base (Button, Badge, Input)
│   ├── VideoPlayer.tsx  # Component độc lập, có thể test riêng
│   ├── quiz/            # Quiz wizard 3 trang (Vocabulary/Content/Sequence) + ExampleCard, ResultModal
│   ├── AuthRoute.tsx    # Route guard — tách file riêng
│   ├── ProtectedRoute.tsx
│   ├── AdminRoute.tsx
│   ├── Navbar.tsx
│   ├── Layout.tsx
│   └── AdminLayout.tsx
├── hooks/               # Tất cả data fetching logic
│   ├── useBootstrapAuth.ts
│   ├── useLogout.ts
│   ├── useCourse.ts     # useCourse, useEnrollment, useCourseLessons, useEnrollMutation, useLevels, useAllCourses
│   ├── useLesson.ts     # useLessonDetail, useProgressMutation
│   ├── useQuiz.ts       # useQuiz, useSubmitQuiz
│   ├── useDashboard.ts  # useStreak, useMyCourses, useRecentAttempts, useAttemptReview
│   ├── useAdminCourse.ts
│   ├── useAdminLesson.ts
│   ├── useAdminQuiz.ts  # useAdminQuiz, useUpdateQuestionMutation
│   └── usePayment.ts    # useCreatePaymentMutation
├── lib/
│   ├── axios.ts         # Singleton api instance + interceptors
│   ├── utils.ts         # cn, formatDuration, formatDurationLong, formatDate
│   ├── youtube.ts       # isYouTube, toEmbedUrl, extractYouTubeId, detectDuration
│   ├── quiz-constants.ts # QUESTION_SECTION_ORDER/LABELS/META
│   └── auth-styles.ts   # CSSProperties cho auth pages
├── pages/
│   ├── admin/           # AdminCoursesPage, AdminLessonsPage, AdminQuizPage
│   ├── PaymentResultPage.tsx
│   └── *.tsx            # Page-level components — chỉ render + gọi hooks
├── store/
│   └── authStore.ts     # Zustand: user + accessToken (token không persist)
└── types/
    └── index.ts         # Tất cả TypeScript interfaces
```

### Backend (Java / Spring Boot)

Chuẩn đã được thiết lập — chỉ cần duy trì:

- **Controller** → chỉ HTTP mapping + `@Valid` input validation, không có business logic
- **Service** → toàn bộ business logic, gọi repository và các service khác
- **Repository** → JPA query only, không có logic
- **DTO** → mọi response/request đều qua DTO, không expose entity
- **Exception** → dùng `ApiException` factory methods (`notFound`, `unauthorized`, `forbidden`...)
- **Streak** → dùng `ChronoUnit.DAYS.between()` (calendar day), không dùng Duration.toHours()

---

## Rules Index

Detailed rules live in `.claude/rules/`:

| File                                                       | Covers                                                     |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| [`project-overview.md`](.claude/rules/project-overview.md) | Repo structure, dev setup, env vars, constraints           |
| [`tech-stack.md`](.claude/rules/tech-stack.md)             | Framework, library, and infra choices                      |
| [`data-model.md`](.claude/rules/data-model.md)             | DB schema, entities, Flyway migrations, question types     |
| [`api-conventions.md`](.claude/rules/api-conventions.md)   | Response envelope, pagination, auth endpoints, error codes |
| [`code-style.md`](.claude/rules/code-style.md)             | TypeScript/React and Java/Spring Boot coding standards     |
| [`design-system.md`](.claude/rules/design-system.md)       | Color tokens, typography, spacing, component conventions   |
| [`features.md`](.claude/rules/features.md)                 | Video player, quiz, progress tracking, streak behavior     |
| [`working-process.md`](.claude/rules/working-process.md)   | Screenshot rule after UI changes, UX checklist             |

## Implementation Status

### Đã hoàn thành

#### Backend

- Auth: register, login, refresh token, logout (JWT + httpOnly cookie)
- Levels, Courses, Lessons CRUD
- Quiz submit, scoring, attempt history
- Progress tracking (`UserLessonProgress` — watchedSeconds + completed)
- Streak logic (server-side, calendar-day based)
- **Enrollment system** — `POST /courses/:id/enroll`, `GET /courses/:id/enrollment`; dashboard chỉ hiển thị khóa đã đăng ký
- **AttemptReview** — `GET /users/me/quiz-attempts/:id` trả đầy đủ câu hỏi + đáp án đúng/sai
- `QuizAttemptDto` có `lessonTitle`, `lessonId`, `courseId` cho dashboard
- **Admin Course CRUD** — `GET/POST/PUT/DELETE/PATCH /api/v1/admin/courses` (chỉ ADMIN)
- **Course hidden field** — admin có thể ẩn/hiện khóa học; student chỉ thấy khóa chưa ẩn
- **Admin Lesson CRUD** — `GET/POST /api/v1/admin/courses/:id/lessons`, `PUT/DELETE /api/v1/admin/lessons/:id`
- **Phân quyền đầy đủ (Hướng A)** — ADMIN và STUDENT hoàn toàn tách biệt:
  - `/api/v1/admin/**` → chỉ ADMIN
  - Enroll, progress, quiz attempts, `/users/me/**` → chỉ STUDENT
  - Lesson/quiz access → STUDENT phải enroll; ADMIN bypass
- Flyway V1 (schema) + V2 (question fields) + V3 (enrollment) + V4 (course hidden) + V5 (cascade delete lessons) + V6 (indexes) + V7 (price + payments table) + V9 (question answer types: `correct_answer_text`, `correct_order` cho CONTENT/SEQUENCE) + V10 (đổi vai trò VOCABULARY ↔ CONTENT, backfill `correct_answer_text` cho VOCABULARY)
- **3 loại câu hỏi với cách chấm khác nhau** — VOCABULARY (điền từ, trim + không phân biệt hoa/thường), CONTENT (trắc nghiệm), SEQUENCE (click theo thứ tự, exact-match toàn bộ chuỗi); `QuizAttempt.answers`/`QuizAttemptRequest.answers` đổi sang `Map<Long, Object>`; `QuizService.validateAnswers`/`isCorrect` switch theo `questionType`
- **Đổi vai trò VOCABULARY ↔ CONTENT (V10)** — VOCABULARY (từ vựng) trả lời bằng tự luận vì học viên thấy gõ từ vựng dễ hơn; CONTENT (nội dung video) chuyển sang trắc nghiệm vì câu hỏi hiểu nội dung có nhiều cách diễn đạt, gõ tự do dễ sai oan. Nhờ swap này, dữ liệu seed gốc (`options`/`correct_option` từ V1) trở thành dữ liệu hợp lệ cho cả 2 loại — không còn placeholder cho VOCABULARY/CONTENT
- **CẢNH BÁO**: 72 câu SEQUENCE trong seed data vẫn chỉ có `correct_order` là **placeholder hợp lệ về kiểu** (`[0,1,2,3]` đồng nhất) — admin cần rà soát + sắp đúng thứ tự thật qua AdminQuizPage
- **Security hardening** — JWT secret không còn fallback mặc định (throw `IllegalStateException` khi thiếu config)
- **Quiz validation** — `validateAnswers` dùng symmetric `ids.equals(questionIds)` thay vì `containsAll` một chiều
- **LevelService N+1 fix** — batch query `countGroupByLevel()`, giảm từ N+1 xuống 1 query
- **Hidden course bypass fix** — `getCourse` và `getLessons` kiểm tra `isHidden` cho STUDENT
- **watchedSeconds validation** — thêm `@Max(86400)` trong `LessonProgressRequest`
- **Admin Quiz Management API** — `GET /api/v1/admin/lessons/:id/quiz` (trả câu hỏi kèm `correctOption`), `PUT /api/v1/admin/questions/:id` (sửa nội dung + đáp án); `AdminQuizService`, `AdminQuizController`, `AdminQuestionDto`, `AdminQuizDto`, `QuestionRequest`
- **Course price field** — `courses.price` (BIGINT, default 0 = miễn phí); `CourseDto` và `CourseRequest` thêm `price`; admin đặt giá khi tạo/sửa khóa học
- **VNPay payment integration** — `POST /api/v1/payments/create` (tạo giao dịch, trả URL redirect), `GET /api/v1/payments/vnpay-return` (callback từ VNPay, verify HMAC-SHA512, enroll user, redirect về frontend); `VnpayService`, `PaymentService`, `PaymentController`, `PaymentRepository`, `Payment` entity; sandbox credentials trong `application.yml`

#### Frontend

- Auth flow: login, register, logout, auto-refresh on reload (bootstrap effect)
- `AuthRoute` chặn user đã đăng nhập vào `/dang-nhap`
- `ProtectedRoute`: student route guard; admin bị redirect sang `/admin/khoa-hoc`
- **Video flow**: xem hết video (`ended` event) → tự chuyển sang QuizPage (lần đầu); xem lại tự do sau khi đã hoàn thành
- **QuizPage** tách riêng route `/bai-hoc/:id/quiz`
- **Quiz wizard 3 trang** (`src/components/quiz/`) — `VocabularyStep` → `ContentStep` → `SequenceStep`, state `answers`/`step` lift lên `QuizPage`, đáp án giữ nguyên khi back/forward:
  - VOCABULARY: điền từ (`FillInBlankQuestion`), chấm trim + không phân biệt hoa/thường
  - CONTENT: trắc nghiệm 4 đáp án (`VocabularyQuestion`)
  - SEQUENCE: click chọn theo thứ tự (`SequenceOrderQuestion`), chấm exact-match toàn bộ thứ tự click
  - Mỗi trang có `ExampleCard` hiển thị 1 câu ví dụ tĩnh (hardcode trong `lib/quiz-constants.ts`, không tính điểm) minh họa cách làm
  - Trang Sequence có nút "Nộp bài" → gửi cả 10 câu → `ResultModal` (popup score/pass, "Quay lại trang tổng quan" → `/dashboard`)
  - `QuizSection.tsx` (single-page cũ) đã bị xóa, thay bằng wizard trên
- **Dashboard**: quiz history hiển thị tên bài học, click → `AttemptReviewModal` xem lại đáp án đúng/sai theo từng loại câu hỏi (VOCABULARY/CONTENT/SEQUENCE)
- **CourseDetailPage**: nút "Đăng ký học"; chưa đăng ký → bài học bị khóa (opacity + lock icon)
- **LandingPage**: N1-N5 màu đồng đều, click card → `/khoa-hoc?level=N3` (filter sẵn)
- **CoursesPage**: đọc `?level=` từ URL, scroll to top khi đổi filter, reset filter khi không có param
- **Navbar**: full-width (logo lệch trái), `scrollbar-gutter: stable` tránh layout shift; admin không thấy nav student
- **Admin area** (`/admin/*`):
  - `AdminLayout` — layout riêng với sidebar (không dùng student Layout)
  - `AdminCoursesPage` — bảng CRUD khóa học: tạo, sửa, xóa, ẩn/hiện; nút `ListVideo` → trang bài học
  - `AdminLessonsPage` (`/admin/khoa-hoc/:courseId/bai-hoc`) — CRUD bài học trong từng khóa: tạo, sửa, xóa; detect YouTube URL
  - `AdminRoute` — chặn STUDENT, redirect ADMIN từ student routes
  - Sau login ADMIN → `/admin/khoa-hoc`; sau login STUDENT → `/dashboard`
  - `AdminQuizPage` (`/admin/khoa-hoc/:courseId/bai-hoc/:lessonId/quiz`) — hiển thị 10 câu hỏi chia 3 section (VOCABULARY/CONTENT/SEQUENCE), mỗi câu có nút edit → modal sửa nội dung + 4 đáp án + chọn đáp án đúng; nút `ClipboardList` trên `AdminLessonsPage` navigate sang
- **Thanh toán VNPay** — `CourseDetailPage` hiển thị giá; khóa có giá → nút "Mua khoá học" → `useCreatePaymentMutation` → `window.location.href = paymentUrl`; sau thanh toán → `PaymentResultPage` (`/thanh-toan/ket-qua`) hiển thị thành công/thất bại + nút "Vào học ngay"; khóa miễn phí vẫn dùng enrollment trực tiếp
- **VideoPlayer — chỉ YouTube** (`YouTubeCustomPlayer`): MP4Player đã xóa hoàn toàn; toàn bộ video phải là YouTube URL
- **YouTube IFrame API custom player**: `controls:0`, custom overlay (play/pause/seek/mute/fullscreen), `onStateChange` ENDED event tự navigate sang quiz — không còn nút "Đã xem xong"
- **Tự động đọc thời lượng video**: khi admin dán YouTube URL rồi blur → IFrame API ẩn đọc `getDuration()` → tự điền; hiện spinner + "✓ Tự động" khi xong
- **Enrollment guard** trên `LessonPage` và `QuizPage`: chưa enroll → redirect về course detail
- **QuizPage hooks fix** — tất cả `useState`/`useEffect` đặt trước guard `if (!courseId || !lessonId)`
- **YouTube API polling timeout** — giới hạn 10s polling (100 lần × 100ms), tránh setInterval leak vĩnh viễn
- **Code quality fixes** — xóa `QUESTION_SECTION_LABELS` duplicate; Button hover dùng `--acc-hover` CSS variable; MockCards macOS dots dùng constants; VideoPlayer gradient dùng `.yt-controls-gradient` class; `formatDurationLong` đổi sang `seconds <= 0`; LandingPage stats sửa thành đúng số liệu thực (10 khoá, 24 bài giảng)

#### Data / DevOps

- Seed data đầy đủ: 5 levels (N5→N1), 10 courses, 24 lessons, 24 quizzes, 240 questions
- Video URLs: `media.w3.org` public MP4 (dev placeholder — admin có thể thay bằng YouTube URL qua AdminLessonsPage)
- Quiz structure: 4 VOCABULARY + 3 CONTENT + 3 SEQUENCE mỗi quiz
- Pass score: N5-N3 = 70%, N2 = 75%, N1 = 80%
- Seed phải chạy bằng `cmd /c` (không dùng PowerShell pipe — lỗi encoding UTF-8)

---

### Chưa làm / Bước tiếp theo

#### Admin (ưu tiên cao — session tiếp theo)

- [x] **YouTube IFrame API custom player** — `YouTubeCustomPlayer` với custom controls hoàn chỉnh; ENDED event tự navigate quiz; không còn nút "Đã xem xong"; MP4Player đã xóa
- [x] **Admin Lesson CRUD** — `AdminLessonsPage` tại `/admin/khoa-hoc/:courseId/bai-hoc`; tự động đọc thời lượng từ URL
- [x] **Admin Quiz Management** — `AdminQuizPage` xem/sửa 10 câu hỏi chia 3 section; modal edit từng câu (nội dung + 4 đáp án + chọn đáp án đúng)
- [ ] **Drag & drop ordering** — kéo thả thứ tự bài học (`@dnd-kit/sortable`); gọi `PATCH /admin/lessons/:id/order`
- [ ] **Thumbnail** — hiện nhập URL text là đủ cho thesis; không cần upload

#### Student

- [ ] Phân trang quiz attempts trong dashboard
- [ ] Responsive mobile (hiện desktop-first)

#### Hạ tầng — KHÔNG làm cho thesis

- ~~Cloudinary~~ — **đã quyết định không dùng** (xem lý do bên dưới)
- ~~Cloudflare Stream~~ — **đã quyết định không dùng**
- ~~hls.js~~ — không cần nếu dùng YouTube embed

---

### Quyết định quan trọng

| Quyết định                                        | Lý do                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hướng A: ADMIN và STUDENT hoàn toàn tách biệt** | Admin không cần trải nghiệm học thử; tách bạch giúp logic rõ ràng hơn, dễ maintain. Ngược lại Hướng B (admin = super student) phức tạp hơn và không cần thiết với scope thesis.                                                                                                                                                                           |
| **Video phải xem hết (`ended`) mới mở quiz**      | Yêu cầu từ người dùng — đảm bảo học viên không bỏ qua nội dung. Trước đó dùng 80% nhưng đã đổi.                                                                                                                                                                                                                                                           |
| **Xem lại video tự do sau khi hoàn thành**        | UX: học viên có thể ôn lại mà không bị redirect vào quiz lần 2. `wasCompletedRef` track trạng thái ban đầu để phân biệt lần đầu và xem lại.                                                                                                                                                                                                               |
| **Quiz là trang riêng (`/bai-hoc/:id/quiz`)**     | Tách video và quiz ra 2 URL riêng để có thể bookmark, deep-link, và quản lý navigation rõ ràng hơn.                                                                                                                                                                                                                                                       |
| **Enrollment bắt buộc trước khi học**             | Chuẩn business logic: student phải chủ động đăng ký → dashboard chỉ hiện khóa đang học → số liệu có ý nghĩa hơn.                                                                                                                                                                                                                                          |
| **YouTube embed thay vì Cloudinary/Cloudflare**   | Đồ án tốt nghiệp được đánh giá theo tính năng hệ thống, không theo hạ tầng lưu trữ. YouTube miễn phí, không cần credentials, hoạt động ngay, có sẵn video tiếng Nhật chất lượng cao. Tiết kiệm 1–2 session để làm Admin Lesson CRUD và Quiz Management — quan trọng hơn với hội đồng.                                                                     |
| **Tạo admin bằng UPDATE trực tiếp vào DB**        | `register` API luôn gán role=STUDENT. Cách tạo admin: đăng ký thường → chạy `& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u nihongo -p123456 nihongoflow -e "UPDATE users SET role='ADMIN' WHERE email='...'"` (mysql.exe nằm ở Program Files, không có trong PATH mặc định).                                                               |
| **ON DELETE CASCADE qua Flyway V5**               | Xóa lesson phải dọn sạch quiz, questions, quiz_attempts, user_lesson_progress. Giải pháp sạch nhất là thêm CASCADE ở DB level thay vì xử lý thủ công trong service.                                                                                                                                                                                       |
| **Seed chạy bằng `cmd /c`**                       | PowerShell pipe (`\|`) gây lỗi encoding UTF-8 với ký tự tiếng Việt/Nhật → dùng `cmd /c "mysql ... < file.sql"` để đảm bảo đúng charset.                                                                                                                                                                                                                   |
| **VideoPlayer chỉ hỗ trợ YouTube**                | MP4Player bị xóa hoàn toàn. Tất cả video trong hệ thống phải là YouTube URL. Admin nhập YouTube URL → admin form detect tự động → IFrame API đọc duration. Không cần hỗ trợ MP4 trực tiếp cho thesis.                                                                                                                                                     |
| **YouTube IFrame API thay vì iframe thô**         | iframe thô cần nút "Đã xem xong" thủ công vì không có event. IFrame API cho phép bắt `onStateChange` ENDED → tự navigate quiz, tự save progress, hoàn toàn custom controls. Trải nghiệm tốt hơn, logic đúng hơn.                                                                                                                                          |
| **VNPay sandbox cho thanh toán**                  | TMN Code `76FLQ5YR`, Hash Secret `899P0KKH8KO1XUFD92BMGXRKJMRNKSTG` (sandbox only). Return URL backend: `http://localhost:8080/api/v1/payments/vnpay-return` — backend xử lý verify hash rồi redirect về frontend `/thanh-toan/ket-qua`. Khóa miễn phí (price=0) vẫn enroll trực tiếp không qua VNPay.                                                    |
| **Admin Quiz chỉ sửa, không thêm/xóa câu**        | Cấu trúc 10 câu cố định (4 VOCABULARY + 3 CONTENT + 3 SEQUENCE) được seed sẵn. Admin chỉ cần sửa nội dung câu hỏi và đáp án — không cần thêm/xóa vì structure đã đúng. Đơn giản hơn, đủ dùng cho thesis.                                                                                                                                                  |
| **Đổi vai trò VOCABULARY ↔ CONTENT (V10)**        | Học viên phản hồi gõ tự luận cho câu hỏi nội dung (CONTENT) khá khó vì có nhiều cách diễn đạt đúng. Đổi: VOCABULARY (từ vựng, đáp án ngắn/chắc chắn) → tự luận; CONTENT (hiểu nội dung video) → trắc nghiệm. Nhờ vậy dữ liệu seed gốc (`options`/`correct_option`) vẫn dùng được nguyên, chỉ cần migration backfill `correct_answer_text` cho VOCABULARY. |
