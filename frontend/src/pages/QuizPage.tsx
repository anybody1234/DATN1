import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VocabularyStep } from "@/components/quiz/VocabularyStep";
import { ContentStep } from "@/components/quiz/ContentStep";
import { SequenceStep } from "@/components/quiz/SequenceStep";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { useEnrollment, useCourseLessons } from "@/hooks/useCourse";
import { useLessonDetail } from "@/hooks/useLesson";
import { useQuiz } from "@/hooks/useQuiz";
import type { AnswerValue } from "@/types";

const NEXT_LESSON_DELAY_MS = 1500;

type QuizStep = "vocab" | "content" | "sequence";

export function QuizPage() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const [shouldNavigateNext, setShouldNavigateNext] = useState(false);
  const [step, setStep] = useState<QuizStep>("vocab");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: isEnrolled } = useEnrollment(courseId);
  const { data: lesson, isLoading: lessonLoading } = useLessonDetail(lessonId);
  const {
    data: quiz,
    isLoading: quizLoading,
    isError: quizError,
  } = useQuiz(lessonId);
  const { data: lessons = [] } = useCourseLessons(courseId);

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentIdx = lessons.findIndex((l) => l.id === Number(lessonId));
  const nextLesson =
    currentIdx >= 0 && currentIdx < lessons.length - 1
      ? lessons[currentIdx + 1]
      : null;

  const sortedQuestions = quiz
    ? [...quiz.questions].sort((a, b) => a.orderIndex - b.orderIndex)
    : [];
  const vocabularyQuestions = sortedQuestions.filter(
    (q) => q.questionType === "VOCABULARY",
  );
  const contentQuestions = sortedQuestions.filter(
    (q) => q.questionType === "CONTENT",
  );
  const sequenceQuestions = sortedQuestions.filter(
    (q) => q.questionType === "SEQUENCE",
  );

  // ── Effects (phải ở trên guard để không vi phạm Rules of Hooks) ───────────
  useEffect(() => {
    if (isEnrolled === false) {
      navigate(`/khoa-hoc/${courseId}`, { replace: true });
    }
  }, [isEnrolled, courseId, navigate]);

  useEffect(() => {
    if (!shouldNavigateNext || !nextLesson) return;
    const id = setTimeout(() => {
      navigate(`/khoa-hoc/${courseId}/bai-hoc/${nextLesson.id}`);
    }, NEXT_LESSON_DELAY_MS);
    return () => clearTimeout(id);
  }, [shouldNavigateNext, nextLesson, navigate, courseId]);

  // ── Guard (sau tất cả hooks) ──────────────────────────────────────────────
  if (!courseId || !lessonId) return null;

  const handlePassed = () => {
    if (nextLesson) setShouldNavigateNext(true);
  };

  // Reset khi retry — tránh bug shouldNavigateNext=true vĩnh viễn
  const handleRetry = () => {
    setShouldNavigateNext(false);
    setStep("vocab");
    setAnswers({});
  };

  const isLoading = lessonLoading || quizLoading;

  // ── Render ────────────────────────────────────────────────────────────────
  if (quizError) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-20 text-center">
        <AlertCircle size={36} className="text-t3 mx-auto mb-4" />
        <p className="text-t1 font-semibold mb-2">Không có bài kiểm tra</p>
        <p className="text-t3 text-sm mb-6">
          Bài học này chưa có quiz. Vui lòng tiếp tục bài tiếp theo.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/khoa-hoc/${courseId}`)}
          >
            <ChevronLeft size={14} /> Quay lại khoá học
          </Button>
          {nextLesson && (
            <Button
              onClick={() =>
                navigate(`/khoa-hoc/${courseId}/bai-hoc/${nextLesson.id}`)
              }
            >
              Bài tiếp theo <ChevronRight size={14} />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <button
        onClick={() => navigate(`/khoa-hoc/${courseId}`)}
        className="flex items-center gap-1.5 text-t3 text-xs hover:text-t2 transition-colors mb-6"
      >
        <ChevronLeft size={14} /> Quay lại khoá học
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-acc-muted flex items-center justify-center shrink-0">
          <ClipboardList size={16} className="text-acc" />
        </div>
        <div>
          {isLoading ? (
            <div className="h-4 bg-s1 rounded w-48 animate-pulse" />
          ) : (
            <>
              <p className="text-t3 text-xs mb-0.5">Kiểm tra bài học</p>
              <h1
                className="text-t1 text-lg font-bold"
                style={{ letterSpacing: "-0.02em" }}
              >
                {lesson?.title}
              </h1>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="border border-b1 rounded-xl bg-s1 p-6 animate-pulse">
          <div className="h-4 bg-s2 rounded w-1/3 mb-4" />
          <div className="h-3 bg-s2 rounded w-full mb-2" />
          <div className="h-3 bg-s2 rounded w-4/5" />
        </div>
      ) : quiz ? (
        <>
          {step === "vocab" && (
            <VocabularyStep
              questions={vocabularyQuestions}
              answers={answers}
              setAnswers={setAnswers}
              onNext={() => setStep("content")}
            />
          )}
          {step === "content" && (
            <ContentStep
              questions={contentQuestions}
              answers={answers}
              setAnswers={setAnswers}
              onBack={() => setStep("vocab")}
              onNext={() => setStep("sequence")}
            />
          )}
          {step === "sequence" && (
            <SequenceStep
              questions={sequenceQuestions}
              answers={answers}
              setAnswers={setAnswers}
              quizId={quiz.id}
              passScore={quiz.passScore}
              lessonId={Number(lessonId)}
              courseId={courseId}
              onBack={() => setStep("content")}
              onPassed={handlePassed}
              onRetry={handleRetry}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
