import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-acc text-white hover:bg-acc-hover active:scale-[0.98]",
    ghost: "text-t2 hover:text-t1 hover:bg-s1 active:scale-[0.98]",
    outline:
      "border border-b1 text-t1 hover:border-b2 hover:bg-s1 active:scale-[0.98]",
    danger:
      "border border-[#3a1a1f] text-[#e94560] hover:bg-[rgba(233,69,96,0.1)] active:scale-[0.98]",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-sm px-6 py-2.5",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
