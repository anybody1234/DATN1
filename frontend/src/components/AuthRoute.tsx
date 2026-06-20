import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/** Chặn user đã đăng nhập vào trang login/register */
export function AuthRoute() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated()) return <Outlet />;
  return (
    <Navigate
      to={user?.role === "ADMIN" ? "/admin/khoa-hoc" : "/dashboard"}
      replace
    />
  );
}
