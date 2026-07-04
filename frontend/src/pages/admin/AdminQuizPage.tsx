import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  Pencil,
  X,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  QUESTION_SECTION_ORDER,
  QUESTION_SECTION_META,
} from "@/lib/quiz-constants";
import type { AdminQuestion } from "@/types";
import {
  useAdminQuiz,
  useUpdateQuestionMutation,
  useCreateQuizMutation,
  useDeleteQuizMutation,
} from "@/hooks/useAdminQuiz";
import { useAdminLessons } from "@/hooks/useAdminLesson";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

// ── Question Edit Modal ────────────────────────────────────────────────────────

const POSITION_LABELS = ["1", "2", "3", "4"] as const;

function QuestionFormModal({
  question,
  lessonId,
  onClose,
}: {
  question: AdminQuestion;
  lessonId: string;
  onClose: () => void;
}) {
  const [content, setContent] = useState(question.content);
  const [options, setOptions] = useState([...question.options]);
  const [correctOption, setCorrectOption] = useState(question.correctOption);
  const [correctAnswerText, setCorrectAnswerText] = useState(
    question.correctAnswerText ?? "",
  );
  // positions[i] = vị trí đúng (1-4) của mục i trong thứ tự sự kiện
  const [positions, setPositions] = useState<number[]>(() => {
    const order = question.correctOrder ?? [0, 1, 2, 3];
    return [0, 1, 2, 3].map((i) => order.indexOf(i) + 1);
  });
  const [error, setError] = useState("");

  const mutation = useUpdateQuestionMutation(lessonId);

  const isPermutation = new Set(positions).size === 4;

  const canSave =
    content.trim() !== "" &&
    (question.questionType === "CONTENT"
      ? options.every((o) => o.trim() !== "")
      : question.questionType === "VOCABULARY"
        ? correctAnswerText.trim() !== ""
        : options.every((o) => o.trim() !== "") && isPermutation);

  const handleSave = () => {
    setError("");
    if (question.questionType === "SEQUENCE" && !isPermutation) {
      setError("Mỗi vị trí 1-4 phải được chọn đúng một lần.");
      return;
    }

    const data =
      question.questionType === "VOCABULARY"
        ? {
            content,
            options: question.options,
            correctOption: question.correctOption,
            correctAnswerText,
          }
        : question.questionType === "SEQUENCE"
          ? {
              content,
              options,
              correctOption: question.correctOption,
              correctOrder: [0, 1, 2, 3].map((pos) =>
                positions.indexOf(pos + 1),
              ),
            }
          : { content, options, correctOption };

    mutation.mutate(
      { questionId: question.id, data },
      {
        onSuccess: onClose,
        onError: () => setError("Lưu thất bại. Vui lòng thử lại."),
      },
    );
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-surface relative w-full max-w-[580px] rounded-2xl border border-b2 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-t1 font-bold text-base">
            Chỉnh sửa câu {question.orderIndex}
          </h2>
          <button onClick={onClose} className="text-t3 hover:text-t2">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-t2 text-xs font-medium mb-1.5 block">
              Nội dung câu hỏi *
            </label>
            <textarea
              rows={3}
              className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors resize-none"
              placeholder={
                question.questionType === "VOCABULARY"
                  ? "Dùng dấu gạch dưới (＿＿＿) để biểu thị chỗ trống"
                  : "Nhập nội dung câu hỏi"
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {question.questionType === "VOCABULARY" && (
              <p className="text-t3 text-xs mt-1">
                Dùng dấu gạch dưới (＿＿＿) để biểu thị chỗ trống cần điền.
              </p>
            )}
          </div>

          {question.questionType === "CONTENT" && (
            <div>
              <label className="text-t2 text-xs font-medium mb-2 block">
                Đáp án — nhấn nút tròn để chọn đáp án đúng
              </label>
              <div className="flex flex-col gap-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCorrectOption(i)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 shrink-0 transition-colors",
                        correctOption === i
                          ? "border-acc bg-acc"
                          : "border-b2 hover:border-t3",
                      )}
                    />
                    <span className="text-t3 text-xs font-mono w-4 shrink-0">
                      {OPTION_LABELS[i]}
                    </span>
                    <input
                      className={cn(
                        "flex-1 bg-s2 border rounded-lg px-3 py-2 text-t1 text-sm outline-none transition-colors",
                        correctOption === i
                          ? "border-acc"
                          : "border-b1 focus:border-acc",
                      )}
                      value={opt}
                      onChange={(e) => {
                        const next = [...options];
                        next[i] = e.target.value;
                        setOptions(next);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {question.questionType === "VOCABULARY" && (
            <div>
              <label className="text-t2 text-xs font-medium mb-1.5 block">
                Đáp án đúng *
              </label>
              <input
                className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
                placeholder="Nhập đáp án đúng"
                value={correctAnswerText}
                onChange={(e) => setCorrectAnswerText(e.target.value)}
              />
            </div>
          )}

          {question.questionType === "SEQUENCE" && (
            <div>
              <label className="text-t2 text-xs font-medium mb-2 block">
                Các mục và thứ tự đúng (1-4)
              </label>
              <div className="flex flex-col gap-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-t3 text-xs font-medium shrink-0 w-16">
                      Mục {i + 1}
                    </span>
                    <input
                      className="flex-1 bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
                      value={opt}
                      onChange={(e) => {
                        const next = [...options];
                        next[i] = e.target.value;
                        setOptions(next);
                      }}
                    />
                    <select
                      className="bg-s2 border border-b1 rounded-lg px-2 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors shrink-0"
                      value={positions[i]}
                      onChange={(e) => {
                        const next = [...positions];
                        next[i] = Number(e.target.value);
                        setPositions(next);
                      }}
                    >
                      {POSITION_LABELS.map((label, idx) => (
                        <option key={label} value={idx + 1}>
                          Vị trí {label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              {!isPermutation && (
                <p className="text-acc text-xs mt-2">
                  Mỗi vị trí 1-4 phải được chọn đúng một lần.
                </p>
              )}
            </div>
          )}

          {error && (
            <p className="text-acc text-xs flex items-center gap-1.5">
              <AlertCircle size={13} /> {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1"
              loading={mutation.isPending}
              disabled={!canSave}
              onClick={handleSave}
            >
              Lưu thay đổi
            </Button>
            <Button variant="outline" onClick={onClose}>
              Huỷ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Create Quiz Form ──────────────────────────────────────────────────────────

function CreateQuizForm({ lessonId }: { lessonId: string }) {
  const [passScore, setPassScore] = useState(70);
  const [error, setError] = useState("");
  const mutation = useCreateQuizMutation(lessonId);

  return (
    <div className="border border-b1 rounded-xl bg-s1 p-10 text-center max-w-sm mx-auto">
      <HelpCircle size={36} className="text-t3 mx-auto mb-3" />
      <p className="text-t2 font-medium mb-1">Bài học này chưa có quiz</p>
      <p className="text-t3 text-xs mb-6">
        Tạo quiz với 10 câu hỏi placeholder, sau đó chỉnh sửa từng câu
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <label className="text-t2 text-xs font-medium shrink-0 w-20 text-right">
            Điểm đạt (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={passScore}
            onChange={(e) => setPassScore(Number(e.target.value))}
            className="flex-1 bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
          />
        </div>
        {error && (
          <p className="text-acc text-xs flex items-center gap-1.5 justify-center">
            <AlertCircle size={13} /> {error}
          </p>
        )}
        <Button
          className="w-full mt-1"
          loading={mutation.isPending}
          onClick={() => {
            setError("");
            mutation.mutate(passScore, {
              onError: () => setError("Tạo quiz thất bại. Vui lòng thử lại."),
            });
          }}
        >
          <Plus size={14} className="mr-1.5" /> Tạo quiz
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function AdminQuizPage() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const [editTarget, setEditTarget] = useState<AdminQuestion | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: quiz, isLoading } = useAdminQuiz(lessonId);
  const { data: lessons = [] } = useAdminLessons(courseId);
  const lesson = lessons.find((l) => l.id === Number(lessonId));
  const deleteMutation = useDeleteQuizMutation(lessonId);

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-10">
      {editTarget && lessonId && (
        <QuestionFormModal
          question={editTarget}
          lessonId={lessonId}
          onClose={() => setEditTarget(null)}
        />
      )}

      <button
        onClick={() => navigate(`/admin/khoa-hoc/${courseId}/bai-hoc`)}
        className="flex items-center gap-1.5 text-t3 text-xs hover:text-t2 transition-colors mb-6"
      >
        <ChevronLeft size={14} /> Bài học
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-t1 text-2xl font-bold"
            style={{ letterSpacing: "-0.03em" }}
          >
            {lesson ? `Quiz: ${lesson.title}` : "Quản lý Quiz"}
          </h1>
          <p className="text-t3 text-sm mt-1">
            {quiz
              ? `Điểm đạt: ${quiz.passScore}% · ${quiz.questions.length} câu hỏi`
              : ""}
          </p>
        </div>

        {quiz && (
          <div className="flex items-center gap-2">
            {confirmDelete ? (
              <>
                <span className="text-t2 text-xs">Xác nhận xóa quiz?</span>
                <Button
                  variant="outline"
                  className="text-xs px-3 py-1.5 h-auto border-acc/50 text-acc hover:bg-acc/10"
                  loading={deleteMutation.isPending}
                  onClick={() => {
                    deleteMutation.mutate(quiz.id, {
                      onSuccess: () => setConfirmDelete(false),
                    });
                  }}
                >
                  Xóa
                </Button>
                <Button
                  variant="outline"
                  className="text-xs px-3 py-1.5 h-auto"
                  onClick={() => setConfirmDelete(false)}
                >
                  Huỷ
                </Button>
              </>
            ) : (
              <button
                title="Xóa quiz"
                onClick={() => setConfirmDelete(true)}
                className="p-2 rounded-md text-t3 hover:text-acc hover:bg-acc/10 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-s1 border border-b1 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : !quiz ? (
        lessonId ? (
          <CreateQuizForm lessonId={lessonId} />
        ) : null
      ) : (
        <div className="flex flex-col gap-6">
          {QUESTION_SECTION_ORDER.map((type) => {
            const { label, Icon } = QUESTION_SECTION_META[type];
            const questions = quiz.questions.filter(
              (q) => q.questionType === type,
            );
            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={14} className="text-t3" />
                  <span className="text-t2 text-sm font-medium">{label}</span>
                  <span className="text-t3 text-xs">
                    ({questions.length} câu)
                  </span>
                </div>

                <div className="border border-b1 rounded-xl overflow-hidden">
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className="px-4 py-4 border-b border-b1 last:border-b-0 hover:bg-s2/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-t3 text-xs font-mono shrink-0 mt-0.5">
                            {String(q.orderIndex).padStart(2, "0")}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-t1 text-sm mb-3">{q.content}</p>
                            {q.questionType === "CONTENT" && (
                              <div className="grid grid-cols-2 gap-2">
                                {q.options.map((opt, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs",
                                      q.correctOption === i
                                        ? "border-acc/40 bg-acc/10 text-acc"
                                        : "border-b1 text-t3",
                                    )}
                                  >
                                    <span className="font-mono shrink-0">
                                      {OPTION_LABELS[i]}.
                                    </span>
                                    <span className="line-clamp-1">{opt}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {q.questionType === "VOCABULARY" && (
                              <div className="px-3 py-1.5 rounded-lg border border-acc/40 bg-acc/10 text-acc text-xs inline-flex items-center gap-2">
                                <span className="font-mono shrink-0">
                                  Đáp án:
                                </span>
                                <span className="line-clamp-1">
                                  {q.correctAnswerText}
                                </span>
                              </div>
                            )}
                            {q.questionType === "SEQUENCE" && (
                              <div className="grid grid-cols-2 gap-2">
                                {q.options.map((opt, i) => {
                                  const pos = (q.correctOrder ?? []).indexOf(i);
                                  return (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-acc/40 bg-acc/10 text-acc text-xs"
                                    >
                                      <span className="font-mono shrink-0">
                                        {pos + 1}.
                                      </span>
                                      <span className="line-clamp-1">
                                        {opt}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          title="Chỉnh sửa"
                          onClick={() => setEditTarget(q)}
                          className="p-1.5 rounded-md text-t3 hover:text-t1 hover:bg-s2 transition-colors shrink-0"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
