import { useMemo } from "react";
import { X, CheckCircle, XCircle } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { useAttemptReview } from "@/hooks/useDashboard";
import {
  QUESTION_SECTION_ORDER,
  QUESTION_SECTION_META,
  isReviewQuestionCorrect,
} from "@/lib/quiz-constants";

export function AttemptReviewModal({
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
    [data],
  );

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-surface relative w-full max-w-[600px] rounded-2xl border border-b2 mb-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-6 border-b border-b1">
          <div>
            {isLoading ? (
              <div className="h-5 bg-s2 rounded w-48 animate-pulse" />
            ) : (
              <>
                <p className="text-t3 text-xs mb-1">Kết quả bài kiểm tra</p>
                <h2 className="text-t1 text-base font-bold heading-tight">
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
                            isCorrect
                              ? "border-ok-bd bg-ok-muted"
                              : "border-acc-bd bg-acc-muted",
                          )}
                        >
                          <p className="text-t1 text-sm font-medium mb-3">
                            {qi + 1}. {q.content}
                          </p>

                          {q.questionType === "CONTENT" && (
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

                          {q.questionType === "VOCABULARY" && (
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
