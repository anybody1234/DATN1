import type { ElementType } from "react";
import { BookOpen, FileText, ListOrdered } from "lucide-react";
import type { QuestionReview } from "@/types";

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
export function isReviewQuestionCorrect(q: QuestionReview): boolean {
  switch (q.questionType) {
    case "CONTENT":
      return q.selectedAnswer === q.correctOption;
    case "VOCABULARY":
      return (
        typeof q.selectedAnswer === "string" &&
        q.correctAnswerText != null &&
        q.selectedAnswer.trim().toLowerCase() ===
          q.correctAnswerText.trim().toLowerCase()
      );
    case "SEQUENCE":
      return (
        Array.isArray(q.selectedAnswer) &&
        JSON.stringify(q.selectedAnswer) === JSON.stringify(q.correctOrder)
      );
    default:
      return false;
  }
}

export const EXAMPLE_QUESTIONS = {
  VOCABULARY: {
    content: "Ví dụ: Chữ 「火」 đọc là gì?",
    correctAnswerText: "ひ",
  },
  CONTENT: {
    content: "Ví dụ: Hôm nay là thứ mấy?",
    options: ["げつようび", "かようび", "すいようび", "もくようび"],
    correctOption: 0,
  },
  SEQUENCE: {
    content: "Ví dụ: Hãy click theo đúng thứ tự diễn ra trong video",
    options: ["Mở cửa", "Bước vào nhà", "Cởi giày", "Chào hỏi"],
    correctOrder: [0, 1, 2, 3],
  },
} as const;
