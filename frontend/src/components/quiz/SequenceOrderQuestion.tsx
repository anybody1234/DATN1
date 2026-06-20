import { cn } from "@/lib/utils";

interface SequenceOrderQuestionProps {
  content: string;
  options: readonly string[];
  /** Mảng index của options theo thứ tự đã click — vị trí trong mảng = thứ tự (1-based khi hiển thị) */
  order: readonly number[];
  onChange: (order: number[]) => void;
  readOnly?: boolean;
}

export function SequenceOrderQuestion({
  content,
  options,
  order,
  onChange,
  readOnly,
}: SequenceOrderQuestionProps) {
  const handleClick = (optionIndex: number) => {
    if (readOnly) return;
    const pos = order.indexOf(optionIndex);
    if (pos !== -1) {
      onChange(order.filter((i) => i !== optionIndex));
    } else if (order.length < options.length) {
      onChange([...order, optionIndex]);
    }
  };

  return (
    <div>
      <p className="text-t1 text-sm font-medium mb-1">{content}</p>
      <p className="text-t3 text-xs mb-3">
        Bấm vào các đáp án theo đúng thứ tự — bấm lại để bỏ chọn.
      </p>
      <div className="flex flex-col gap-2">
        {options.map((opt, oi) => {
          const pos = order.indexOf(oi);
          const isSelected = pos !== -1;
          return (
            <button
              key={oi}
              type="button"
              disabled={readOnly}
              onClick={() => handleClick(oi)}
              className={cn(
                "w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-sm border transition-all",
                isSelected
                  ? "border-acc-bd bg-acc-muted text-t1"
                  : "border-b1 text-t2 hover:border-b2 hover:text-t1",
                readOnly && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-semibold shrink-0",
                  isSelected
                    ? "border-acc bg-acc text-white"
                    : "border-b2 text-t3",
                )}
              >
                {isSelected ? pos + 1 : ""}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
