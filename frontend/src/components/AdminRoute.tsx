import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function AdminRoute() {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated()) return <Navigate to="/dang-nhap" replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
