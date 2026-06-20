import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setAuth: (user, token) => set({ user, accessToken: token }),
      // Dùng bởi axios interceptor khi refresh thành công
      setAccessToken: (token) => set({ accessToken: token }),
      clearAuth: () => set({ user: null, accessToken: null }),
      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: "nihongoflow-auth",
      // Chỉ persist user (display name/greeting), KHÔNG persist accessToken
      // Token 15 phút không nên sống qua page refresh — refresh cookie sẽ
      // cấp token mới khi cần.
      partialize: (s) => ({ user: s.user }),
    },
  ),
);
