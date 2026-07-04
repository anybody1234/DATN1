import type { ReactNode } from "react";
import { CARD_STYLE, DIVIDER_STYLE, AUTH_FONT } from "@/lib/auth-styles";

interface AuthCardProps {
  heading: string;
  subheading: string;
  children: ReactNode;
}

/** Wrapper dùng chung cho LoginPage và RegisterPage */
export function AuthCard({ heading, subheading, children }: AuthCardProps) {
  return (
    <div className="auth-scene">
      <div
        className="auth-card relative z-10 w-full max-w-[400px] rounded-2xl p-6"
        style={CARD_STYLE}
      >
        {/* Brand mark */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          <span
            className="font-jp font-bold leading-none"
            style={{ color: "var(--acc)", fontSize: AUTH_FONT.brandJp }}
          >
            日本語
          </span>
          <span
            className="font-bold leading-none text-t1 heading-tight"
            style={{ fontSize: AUTH_FONT.brandEn }}
          >
            Flow
          </span>
        </div>

        <h1
          className="font-serif text-t1 text-center mb-2"
          style={{
            fontSize: AUTH_FONT.heading,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {heading}
        </h1>

        <p
          className="text-center mb-5 text-t3"
          style={{ fontSize: AUTH_FONT.subheading, letterSpacing: "0.02em" }}
        >
          {subheading}
        </p>

        <div style={DIVIDER_STYLE} className="mb-5" />

        {children}
      </div>
    </div>
  );
}
