import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { AnswerValue, Question } from "@/types";
import { ExampleCard } from "./ExampleCard";
import { VocabularyQuestion } from "./VocabularyQuestion";

export function VocabularyStep({
  questions,
  answers,
  setAnswers,
  onNext,
}: {
  questions: Question[];
  answers: Record<string, AnswerValue>;
  setAnswers: (
    updater: (prev: Record<string, AnswerValue>) => Record<string, AnswerValue>,
  ) => void;
  onNext: () => void;
}) {
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="border border-b1 rounded-xl bg-s1 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-t1 font-semibold text-sm">Từ vựng</h3>
        <Badge variant="muted">{questions.length} câu hỏi</Badge>
      </div>

      <ExampleCard type="VOCABULARY" />

      <div className="flex flex-col gap-5 mb-2">
        {questions.map((q, i) => (
          <VocabularyQuestion
            key={q.id}
            content={`${i + 1}. ${q.content}`}
            options={q.options}
            selected={answers[q.id] as number | undefined}
            onSelect={(oi) => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
          />
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button disabled={!allAnswered} onClick={onNext}>
          Tiếp theo <ChevronRight size={14} />
        </Button>
      </div>
      {!allAnswered && (
        <p className="text-t3 text-xs text-center mt-2">
          Vui lòng trả lời tất cả {questions.length} câu hỏi trước khi tiếp tục
        </p>
      )}
    </div>
  );
}
