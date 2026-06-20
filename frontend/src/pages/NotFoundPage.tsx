import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div
        className="text-8xl font-bold text-b2 mb-4"
        style={{ letterSpacing: "-0.05em" }}
      >
        404
      </div>
      <h1 className="text-t1 text-xl font-semibold mb-2">
        Trang không tồn tại
      </h1>
      <p className="text-t3 text-sm mb-8 max-w-xs">
        Trang bạn tìm kiếm đã bị xoá hoặc đường dẫn không chính xác.
      </p>
      <Button onClick={() => navigate("/")}>Về trang chủ</Button>
    </div>
  );
}
