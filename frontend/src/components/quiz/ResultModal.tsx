import { CheckCircle, XCircle, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { QuizAttempt } from "@/types";

export function ResultModal({
  result,
  passScore,
  onDashboard,
  onDismiss,
  onRetry,
}: {
  result: QuizAttempt;
  passScore: number;
  onDashboard: () => void; // nút "Quay lại tổng quan" → navigate
  onDismiss: () => void; // nút X → chỉ đóng modal, không navigate
  onRetry: () => void;
}) {
  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="modal-surface relative w-full max-w-[400px] rounded-2xl border border-b2 p-8 text-center">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-t3 hover:text-t2 transition-colors"
        >
          <X size={16} />
        </button>

        {result.passed ? (
          <div className="w-16 h-16 rounded-full bg-ok-muted border border-ok-bd flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-ok" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-acc-muted border border-acc-bd flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} className="text-acc" />
          </div>
        )}

        <h2 className="heading-tight text-t1 text-2xl font-bold mb-1">
          {result.passed ? "Xuất sắc!" : "Chưa đạt!"}
        </h2>
        <p className="text-t3 text-sm mb-6">
          {result.passed
            ? "Bạn đã vượt qua bài kiểm tra."
            : "Hãy cố gắng hơn ở lần sau."}
        </p>

        <div
          className="rounded-xl border p-5 mb-6"
          style={{
            borderColor: result.passed ? "var(--ok-bd)" : "var(--acc-bd)",
            background: result.passed ? "var(--ok-muted)" : "var(--acc-muted)",
          }}
        >
          <div
            className="text-5xl font-bold mb-1"
            style={{
              color: result.passed ? "var(--ok)" : "var(--acc)",
              letterSpacing: "-0.04em",
            }}
          >
            {result.score}%
          </div>
          <div className="text-t3 text-xs">Điểm đạt yêu cầu: {passScore}%</div>
        </div>

        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={onDashboard}>
            Quay lại trang tổng quan
          </Button>
          {!result.passed && (
            <Button variant="outline" className="w-full" onClick={onRetry}>
              <RotateCcw size={14} /> Làm lại
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
