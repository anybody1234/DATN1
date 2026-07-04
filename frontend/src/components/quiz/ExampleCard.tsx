import { Lightbulb } from "lucide-react";
import { EXAMPLE_QUESTIONS, type QuestionType } from "@/lib/quiz-constants";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { FillInBlankQuestion } from "./FillInBlankQuestion";
import { SequenceOrderQuestion } from "./SequenceOrderQuestion";

export function ExampleCard({ type }: { type: QuestionType }) {
  return (
    <div className="border border-b1 rounded-xl bg-s2 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={14} className="text-acc shrink-0" />
        <span className="text-[11px] font-semibold text-acc uppercase tracking-widest">
          Ví dụ minh họa
        </span>
      </div>

      {type === "VOCABULARY" && (
        <FillInBlankQuestion
          content={EXAMPLE_QUESTIONS.VOCABULARY.content}
          value={EXAMPLE_QUESTIONS.VOCABULARY.correctAnswerText}
          onChange={() => {}}
          readOnly
        />
      )}

      {type === "CONTENT" && (
        <MultipleChoiceQuestion
          content={EXAMPLE_QUESTIONS.CONTENT.content}
          options={EXAMPLE_QUESTIONS.CONTENT.options}
          selected={EXAMPLE_QUESTIONS.CONTENT.correctOption}
          onSelect={() => {}}
          correctOption={EXAMPLE_QUESTIONS.CONTENT.correctOption}
          readOnly
        />
      )}

      {type === "SEQUENCE" && (
        <SequenceOrderQuestion
          content={EXAMPLE_QUESTIONS.SEQUENCE.content}
          options={EXAMPLE_QUESTIONS.SEQUENCE.options}
          order={EXAMPLE_QUESTIONS.SEQUENCE.correctOrder}
          onChange={() => {}}
          readOnly
        />
      )}
    </div>
  );
}
