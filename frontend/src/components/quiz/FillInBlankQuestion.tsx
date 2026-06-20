import { cn } from "@/lib/utils";

interface FillInBlankQuestionProps {
  content: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function FillInBlankQuestion({
  content,
  value,
  onChange,
  readOnly,
}: FillInBlankQuestionProps) {
  return (
    <div>
      <p className="text-t1 text-sm font-medium mb-3">{content}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder="Nhập câu trả lời..."
        className={cn(
          "w-full bg-s2 border border-b1 rounded-lg px-3 py-2.5 text-t1 text-sm outline-none focus:border-acc transition-colors",
          readOnly && "cursor-default",
        )}
      />
    </div>
  );
}
