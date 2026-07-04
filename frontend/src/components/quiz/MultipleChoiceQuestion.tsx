import { cn } from "@/lib/utils";

interface MultipleChoiceQuestionProps {
  content: string;
  options: readonly string[];
  selected: number | undefined;
  onSelect: (index: number) => void;
  correctOption?: number;
  readOnly?: boolean;
}

export function MultipleChoiceQuestion({
  content,
  options,
  selected,
  onSelect,
  correctOption,
  readOnly,
}: MultipleChoiceQuestionProps) {
  return (
    <div>
      <p className="text-t1 text-sm font-medium mb-3">{content}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt, oi) => {
          const highlighted =
            selected === oi || (readOnly && correctOption === oi);
          return (
            <button
              key={oi}
              type="button"
              disabled={readOnly}
              onClick={() => onSelect(oi)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg text-sm border transition-all",
                highlighted
                  ? "border-acc-bd bg-acc-muted text-t1"
                  : "border-b1 text-t2 hover:border-b2 hover:text-t1",
                readOnly && "cursor-default",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
