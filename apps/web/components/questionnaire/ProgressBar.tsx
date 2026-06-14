interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div
      className="w-full h-1 bg-surface-deep rounded-full overflow-hidden"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Question ${current} of ${total}`}
    >
      <div
        className="h-full bg-primary-light rounded-full transition-[width] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
