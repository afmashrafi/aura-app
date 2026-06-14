"use client";

import { type ButtonHTMLAttributes } from "react";

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  as?: "button" | "span";
}

export function Pill({
  selected = false,
  as: Tag = "button",
  className = "",
  children,
  ...props
}: PillProps) {
  const base =
    "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 select-none";

  const style = selected
    ? "bg-primary-pale text-primary border border-primary"
    : "bg-surface text-ink-secondary border border-divider hover:border-primary-light hover:text-primary active:scale-[0.96]";

  if (Tag === "span") {
    return (
      <span className={`${base} ${style} ${className}`}>
        {selected && (
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7l3 3 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {children}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`${base} ${style} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${className}`}
      {...props}
    >
      {selected && (
        <svg
          className="w-3.5 h-3.5 shrink-0 transition-all duration-150"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M2.5 7l3 3 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
