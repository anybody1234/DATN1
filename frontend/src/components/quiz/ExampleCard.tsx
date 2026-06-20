import { Lightbulb } from "lucide-react";
import { EXAMPLE_QUESTIONS, type QuestionType } from "@/lib/quiz-constants";
import { VocabularyQuestion } from "./VocabularyQuestion";
import { FillInBlankQuestion } from "./FillInBlankQuestion";
import { SequenceOrderQuestion } from "./SequenceOrderQuestion";

export function ExampleCard({ type }: { type: QuestionType }) {
  const example = EXAMPLE_QUESTIONS[type];

  return (
    <div className="border border-b1 rounded-xl bg-s2 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={14} className="text-acc shrink-0" />
        <span className="text-[11px] font-semibold text-acc uppercase tracking-widest">
          Ví dụ minh họa
        </span>
      </div>

      {type === "VOCABULARY" && (
        <VocabularyQuestion
          content={example.content}
          options={example.options}
          selected={example.correctOption}
          onSelect={() => {}}
          correctOption={example.correctOption}
          readOnly
        />
      )}

      {type === "CONTENT" && (
        <FillInBlankQuestion
          content={example.content}
          value={example.correctAnswerText}
          onChange={() => {}}
          readOnly
        />
      )}

      {type === "SEQUENCE" && (
        <SequenceOrderQuestion
          content={example.content}
          options={example.options}
          order={example.correctOrder}
          onChange={() => {}}
          readOnly
        />
      )}
    </div>
  );
}
