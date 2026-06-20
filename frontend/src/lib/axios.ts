import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

const api = axios.create({ baseURL: BASE, withCredentials: true });

// Singleton refresh promise — prevents race condition khi nhiều request cùng nhận 401
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${BASE}/auth/refresh`, {}, { withCredentials: true })
          .then((r) => r.data.data.accessToken)
          .finally(() => {
            refreshPromise = null;
          });
      }
      try {
        const token = await refreshPromise;
        useAuthStore.getState().setAccessToken(token);
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        useAuthStore.getState().clearAuth();
        window.location.href = "/dang-nhap";
      }
    }
    return Promise.reject(err);
  },
);

export default api;
