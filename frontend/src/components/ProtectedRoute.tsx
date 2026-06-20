import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }
  // Admin không dùng student routes
  if (user?.role === "ADMIN") {
    return <Navigate to="/admin/khoa-hoc" replace />;
  }
  return <Outlet />;
}
