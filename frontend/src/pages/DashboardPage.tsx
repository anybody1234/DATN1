import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Trophy,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  useStreak,
  useMyCourses,
  useRecentAttempts,
  useAttemptReview,
} from "@/hooks/useDashboard";
import {
  QUESTION_SECTION_ORDER,
  QUESTION_SECTION_META,
} from "@/lib/quiz-constants";
import type { QuestionReview } from "@/types";

// ── AttemptReviewModal ────────────────────────────────────────────────────────

function isReviewQuestionCorrect(q: QuestionReview): boolean {
  switch (q.questionType) {
    case "VOCABULARY":
      return q.selectedAnswer === q.correctOption;
    case "CONTENT":
      return (
        typeof q.selectedAnswer === "string" &&
        q.correctAnswerText != null &&
        q.selectedAnswer.trim().toLowerCase() ===
          q.correctAnswerText.trim().toLowerCase()
      );
    case "SEQUENCE":
      return (
        Array.isArray(q.selectedAnswer) &&
        JSON.stringify(q.selectedAnswer) === JSON.stringify(q.correctOrder)
      );
    default:
      return false;
  }
}

function AttemptReviewModal({
  attemptId,
  onClose,
}: {
  attemptId: number;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useAttemptReview(attemptId);
  // Sort một lần, không lặp lại trong mỗi section map
  const sortedQuestions = useMemo(
    () =>
      data?.questions
        ? [...data.questions].sort((a, b) => a.orderIndex - b.orderIndex)
        : [],
    [data?.questions],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-[600px] rounded-2xl border border-b2 mb-8"
        style={{ background: "var(--s1)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-6 border-b border-b1">
          <div>
            {isLoading ? (
              <div className="h-5 bg-s2 rounded w-48 animate-pulse" />
            ) : (
              <>
                <p className="text-t3 text-xs mb-1">Kết quả bài kiểm tra</p>
                <h2
                  className="text-t1 text-base font-bold"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {data?.lessonTitle}
                </h2>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-t3 hover:text-t2 transition-colors shrink-0 mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Score summary */}
        {data && (
          <div className="flex items-center gap-4 px-6 py-4 border-b border-b1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                data.passed ? "bg-ok-muted" : "bg-acc-muted"
              }`}
            >
              {data.passed ? (
                <CheckCircle size={20} className="text-ok" />
              ) : (
                <XCircle size={20} className="text-acc" />
              )}
            </div>
            <div className="flex-1">
              <span
                className={`text-sm font-semibold ${data.passed ? "text-ok" : "text-acc"}`}
              >
                {data.passed ? "Đạt" : "Chưa đạt"}
              </span>
              <span className="text-t3 text-xs ml-2">
                · {formatDate(data.attemptedAt)}
              </span>
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${data.passed ? "text-ok" : "text-acc"}`}
                style={{ letterSpacing: "-0.03em" }}
              >
                {data.score}%
              </div>
              <div className="text-t3 text-xs">cần {data.passScore}%</div>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="p-6 flex flex-col gap-6">
          {isLoading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-s2 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-t3 text-sm text-center py-4">
              Không thể tải chi tiết. Vui lòng thử lại.
            </p>
          )}

          {data &&
            QUESTION_SECTION_ORDER.map((type) => {
              const sectionQs = sortedQuestions.filter(
                (q) => q.questionType === type,
              );
              if (sectionQs.length === 0) return null;

              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-t3 uppercase tracking-widest">
                      {QUESTION_SECTION_META[type].label}
                    </span>
                    <div className="flex-1 h-px bg-b1" />
                  </div>

                  <div className="flex flex-col gap-4">
                    {sectionQs.map((q, qi) => {
                      const isCorrect = isReviewQuestionCorrect(q);
                      return (
                        <div
                          key={q.id}
                          className={cn(
                            "rounded-xl border p-4",
                            isCorrect ? "border-ok-bd" : "border-acc-bd",
                          )}
                          style={{
                            background: isCorrect
                              ? "var(--ok-muted, rgba(22,101,52,0.1))"
                              : "var(--acc-muted)",
                          }}
                        >
                          <p className="text-t1 text-sm font-medium mb-3">
                            {qi + 1}. {q.content}
                          </p>

                          {q.questionType === "VOCABULARY" && (
                            <div className="flex flex-col gap-1.5">
                              {q.options.map((opt, oi) => {
                                const isCorrectOpt = oi === q.correctOption;
                                const isSelected = oi === q.selectedAnswer;
                                return (
                                  <div
                                    key={oi}
                                    className={cn(
                                      "px-3 py-2 rounded-lg text-sm border flex items-center justify-between",
                                      isCorrectOpt
                                        ? "border-ok-bd bg-ok-muted text-ok"
                                        : isSelected && !isCorrectOpt
                                          ? "border-acc-bd bg-acc-muted text-acc"
                                          : "border-b1 text-t3",
                                    )}
                                  >
                                    <span>{opt}</span>
                                    {isCorrectOpt && (
                                      <span className="text-xs opacity-70 ml-2 shrink-0">
                                        ✓ Đáp án đúng
                                      </span>
                                    )}
                                    {isSelected && !isCorrectOpt && (
                                      <span className="text-xs opacity-70 ml-2 shrink-0">
                                        ✗ Bạn chọn
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {q.questionType === "CONTENT" && (
                            <div className="flex flex-col gap-1.5 text-sm">
                              <div
                                className={cn(
                                  "px-3 py-2 rounded-lg border",
                                  isCorrect
                                    ? "border-ok-bd bg-ok-muted text-ok"
                                    : "border-acc-bd bg-acc-muted text-acc",
                                )}
                              >
                                Câu trả lời của bạn:{" "}
                                {typeof q.selectedAnswer === "string" &&
                                q.selectedAnswer.trim() !== ""
                                  ? q.selectedAnswer
                                  : "(chưa trả lời)"}
                              </div>
                              {!isCorrect && (
                                <div className="px-3 py-2 rounded-lg border border-ok-bd bg-ok-muted text-ok">
                                  Đáp án đúng: {q.correctAnswerText}
                                </div>
                              )}
                            </div>
                          )}

                          {q.questionType === "SEQUENCE" && (
                            <div className="flex flex-col gap-1.5">
                              {q.options.map((opt, oi) => {
                                const correctPos =
                                  (q.correctOrder ?? []).indexOf(oi) + 1;
                                const selectedOrder = Array.isArray(
                                  q.selectedAnswer,
                                )
                                  ? q.selectedAnswer
                                  : [];
                                const selectedPos =
                                  selectedOrder.indexOf(oi) + 1;
                                const matches = selectedPos === correctPos;
                                return (
                                  <div
                                    key={oi}
                                    className={cn(
                                      "px-3 py-2 rounded-lg text-sm border flex items-center justify-between",
                                      matches
                                        ? "border-ok-bd bg-ok-muted text-ok"
                                        : "border-acc-bd bg-acc-muted text-acc",
                                    )}
                                  >
                                    <span>{opt}</span>
                                    <span className="text-xs opacity-70 ml-2 shrink-0">
                                      Đúng: {correctPos} · Bạn chọn:{" "}
                                      {selectedPos > 0 ? selectedPos : "—"}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="border border-b1 rounded-xl bg-s1 p-5 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accent ? "bg-acc-muted" : "bg-s2"}`}
      >
        <Icon size={18} className={accent ? "text-acc" : "text-t2"} />
      </div>
      <div>
        <div className="text-t1 text-xl font-bold">{value}</div>
        <div className="text-t3 text-xs mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 bg-s2 rounded-full overflow-hidden">
      <div
        className="h-full bg-acc rounded-full transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [reviewAttemptId, setReviewAttemptId] = useState<number | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: streakData } = useStreak();
  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useMyCourses();
  const {
    data: attemptsData,
    isLoading: attemptsLoading,
    isError: attemptsError,
  } = useRecentAttempts();

  const streak = streakData ?? {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: "",
  };
  const courses = coursesData ?? [];
  const attempts = attemptsData ?? [];
  const totalCompleted = courses.reduce(
    (s, c) => s + (c.completedLessons ?? 0),
    0,
  );

  return (
    <>
      <div className="max-w-[1120px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-t1 text-2xl font-bold"
            style={{ letterSpacing: "-0.03em" }}
          >
            Xin chào,{" "}
            <span className="text-acc">{user?.email?.split("@")[0]}</span> 👋
          </h1>
          <p className="text-t3 text-sm mt-1">
            Hãy tiếp tục hành trình tiếng Nhật của bạn hôm nay.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Chuỗi ngày học"
            value={`${streak.currentStreak} ngày`}
            icon={Flame}
            accent
          />
          <StatCard
            label="Kỷ lục cá nhân"
            value={`${streak.longestStreak} ngày`}
            icon={Trophy}
          />
          <StatCard
            label="Bài học đã hoàn thành"
            value={totalCompleted}
            icon={CheckCircle}
          />
          <StatCard
            label="Khoá học đang học"
            value={courses.length}
            icon={BookOpen}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course progress */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-t1 font-semibold text-sm">
                Tiến độ khoá học
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/khoa-hoc")}
              >
                Xem tất cả <ArrowRight size={13} />
              </Button>
            </div>

            {coursesError ? (
              <div className="border border-b1 rounded-xl bg-s1 p-10 text-center">
                <AlertCircle size={32} className="text-t3 mx-auto mb-3" />
                <p className="text-t2 text-sm font-medium mb-1">
                  Không thể tải khoá học
                </p>
                <p className="text-t3 text-xs">
                  Đã xảy ra lỗi. Vui lòng thử lại.
                </p>
              </div>
            ) : coursesLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-b1 rounded-xl bg-s1 p-4 h-20 animate-pulse"
                  />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="border border-b1 rounded-xl bg-s1 p-10 text-center">
                <BookOpen size={32} className="text-t3 mx-auto mb-3" />
                <p className="text-t2 text-sm font-medium mb-1">
                  Chưa có khoá học nào
                </p>
                <p className="text-t3 text-xs mb-4">
                  Khám phá khoá học và bắt đầu học ngay hôm nay
                </p>
                <Button size="sm" onClick={() => navigate("/khoa-hoc")}>
                  Khám phá khoá học
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {courses.map((course) => {
                  const total = course.lessonCount ?? 0;
                  const done = course.completedLessons ?? 0;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div
                      key={course.id}
                      className="border border-b1 rounded-xl bg-s1 p-4 cursor-pointer hover:border-b2 transition-colors"
                      onClick={() => navigate(`/khoa-hoc/${course.id}`)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="text-t1 text-sm font-medium">
                            {course.title}
                          </div>
                          <div className="text-t3 text-xs mt-0.5">
                            {done}/{total} bài học
                          </div>
                        </div>
                        <Badge variant={pct === 100 ? "success" : "default"}>
                          {pct}%
                        </Badge>
                      </div>
                      <ProgressBar value={pct} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent quiz attempts */}
          <div>
            <h2 className="text-t1 font-semibold text-sm mb-4">Quiz gần đây</h2>

            {attemptsError ? (
              <div className="border border-b1 rounded-xl bg-s1 p-8 text-center">
                <AlertCircle size={28} className="text-t3 mx-auto mb-3" />
                <p className="text-t3 text-xs">Không thể tải lịch sử quiz.</p>
              </div>
            ) : attemptsLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-b1 rounded-xl bg-s1 p-4 h-16 animate-pulse"
                  />
                ))}
              </div>
            ) : attempts.length === 0 ? (
              <div className="border border-b1 rounded-xl bg-s1 p-8 text-center">
                <Clock size={28} className="text-t3 mx-auto mb-3" />
                <p className="text-t3 text-xs">Chưa có lần làm quiz nào</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    onClick={() => setReviewAttemptId(attempt.id)}
                    className="border border-b1 rounded-xl bg-s1 p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-b2 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-t1 text-sm font-medium truncate">
                        {attempt.lessonTitle ?? "Bài học"}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-xs font-medium ${attempt.passed ? "text-ok" : "text-acc"}`}
                        >
                          {attempt.passed ? "✓ Đạt" : "✗ Chưa đạt"}
                        </span>
                        <span className="text-t3 text-xs">·</span>
                        <span className="text-t3 text-xs">
                          {formatDate(attempt.attemptedAt)}
                        </span>
                      </div>
                    </div>
                    <Badge variant={attempt.passed ? "success" : "acc"}>
                      {attempt.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {reviewAttemptId !== null && (
        <AttemptReviewModal
          attemptId={reviewAttemptId}
          onClose={() => setReviewAttemptId(null)}
        />
      )}
    </>
  );
}
