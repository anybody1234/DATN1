import { useState } from "react";
import { Link } from "react-router-dom";
import { BTN_STYLE, BTN_DISABLED_STYLE, LABEL_STYLE } from "@/lib/auth-styles";
import { AuthCard } from "@/components/AuthCard";
import { useLoginMutation, extractErrorMessage } from "@/hooks/useAuth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useLoginMutation();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    login.mutate(
      { email, password },
      {
        onError: (err) =>
          setError(
            extractErrorMessage(err, "Đăng nhập thất bại. Vui lòng thử lại."),
          ),
      },
    );
  };

  return (
    <AuthCard
      heading="Chào mừng trở lại"
      subheading="Đăng nhập để tiếp tục hành trình tiếng Nhật"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" style={LABEL_STYLE}>
            Địa chỉ Email
          </label>
          <input
            id="login-email"
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" style={LABEL_STYLE}>
            Mật khẩu
          </label>
          <input
            id="login-password"
            className="auth-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              background: "var(--acc-muted)",
              border: "1px solid var(--acc-bd)",
              color: "var(--acc)",
              letterSpacing: "0.01em",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity mt-1"
          style={login.isPending ? BTN_DISABLED_STYLE : BTN_STYLE}
        >
          {login.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Đang xử lý…
            </span>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>

      <p className="text-center mt-4 text-t3" style={{ fontSize: 11 }}>
        Chưa có tài khoản?{" "}
        <Link to="/dang-ky" className="auth-link">
          Tạo tài khoản miễn phí →
        </Link>
      </p>
    </AuthCard>
  );
}
