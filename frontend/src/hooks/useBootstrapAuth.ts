import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

/**
 * Chạy một lần khi app mount: nếu user có trong store nhưng chưa có token
 * (sau khi reload trang) → gọi refresh để lấy lại access token.
 *
 * Dùng raw axios (không phải api instance) để tránh interceptor 401
 * kích hoạt đệ quy refresh → refresh vô tận khi cookie hết hạn.
 */
export function useBootstrapAuth() {
  const [initializing, setInitializing] = useState(
    () =>
      !!useAuthStore.getState().user && !useAuthStore.getState().accessToken,
  );

  useEffect(() => {
    if (!initializing) return;
    let cancelled = false;

    axios
      .post(`${BASE}/auth/refresh`, {}, { withCredentials: true })
      .then((r) => {
        if (!cancelled)
          useAuthStore.getState().setAccessToken(r.data.data.accessToken);
      })
      .catch(() => {
        if (!cancelled) useAuthStore.getState().clearAuth();
      })
      .finally(() => {
        if (!cancelled) setInitializing(false);
      });

    return () => {
      cancelled = true;
    };
  }, []); // chỉ chạy 1 lần khi mount

  return initializing;
}
