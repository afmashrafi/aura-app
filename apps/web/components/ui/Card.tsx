import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ elevated = true, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-[20px] glass ${elevated ? "" : "border border-divider"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
