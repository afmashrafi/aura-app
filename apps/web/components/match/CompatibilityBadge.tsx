interface CompatibilityBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export function CompatibilityBadge({ score, size = "md" }: CompatibilityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium text-primary bg-primary-pale ${
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3.5 py-1 text-sm"
      }`}
    >
      {score}% compatible
    </span>
  );
}
