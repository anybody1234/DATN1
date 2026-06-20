import type { ElementType } from "react";
import { BookOpen, FileText, ListOrdered } from "lucide-react";

export type QuestionType = "VOCABULARY" | "CONTENT" | "SEQUENCE";

export const QUESTION_SECTION_ORDER: QuestionType[] = [
  "VOCABULARY",
  "CONTENT",
  "SEQUENCE",
];

export const QUESTION_SECTION_META: Record<
  QuestionType,
  { label: string; Icon: ElementType }
> = {
  VOCABULARY: { label: "Từ vựng", Icon: BookOpen },
  CONTENT: { label: "Nội dung bài học", Icon: FileText },
  SEQUENCE: { label: "Trình tự sự kiện", Icon: ListOrdered },
};

// Câu ví dụ tĩnh hiển thị đầu mỗi trang quiz để minh họa cách làm —
// không lấy từ DB, không tính điểm.
export const EXAMPLE_QUESTIONS = {
  VOCABULARY: {
    content: "Ví dụ: Chữ 「火」 đọc là gì?",
    options: ["かじ", "ひ", "みず", "つき"],
    correctOption: 1,
  },
  CONTENT: {
    content: "Ví dụ: 今日は＿＿＿です。 (hôm nay là thứ Hai)",
    correctAnswerText: "げつようび",
  },
  SEQUENCE: {
    content: "Ví dụ: Hãy click theo đúng thứ tự diễn ra trong video",
    options: ["Mở cửa", "Bước vào nhà", "Cởi giày", "Chào hỏi"],
    correctOrder: [0, 1, 2, 3],
  },
} as const;
