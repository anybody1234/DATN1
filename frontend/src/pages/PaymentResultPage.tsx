import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PaymentResultPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const success = params.get("success") === "true";
  const courseId = params.get("courseId");

  // Sau khi VNPay redirect về, backend đã enroll — invalidate để course không còn locked
  useEffect(() => {
    if (success && courseId) {
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    }
  }, [success, courseId, queryClient]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div
        className="w-full max-w-[420px] rounded-2xl border border-b2 p-8 text-center"
        style={{ background: "var(--s1)" }}
      >
        {success ? (
          <>
            <div className="w-16 h-16 rounded-full bg-acc/10 border border-acc/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-acc" />
            </div>
            <h1 className="text-t1 text-xl font-bold mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-t2 text-sm mb-6">
              Khoá học đã được thêm vào tài khoản của bạn. Bắt đầu học ngay
              thôi!
            </p>
            <div className="flex flex-col gap-2">
              {courseId && (
                <Button
                  className="w-full"
                  onClick={() => navigate(`/khoa-hoc/${courseId}`)}
                >
                  Vào học ngay
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                Về tổng quan
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-acc/10 border border-acc/30 flex items-center justify-center mx-auto mb-5">
              <XCircle size={32} className="text-acc" />
            </div>
            <h1 className="text-t1 text-xl font-bold mb-2">
              Thanh toán thất bại
            </h1>
            <p className="text-t2 text-sm mb-6">
              Giao dịch không thành công hoặc đã bị huỷ. Vui lòng thử lại.
            </p>
            <div className="flex flex-col gap-2">
              {courseId && (
                <Button
                  className="w-full"
                  onClick={() => navigate(`/khoa-hoc/${courseId}`)}
                >
                  Thử lại
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/khoa-hoc")}
              >
                Xem khoá học khác
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
