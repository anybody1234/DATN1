import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { AnswerValue, Question, QuizAttempt } from "@/types";
import { useSubmitQuiz } from "@/hooks/useQuiz";
import { ExampleCard } from "./ExampleCard";
import { SequenceOrderQuestion } from "./SequenceOrderQuestion";
import { ResultModal } from "./ResultModal";

export function SequenceStep({
  questions,
  answers,
  setAnswers,
  quizId,
  passScore,
  lessonId,
  courseId,
  onBack,
  onPassed,
  onRetry,
}: {
  questions: Question[];
  answers: Record<string, AnswerValue>;
  setAnswers: (
    updater: (prev: Record<string, AnswerValue>) => Record<string, AnswerValue>,
  ) => void;
  quizId: number;
  passScore: number;
  lessonId: number;
  courseId: string;
  onBack: () => void;
  onPassed: () => void;
  onRetry: () => void;
}) {
  const navigate = useNavigate();
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submitMutation = useSubmitQuiz(quizId, lessonId, courseId);

  const allOrdered = questions.every((q) => {
    const order = answers[q.id];
    return Array.isArray(order) && order.length === q.options.length;
  });

  const handleSubmit = () => {
    setSubmitError("");
    submitMutation.mutate(answers, {
      onSuccess: (data) => {
        setResult(data);
        setShowModal(true);
        if (data.passed) onPassed();
      },
      onError: () => setSubmitError("Nộp bài thất bại. Vui lòng thử lại."),
    });
  };

  const handleDashboard = () => {
    setShowModal(false);
    navigate("/dashboard");
  };

  const handleDismissModal = () => setShowModal(false);

  const handleRetry = () => {
    setShowModal(false);
    setResult(null);
    onRetry();
  };

  return (
    <>
      {showModal && result && (
        <ResultModal
          result={result}
          passScore={passScore}
          onDashboard={handleDashboard}
          onDismiss={handleDismissModal}
          onRetry={handleRetry}
        />
      )}

      <div className="border border-b1 rounded-xl bg-s1 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-t1 font-semibold text-sm">Trình tự sự kiện</h3>
          <Badge variant="muted">{questions.length} câu hỏi</Badge>
        </div>

        <ExampleCard type="SEQUENCE" />

        <div className="flex flex-col gap-5 mb-2">
          {questions.map((q, i) => (
            <SequenceOrderQuestion
              key={q.id}
              content={`${i + 1}. ${q.content}`}
              options={q.options}
              order={(answers[q.id] as number[]) ?? []}
              onChange={(order) =>
                setAnswers((prev) => ({ ...prev, [q.id]: order }))
              }
            />
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft size={14} /> Quay lại
          </Button>
          <Button
            disabled={!allOrdered}
            loading={submitMutation.isPending}
            onClick={handleSubmit}
          >
            <Send size={14} /> Nộp bài
          </Button>
        </div>

        {submitError && (
          <p className="text-acc text-xs text-center mt-2">{submitError}</p>
        )}
        {!allOrdered && !submitError && (
          <p className="text-t3 text-xs text-center mt-2">
            Vui lòng sắp xếp đầy đủ thứ tự cho tất cả {questions.length} câu hỏi
            trước khi nộp
          </p>
        )}
      </div>
    </>
  );
}
