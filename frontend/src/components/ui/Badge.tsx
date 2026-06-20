import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "acc" | "success" | "muted";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-s2 border border-b1 text-t2",
    acc: "bg-acc-muted border border-acc-bd text-acc",
    success: "bg-ok-muted border border-ok-bd text-ok",
    muted: "bg-s1 text-t3",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
