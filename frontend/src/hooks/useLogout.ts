import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export function useLogout(redirectTo = "/") {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  return useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // bỏ qua lỗi mạng — vẫn xóa auth local
    }
    clearAuth();
    navigate(redirectTo);
  }, [clearAuth, navigate, redirectTo]);
}
