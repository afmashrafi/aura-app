import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ elevated = true, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-[20px] ${
        elevated ? "shadow-[0_2px_16px_rgba(124,58,237,0.07)]" : "border border-divider"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
