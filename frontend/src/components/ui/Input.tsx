import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm text-t2 font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded-md px-3 py-2.5 text-sm text-t1 placeholder:text-t3",
          "focus:outline-none transition-colors",
          className,
        )}
        style={{
          background: "var(--s1)",
          border: error ? "1px solid var(--acc)" : "1px solid var(--b1)",
        }}
        {...props}
      />
      {error && <p className="text-xs text-acc">{error}</p>}
    </div>
  );
}
