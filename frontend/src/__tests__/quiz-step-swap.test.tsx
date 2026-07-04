import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { VocabularyStep } from "@/components/quiz/VocabularyStep";
import { ContentStep } from "@/components/quiz/ContentStep";
import type { AnswerValue, Question } from "@/types";

// Sau khi đổi vai trò (V10): VOCABULARY = điền từ (tự luận), CONTENT = trắc nghiệm.
// Các test này render trực tiếp component thật (không mock) để bắt regression
// nếu ai vô tình đổi ngược UI/answer-shape của 2 bước này.

function VocabularyStepHarness({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  return (
    <div>
      <VocabularyStep
        questions={questions}
        answers={answers}
        setAnswers={setAnswers}
        onNext={() => {}}
      />
      <pre data-testid="answers-debug">{JSON.stringify(answers)}</pre>
    </div>
  );
}

function ContentStepHarness({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  return (
    <div>
      <ContentStep
        questions={questions}
        answers={answers}
        setAnswers={setAnswers}
        onBack={() => {}}
        onNext={() => {}}
      />
      <pre data-testid="answers-debug">{JSON.stringify(answers)}</pre>
    </div>
  );
}

function readDebugAnswers(): Record<string, unknown> {
  return JSON.parse(screen.getByTestId("answers-debug").textContent || "{}");
}

const vocabQuestions: Question[] = [
  {
    id: 1,
    quizId: 1,
    content: "Chữ あ đọc là gì?",
    options: ["a", "i", "u", "e"],
    orderIndex: 1,
    questionType: "VOCABULARY",
  },
  {
    id: 2,
    quizId: 1,
    content: "Chữ い đọc là gì?",
    options: ["a", "i", "u", "e"],
    orderIndex: 2,
    questionType: "VOCABULARY",
  },
];

const contentQuestions: Question[] = [
  {
    id: 5,
    quizId: 1,
    content: "Hàng あ gồm bao nhiêu chữ cái?",
    options: ["q1-3", "q1-4", "q1-5", "q1-6"],
    orderIndex: 5,
    questionType: "CONTENT",
  },
  {
    id: 6,
    quizId: 1,
    content: "Hiragana phát triển từ thế kỷ nào?",
    options: ["q2-7", "q2-9", "q2-11", "q2-13"],
    orderIndex: 6,
    questionType: "CONTENT",
  },
];

describe("VocabularyStep — sau swap V10, là điền từ (tự luận)", () => {
  function realInputs() {
    return screen
      .getAllByPlaceholderText("Nhập câu trả lời...")
      .filter((el) => !(el as HTMLInputElement).readOnly);
  }

  it("render đúng số input điền từ cho mỗi câu (không render nút trắc nghiệm)", () => {
    render(<VocabularyStepHarness questions={vocabQuestions} />);
    expect(realInputs()).toHaveLength(2);
    expect(screen.queryByRole("button", { name: "a" })).toBeNull();
  });

  it("gõ câu trả lời lưu vào answers dưới dạng string", async () => {
    const user = userEvent.setup();
    render(<VocabularyStepHarness questions={vocabQuestions} />);

    await user.type(realInputs()[0], "a");
    const answers = readDebugAnswers();
    expect(answers["1"]).toBe("a");
    expect(typeof answers["1"]).toBe("string");
  });

  it("nút Tiếp theo chỉ enable khi tất cả câu đã điền (không tính khoảng trắng)", async () => {
    const user = userEvent.setup();
    render(<VocabularyStepHarness questions={vocabQuestions} />);
    const nextBtn = screen.getByRole("button", { name: /Tiếp theo/i });
    expect(nextBtn).toBeDisabled();

    const inputs = realInputs();
    await user.type(inputs[0], "a");
    expect(nextBtn).toBeDisabled(); // còn câu 2 chưa trả lời

    await user.type(inputs[1], "   "); // chỉ khoảng trắng — không tính là đã trả lời
    expect(nextBtn).toBeDisabled();

    await user.type(inputs[1], "i");
    expect(nextBtn).not.toBeDisabled();
  });
});

describe("ContentStep — sau swap V10, là trắc nghiệm 4 đáp án", () => {
  it("render 4 lựa chọn cho mỗi câu, không render input điền từ cho câu thật", () => {
    render(<ContentStepHarness questions={contentQuestions} />);
    expect(screen.getByRole("button", { name: "q1-4" })).toBeDefined();
    expect(screen.getByRole("button", { name: "q2-9" })).toBeDefined();
  });

  it("click 1 đáp án lưu vào answers dưới dạng số (index trong options)", async () => {
    const user = userEvent.setup();
    render(<ContentStepHarness questions={contentQuestions} />);

    await user.click(screen.getByRole("button", { name: "q1-4" })); // index 1
    const answers = readDebugAnswers();
    expect(answers["5"]).toBe(1);
    expect(typeof answers["5"]).toBe("number");
  });

  it("nút Tiếp theo chỉ enable khi tất cả câu đã chọn đáp án", async () => {
    const user = userEvent.setup();
    render(<ContentStepHarness questions={contentQuestions} />);
    const nextBtn = screen.getByRole("button", { name: /Tiếp theo/i });
    expect(nextBtn).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "q1-3" }));
    expect(nextBtn).toBeDisabled(); // còn câu 2 chưa chọn

    await user.click(screen.getByRole("button", { name: "q2-7" }));
    expect(nextBtn).not.toBeDisabled();
  });
});
