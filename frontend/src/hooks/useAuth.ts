import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import type { ApiResponse, User } from "@/types";

interface AuthData {
  user: User;
  accessToken: string;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { error?: { message?: string } } } })
      ?.response?.data?.error?.message ?? fallback
  );
}

function extractErrorCode(err: unknown): string | undefined {
  return (err as { response?: { data?: { error?: { code?: string } } } })
    ?.response?.data?.error?.code;
}

export function useLoginMutation() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ??
    "/dashboard";

  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api
        .post<ApiResponse<AuthData>>("/auth/login", body)
        .then((r) => r.data.data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      const dest = data.user.role === "ADMIN" ? "/admin/khoa-hoc" : from;
      navigate(dest, { replace: true });
    },
  });
}

export function useRegisterMutation() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api
        .post<ApiResponse<AuthData>>("/auth/register", body)
        .then((r) => r.data.data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      navigate("/dashboard");
    },
  });
}

export { extractErrorMessage, extractErrorCode };
