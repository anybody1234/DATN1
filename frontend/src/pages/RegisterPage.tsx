import { useState } from "react";
import { Link } from "react-router-dom";
import { BTN_STYLE, BTN_DISABLED_STYLE, LABEL_STYLE } from "@/lib/auth-styles";
import { AuthCard } from "@/components/AuthCard";
import { useRegisterMutation, extractErrorCode } from "@/hooks/useAuth";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const register = useRegisterMutation();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    register.mutate(
      { email, password },
      {
        onError: (err) => {
          const code = extractErrorCode(err);
          setError(
            code === "DUPLICATE_EMAIL"
              ? "Email này đã được sử dụng. Vui lòng chọn email khác."
              : "Đăng ký thất bại. Vui lòng thử lại.",
          );
        },
      },
    );
  };

  return (
    <AuthCard
      heading="Tạo tài khoản mới"
      subheading="Bắt đầu hành trình tiếng Nhật ngay hôm nay"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-email" style={LABEL_STYLE}>
            Địa chỉ Email
          </label>
          <input
            id="reg-email"
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
          <label htmlFor="reg-password" style={LABEL_STYLE}>
            Mật khẩu
          </label>
          <input
            id="reg-password"
            className="auth-input"
            type="password"
            placeholder="Tối thiểu 8 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-confirm" style={LABEL_STYLE}>
            Xác nhận mật khẩu
          </label>
          <input
            id="reg-confirm"
            className="auth-input"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
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
          disabled={register.isPending}
          className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity mt-1"
          style={register.isPending ? BTN_DISABLED_STYLE : BTN_STYLE}
        >
          {register.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Đang tạo tài khoản…
            </span>
          ) : (
            "Tạo tài khoản"
          )}
        </button>
      </form>

      <p className="text-center mt-4 text-t3" style={{ fontSize: 11 }}>
        Đã có tài khoản?{" "}
        <Link to="/dang-nhap" className="auth-link">
          Đăng nhập →
        </Link>
      </p>
    </AuthCard>
  );
}
