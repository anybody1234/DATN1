import type { CSSProperties } from "react";

export const CARD_STYLE: CSSProperties = {
  background:
    "linear-gradient(rgba(10,10,10,0.86), rgba(6,6,6,0.94)) padding-box, " +
    "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.03) 55%, rgba(255,255,255,0.01) 100%) border-box",
  border: "0.75px solid transparent",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow:
    "0 0 0 1px rgba(255,255,255,0.04) inset, " +
    "0 50px 120px rgba(0,0,0,0.95), " +
    "0 20px 50px rgba(0,0,0,0.8), " +
    "0 6px 16px rgba(0,0,0,0.65)",
};

export const BTN_STYLE: CSSProperties = {
  background:
    "linear-gradient(180deg, var(--acc-light, #f35070) 0%, var(--acc) 100%)",
  border: "1px solid rgba(255,255,255,0.16)",
  borderBottomColor: "rgba(180,40,60,0.55)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.14), " +
    "0 4px 20px rgba(233,69,96,0.35), " +
    "0 2px 6px rgba(233,69,96,0.2)",
};

export const BTN_DISABLED_STYLE: CSSProperties = {
  background: "rgba(233,69,96,0.35)", // var(--acc) at 35% opacity — rgba needed for gradient compat
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "none",
};

export const DIVIDER_STYLE: CSSProperties = {
  height: 1,
  background:
    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent 100%)",
};

export const LABEL_STYLE: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.09em",
  color: "var(--t3)",
  textTransform: "uppercase",
};

/** Font sizes cho AuthCard — tập trung ở đây để dễ điều chỉnh */
export const AUTH_FONT = {
  brandJp: 14, // "日本語" brand mark
  brandEn: 12, // "Flow" brand mark
  heading: 32, // h1 tiêu đề trang
  subheading: 12, // mô tả dưới tiêu đề (min 12px theo design rules)
} as const;
