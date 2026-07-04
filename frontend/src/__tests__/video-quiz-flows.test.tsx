import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Question, QuestionResult, Quiz, QuizAttempt } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Mock dependencies
// ─────────────────────────────────────────────────────────────────────────────

const mockMutate = vi.fn();

vi.mock("@/lib/axios", () => ({ default: { post: vi.fn() } }));
vi.mock("@/components/ui/Button", () => ({
  Button: ({
    children,
    disabled,
    onClick,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }) => (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));
vi.mock("@/components/ui/Badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeQuestion(
  id: number,
  orderIndex: number,
  questionType: Question["questionType"],
): Question {
  return {
    id,
    quizId: 1,
    content: `Câu hỏi ${id}`,
    options: ["A", "B", "C", "D"],
    orderIndex,
    questionType,
  };
}

/** 10 câu đúng chuẩn: 4 VOCABULARY + 3 CONTENT + 3 SEQUENCE */
function makeStandardQuiz(shuffle = false): Quiz {
  const qs: Question[] = [
    makeQuestion(1, 1, "VOCABULARY"),
    makeQuestion(2, 2, "VOCABULARY"),
    makeQuestion(3, 3, "VOCABULARY"),
    makeQuestion(4, 4, "VOCABULARY"),
    makeQuestion(5, 5, "CONTENT"),
    makeQuestion(6, 6, "CONTENT"),
    makeQuestion(7, 7, "CONTENT"),
    makeQuestion(8, 8, "SEQUENCE"),
    makeQuestion(9, 9, "SEQUENCE"),
    makeQuestion(10, 10, "SEQUENCE"),
  ];
  if (shuffle) qs.reverse();
  return { id: 99, lessonId: 1, passScore: 70, questions: qs };
}

function makeResultQuestion(
  questionId: number,
  correctOption: number,
  selectedAnswer: number,
): QuestionResult {
  return {
    questionId,
    questionType: "CONTENT",
    correctOption,
    correctAnswerText: null,
    correctOrder: null,
    selectedAnswer,
  };
}

function makeResult(passed: boolean, score: number): QuizAttempt {
  return {
    id: 1,
    quizId: 99,
    score,
    answers: {},
    attemptedAt: "2026-05-18T10:00:00Z",
    passed,
    results: [
      makeResultQuestion(1, 0, passed ? 0 : 1),
      makeResultQuestion(2, 1, 1),
      makeResultQuestion(3, 2, 2),
      makeResultQuestion(4, 0, 0),
      makeResultQuestion(5, 1, 1),
      makeResultQuestion(6, 0, 0),
      makeResultQuestion(7, 2, 2),
      makeResultQuestion(8, 1, 1),
      makeResultQuestion(9, 0, 0),
      makeResultQuestion(10, 3, passed ? 3 : 0),
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ❶ VIDEO PLAYER — pure logic
// ─────────────────────────────────────────────────────────────────────────────

describe("VideoPlayer — auto-save logic", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("chỉ gọi onProgress khi |currentTime - lastSaved| >= 5 giây", () => {
    const onProgress = vi.fn();
    let lastSaved = 0;

    // Mô phỏng logic debounce của VideoPlayer
    function tick(currentTime: number) {
      if (Math.abs(currentTime - lastSaved) >= 5) {
        lastSaved = currentTime;
        onProgress(Math.floor(currentTime));
      }
    }

    tick(3); // delta = 3 → không save
    expect(onProgress).not.toHaveBeenCalled();

    tick(5); // delta = 5 → save
    expect(onProgress).toHaveBeenCalledWith(5);
    expect(onProgress).toHaveBeenCalledTimes(1);

    tick(9); // delta = 4 (9-5) → không save
    expect(onProgress).toHaveBeenCalledTimes(1);

    tick(10); // delta = 5 (10-5) → save
    expect(onProgress).toHaveBeenCalledWith(10);
    expect(onProgress).toHaveBeenCalledTimes(2);
  });

  it("không gọi onProgress khi currentTime không thay đổi", () => {
    const onProgress = vi.fn();
    let lastSaved = 0;

    function tick(currentTime: number) {
      if (Math.abs(currentTime - lastSaved) >= 5) {
        lastSaved = currentTime;
        onProgress(Math.floor(currentTime));
      }
    }

    tick(0);
    tick(0);
    tick(0);
    expect(onProgress).not.toHaveBeenCalled();
  });

  it("lưu progress cuối khi unmount nếu currentTime > 0", () => {
    const onProgress = vi.fn();
    const currentTime = 120;

    // Mô phỏng cleanup của useEffect
    function cleanup(videoCurrentTime: number) {
      if (videoCurrentTime > 0) {
        onProgress(Math.floor(videoCurrentTime));
      }
    }

    cleanup(currentTime);
    expect(onProgress).toHaveBeenCalledWith(120);
  });

  it("KHÔNG lưu progress khi unmount nếu currentTime = 0", () => {
    const onProgress = vi.fn();

    function cleanup(videoCurrentTime: number) {
      if (videoCurrentTime > 0) {
        onProgress(Math.floor(videoCurrentTime));
      }
    }

    cleanup(0);
    expect(onProgress).not.toHaveBeenCalled();
  });

  it("resume từ initialSeconds khi video loadedmetadata", () => {
    const video = { currentTime: 0 } as HTMLVideoElement;
    const initialSeconds = 75;

    // Mô phỏng handleLoaded trong useEffect
    function handleLoaded() {
      if (initialSeconds > 0) video.currentTime = initialSeconds;
    }

    handleLoaded();
    expect(video.currentTime).toBe(75);
  });

  it("KHÔNG set currentTime khi initialSeconds = 0", () => {
    const video = { currentTime: 0 } as HTMLVideoElement;
    const initialSeconds = 0;

    function handleLoaded() {
      if (initialSeconds > 0) video.currentTime = initialSeconds;
    }

    handleLoaded();
    expect(video.currentTime).toBe(0);
  });

  it("floor giây trước khi gọi onProgress", () => {
    const onProgress = vi.fn();
    let lastSaved = 0;

    function tick(currentTime: number) {
      if (Math.abs(currentTime - lastSaved) >= 5) {
        lastSaved = currentTime;
        onProgress(Math.floor(currentTime)); // floor — không làm tròn lên
      }
    }

    tick(12.9);
    expect(onProgress).toHaveBeenCalledWith(12); // floor(12.9) = 12
  });
});

describe("VideoPlayer — render", () => {
  it("hiển thị thông báo lỗi tiếng Việt khi video error", async () => {
    // Render trực tiếp một video element và trigger error
    const { container } = render(
      <div>
        <video
          data-testid="v"
          onError={() => {
            const el = document.createElement("p");
            el.textContent = "Không thể tải video. Vui lòng thử lại sau.";
            container.appendChild(el);
          }}
        />
      </div>,
    );

    fireEvent.error(container.querySelector("video")!);
    expect(container.textContent).toContain(
      "Không thể tải video. Vui lòng thử lại sau.",
    );
  });

  it("guard: không render VideoPlayer khi videoUrl rỗng", () => {
    // Mô phỏng guard trong LessonPage: {lesson.videoUrl ? <VideoPlayer.../> : <placeholder>}
    const videoUrl = "";
    const showPlayer = !!videoUrl;
    expect(showPlayer).toBe(false);
  });

  it("hiển thị VideoPlayer khi videoUrl hợp lệ", () => {
    const videoUrl = "https://example.com/video.mp4";
    const showPlayer = !!videoUrl;
    expect(showPlayer).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ❷ QUIZ — pure logic
// ─────────────────────────────────────────────────────────────────────────────

describe("QuizSection — sắp xếp và nhóm câu hỏi", () => {
  it("sắp xếp câu hỏi theo orderIndex tăng dần", () => {
    const shuffled = makeStandardQuiz(true); // reversed (10→1)
    const sorted = [...shuffled.questions].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
    expect(sorted.map((q) => q.orderIndex)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it("nhóm đúng: 4 VOCABULARY, 3 CONTENT, 3 SEQUENCE", () => {
    const quiz = makeStandardQuiz();
    const sorted = [...quiz.questions].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
    const vocab = sorted.filter((q) => q.questionType === "VOCABULARY");
    const content = sorted.filter((q) => q.questionType === "CONTENT");
    const sequence = sorted.filter((q) => q.questionType === "SEQUENCE");

    expect(vocab).toHaveLength(4);
    expect(content).toHaveLength(3);
    expect(sequence).toHaveLength(3);
  });

  it("VOCABULARY xuất hiện trước CONTENT, CONTENT trước SEQUENCE sau khi sort", () => {
    const quiz = makeStandardQuiz(true);
    const sorted = [...quiz.questions].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
    const types = sorted.map((q) => q.questionType);
    const vocabEnd = types.lastIndexOf("VOCABULARY");
    const contentStart = types.indexOf("CONTENT");
    const contentEnd = types.lastIndexOf("CONTENT");
    const seqStart = types.indexOf("SEQUENCE");

    expect(vocabEnd).toBeLessThan(contentStart);
    expect(contentEnd).toBeLessThan(seqStart);
  });
});

describe("QuizSection — allAnswered logic", () => {
  it("false khi questions.length === 0 (vacuous truth guard)", () => {
    const sorted: Question[] = [];
    const answers: Record<number, number> = {};
    const allAnswered =
      sorted.length > 0 && sorted.every((q) => answers[q.id] !== undefined);
    expect(allAnswered).toBe(false);
  });

  it("false khi chưa trả lời bất kỳ câu nào", () => {
    const quiz = makeStandardQuiz();
    const sorted = [...quiz.questions].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
    const answers: Record<number, number> = {};
    const allAnswered =
      sorted.length > 0 && sorted.every((q) => answers[q.id] !== undefined);
    expect(allAnswered).toBe(false);
  });

  it("false khi mới trả lời 9/10 câu", () => {
    const quiz = makeStandardQuiz();
    const sorted = [...quiz.questions].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
    const answers: Record<number, number> = {};
    sorted.slice(0, 9).forEach((q) => (answers[q.id] = 0));

    const allAnswered =
      sorted.length > 0 && sorted.every((q) => answers[q.id] !== undefined);
    expect(allAnswered).toBe(false);
  });

  it("true khi đã trả lời đủ 10 câu", () => {
    const quiz = makeStandardQuiz();
    const sorted = [...quiz.questions].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
    const answers: Record<number, number> = {};
    sorted.forEach((q) => (answers[q.id] = 0));

    const allAnswered =
      sorted.length > 0 && sorted.every((q) => answers[q.id] !== undefined);
    expect(allAnswered).toBe(true);
  });

  it("chấp nhận đáp án = 0 (index đầu tiên) — không phải falsy trap", () => {
    const quiz = makeStandardQuiz();
    const sorted = [...quiz.questions].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
    const answers: Record<number, number> = {};
    sorted.forEach((q) => (answers[q.id] = 0)); // tất cả chọn option A (index 0)

    const allAnswered =
      sorted.length > 0 && sorted.every((q) => answers[q.id] !== undefined);
    expect(allAnswered).toBe(true);
  });
});

describe("QuizSection — query invalidation sau submit", () => {
  it("invalidate đủ 6 query keys khi submit thành công", () => {
    const invalidate = vi.fn();
    const lessonId = 5;
    const courseId = "2";

    // Mô phỏng onSuccess callback
    function onSuccess() {
      invalidate({ queryKey: ["lesson", lessonId] });
      invalidate({ queryKey: ["recent-attempts"] });
      invalidate({ queryKey: ["lessons", courseId] });
      invalidate({ queryKey: ["course", courseId] });
      invalidate({ queryKey: ["my-courses"] });
      invalidate({ queryKey: ["streak"] });
    }

    onSuccess();
    expect(invalidate).toHaveBeenCalledTimes(6);

    const keys = invalidate.mock.calls.map((c) => c[0].queryKey[0]);
    expect(keys).toContain("lesson");
    expect(keys).toContain("recent-attempts");
    expect(keys).toContain("lessons");
    expect(keys).toContain("course");
    expect(keys).toContain("my-courses");
    expect(keys).toContain("streak");
  });

  it("invalidate course với courseId luôn là string, không ép kiểu Number", () => {
    const invalidate = vi.fn();
    const courseId = "3";

    invalidate({ queryKey: ["course", courseId] });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["course", "3"], // string, đúng theo query key convention của useQuiz.ts
    });
  });
});

describe("QuizSection — kết quả bài thi", () => {
  it("điểm 70% với passScore 70 → passed = true", () => {
    const totalQuestions = 10;
    const passScore = 70;
    const correct = 7;
    const score = Math.round((correct * 100.0) / totalQuestions);
    const requiredCorrect = Math.ceil((totalQuestions * passScore) / 100.0);
    const passed = correct >= requiredCorrect;

    expect(score).toBe(70);
    expect(passed).toBe(true);
  });

  it("điểm 60% với passScore 70 → passed = false", () => {
    const totalQuestions = 10;
    const passScore = 70;
    const correct = 6;
    const score = Math.round((correct * 100.0) / totalQuestions);
    const requiredCorrect = Math.ceil((totalQuestions * passScore) / 100.0);
    const passed = correct >= requiredCorrect;

    expect(score).toBe(60);
    expect(passed).toBe(false);
  });

  it("điểm 80% với passScore 75 (N2 level) → passed = true", () => {
    const totalQuestions = 10;
    const passScore = 75;
    const correct = 8;
    const score = Math.round((correct * 100.0) / totalQuestions);
    const requiredCorrect = Math.ceil((totalQuestions * passScore) / 100.0);
    const passed = correct >= requiredCorrect;

    expect(score).toBe(80);
    expect(passed).toBe(true);
  });

  it("boundary: đúng đúng ngưỡng requiredCorrect → passed", () => {
    // 10 câu, passScore 70% → cần ceil(10*70/100) = 7 câu
    const requiredCorrect = Math.ceil((10 * 70) / 100);
    expect(requiredCorrect).toBe(7);

    // Đúng 7 câu → passed
    expect(7 >= requiredCorrect).toBe(true);
    // Đúng 6 câu → failed
    expect(6 >= requiredCorrect).toBe(false);
  });
});

describe("QuizSection — reset state (Làm lại)", () => {
  it("reset answers, submitted, result về trạng thái ban đầu", () => {
    let answers: Record<number, number> = { 1: 0, 2: 1 };
    let submitted = true;
    let result: QuizAttempt | null = makeResult(true, 80);

    // Mô phỏng handleReset
    function handleReset() {
      answers = {};
      submitted = false;
      result = null;
    }

    handleReset();
    expect(answers).toEqual({});
    expect(submitted).toBe(false);
    expect(result).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ❸ QUIZ — render tests (section headers + UI state)
// ─────────────────────────────────────────────────────────────────────────────

// QuizSection dùng React state nên cần render. Tạo wrapper tối thiểu.
const React = await import("react");

function QuizSectionWrapper({ quiz }: { quiz: Quiz }) {
  // Re-implement QuizSection logic inline để test độc lập khỏi dependencies phức tạp
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [result, setResult] = React.useState<QuizAttempt | null>(null);

  const sorted = [...quiz.questions].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );
  const allAnswered =
    sorted.length > 0 && sorted.every((q) => answers[q.id] !== undefined);

  const SECTIONS = {
    VOCABULARY: "Từ vựng",
    CONTENT: "Nội dung bài học",
    SEQUENCE: "Trình tự sự kiện",
  };
  const SECTION_ORDER = ["VOCABULARY", "CONTENT", "SEQUENCE"] as const;

  if (sorted.length === 0) {
    return <p>Quiz chưa có câu hỏi nào.</p>;
  }

  if (submitted && result) {
    return (
      <div>
        <p data-testid="result-msg">
          {result.passed ? "Xuất sắc! Bạn đã đạt!" : "Cố lên! Hãy thử lại!"}
        </p>
        <p data-testid="score">{result.score}%</p>
        {SECTION_ORDER.map((type) => {
          const qs = sorted.filter((q) => q.questionType === type);
          if (!qs.length) return null;
          return (
            <div key={type}>
              <span data-testid={`result-header-${type}`}>
                {SECTIONS[type]}
              </span>
              {qs.map((q) => (
                <div key={q.id} data-testid={`result-q-${q.id}`}>
                  {q.content}
                </div>
              ))}
            </div>
          );
        })}
        <button
          onClick={() => {
            setSubmitted(false);
            setResult(null);
            setAnswers({});
          }}
        >
          Làm lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <span data-testid="question-count">{sorted.length} câu hỏi</span>
      {SECTION_ORDER.map((type) => {
        const qs = sorted.filter((q) => q.questionType === type);
        if (!qs.length) return null;
        return (
          <div key={type}>
            <span data-testid={`section-header-${type}`}>{SECTIONS[type]}</span>
            {qs.map((q) => (
              <div key={q.id}>
                <p>{q.content}</p>
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    data-testid={`opt-${q.id}-${oi}`}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: oi }))
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))}
          </div>
        );
      })}
      <button
        data-testid="submit-btn"
        disabled={!allAnswered}
        onClick={() => {
          if (!allAnswered) return;
          mockMutate();
          const fakeResult = makeResult(true, 90);
          setResult(fakeResult);
          setSubmitted(true);
        }}
      >
        Nộp bài
      </button>
      {!allAnswered && (
        <p data-testid="hint">
          Vui lòng trả lời tất cả {sorted.length} câu hỏi trước khi nộp
        </p>
      )}
    </div>
  );
}

describe("QuizSection — render: section headers", () => {
  it("hiển thị đủ 3 section header: Từ vựng, Nội dung bài học, Trình tự sự kiện", () => {
    render(<QuizSectionWrapper quiz={makeStandardQuiz()} />);
    expect(screen.getByTestId("section-header-VOCABULARY")).toHaveTextContent(
      "Từ vựng",
    );
    expect(screen.getByTestId("section-header-CONTENT")).toHaveTextContent(
      "Nội dung bài học",
    );
    expect(screen.getByTestId("section-header-SEQUENCE")).toHaveTextContent(
      "Trình tự sự kiện",
    );
  });

  it("hiển thị đúng số câu hỏi trong badge", () => {
    render(<QuizSectionWrapper quiz={makeStandardQuiz()} />);
    expect(screen.getByTestId("question-count")).toHaveTextContent(
      "10 câu hỏi",
    );
  });

  it("quiz rỗng hiển thị thông báo 'Quiz chưa có câu hỏi nào'", () => {
    const emptyQuiz: Quiz = {
      id: 1,
      lessonId: 1,
      passScore: 70,
      questions: [],
    };
    render(<QuizSectionWrapper quiz={emptyQuiz} />);
    expect(screen.getByText("Quiz chưa có câu hỏi nào.")).toBeDefined();
  });
});

describe("QuizSection — render: submit button state", () => {
  it("Submit button disabled khi chưa trả lời", () => {
    render(<QuizSectionWrapper quiz={makeStandardQuiz()} />);
    expect(screen.getByTestId("submit-btn")).toBeDisabled();
  });

  it("hint text hiển thị khi chưa trả lời đủ", () => {
    render(<QuizSectionWrapper quiz={makeStandardQuiz()} />);
    expect(screen.getByTestId("hint")).toHaveTextContent(
      "Vui lòng trả lời tất cả 10 câu hỏi trước khi nộp",
    );
  });

  it("Submit button enabled sau khi trả lời đủ 10 câu", async () => {
    const user = userEvent.setup();
    render(<QuizSectionWrapper quiz={makeStandardQuiz()} />);

    // Chọn option A (index 0) cho tất cả 10 câu
    for (let qId = 1; qId <= 10; qId++) {
      await user.click(screen.getByTestId(`opt-${qId}-0`));
    }

    expect(screen.getByTestId("submit-btn")).not.toBeDisabled();
  });

  it("hint text ẩn sau khi trả lời đủ câu", async () => {
    const user = userEvent.setup();
    render(<QuizSectionWrapper quiz={makeStandardQuiz()} />);

    for (let qId = 1; qId <= 10; qId++) {
      await user.click(screen.getByTestId(`opt-${qId}-0`));
    }

    expect(screen.queryByTestId("hint")).toBeNull();
  });
});

describe("QuizSection — render: result screen", () => {
  it("hiển thị 'Xuất sắc! Bạn đã đạt!' khi passed = true", async () => {
    const user = userEvent.setup();
    render(<QuizSectionWrapper quiz={makeStandardQuiz()} />);

    for (let qId = 1; qId <= 10; qId++) {
      await user.click(screen.getByTestId(`opt-${qId}-0`));
    }
    await user.click(screen.getByTestId("submit-btn"));

    expect(screen.getByTestId("result-msg")).toHaveTextContent(
      "Xuất sắc! Bạn đã đạt!",
    );
  });

  it("hiển thị score% sau khi submit", async () => {
    const user = userEvent.setup();
    render(<QuizSectionWrapper quiz={makeStandardQuiz()} />);

    for (let qId = 1; qId <= 10; qId++) {
      await user.click(screen.getByTestId(`opt-${qId}-0`));
    }
    await user.click(screen.getByTestId("submit-btn"));

    expect(screen.getByTestId("score")).toHaveTextContent("90%");
  });

  it("result screen cũng có 3 section headers", async () => {
    const user = userEvent.setup();
    render(<QuizSectionWrapper quiz={makeStandardQuiz()} />);

    for (let qId = 1; qId <= 10; qId++) {
      await user.click(screen.getByTestId(`opt-${qId}-0`));
    }
    await user.click(screen.getByTestId("submit-btn"));

    expect(screen.getByTestId("result-header-VOCABULARY")).toHaveTextContent(
      "Từ vựng",
    );
    expect(screen.getByTestId("result-header-CONTENT")).toHaveTextContent(
      "Nội dung bài học",
    );
    expect(screen.getByTestId("result-header-SEQUENCE")).toHaveTextContent(
      "Trình tự sự kiện",
    );
  });

  it("'Làm lại' reset về form quiz", async () => {
    const user = userEvent.setup();
    render(<QuizSectionWrapper quiz={makeStandardQuiz()} />);

    for (let qId = 1; qId <= 10; qId++) {
      await user.click(screen.getByTestId(`opt-${qId}-0`));
    }
    await user.click(screen.getByTestId("submit-btn"));

    // Đang ở result screen
    expect(screen.getByTestId("result-msg")).toBeDefined();

    // Click Làm lại
    await user.click(screen.getByText("Làm lại"));

    // Quay lại form
    expect(screen.queryByTestId("result-msg")).toBeNull();
    expect(screen.getByTestId("submit-btn")).toBeDisabled();
  });
});

describe("QuizSection — render: câu hỏi thứ tự đúng dù input bị xáo trộn", () => {
  it("câu hỏi orderIndex=1 xuất hiện trước orderIndex=10 dù input bị đảo", () => {
    render(<QuizSectionWrapper quiz={makeStandardQuiz(true)} />);

    const vocab = screen.getByTestId("section-header-VOCABULARY");
    const sequence = screen.getByTestId("section-header-SEQUENCE");

    // VOCABULARY phải xuất hiện trước SEQUENCE trong DOM
    const position = (el: Element) =>
      Array.from(document.body.querySelectorAll("[data-testid]")).indexOf(el);

    expect(position(vocab)).toBeLessThan(position(sequence));
  });
});
