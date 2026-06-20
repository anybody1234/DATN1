import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { AnswerValue, Question } from "@/types";
import { ExampleCard } from "./ExampleCard";
import { FillInBlankQuestion } from "./FillInBlankQuestion";

export function ContentStep({
  questions,
  answers,
  setAnswers,
  onBack,
  onNext,
}: {
  questions: Question[];
  answers: Record<string, AnswerValue>;
  setAnswers: (
    updater: (prev: Record<string, AnswerValue>) => Record<string, AnswerValue>,
  ) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const allFilled = questions.every(
    (q) =>
      typeof answers[q.id] === "string" &&
      (answers[q.id] as string).trim() !== "",
  );

  return (
    <div className="border border-b1 rounded-xl bg-s1 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-t1 font-semibold text-sm">Nội dung bài học</h3>
        <Badge variant="muted">{questions.length} câu hỏi</Badge>
      </div>

      <ExampleCard type="CONTENT" />

      <div className="flex flex-col gap-5 mb-2">
        {questions.map((q, i) => (
          <FillInBlankQuestion
            key={q.id}
            content={`${i + 1}. ${q.content}`}
            value={(answers[q.id] as string) ?? ""}
            onChange={(value) =>
              setAnswers((prev) => ({ ...prev, [q.id]: value }))
            }
          />
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft size={14} /> Quay lại
        </Button>
        <Button disabled={!allFilled} onClick={onNext}>
          Tiếp theo <ChevronRight size={14} />
        </Button>
      </div>
      {!allFilled && (
        <p className="text-t3 text-xs text-center mt-2">
          Vui lòng trả lời tất cả {questions.length} câu hỏi trước khi tiếp tục
        </p>
      )}
    </div>
  );
}
