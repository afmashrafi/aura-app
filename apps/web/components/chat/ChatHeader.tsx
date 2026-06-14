import Link from "next/link";

interface ChatHeaderProps {
  partnerName: string;
  sharedCategory?: string;
  isNew?: boolean;
}

export function ChatHeader({ partnerName, sharedCategory, isNew = false }: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-divider">
      {/* Nav bar */}
      <div className="flex items-center gap-3 px-4 h-14">
        <Link
          href="/matches"
          className="text-ink-muted hover:text-ink transition-colors"
          aria-label="Back to matches"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="w-9 h-9 rounded-full bg-primary-pale flex items-center justify-center font-display font-semibold text-primary text-base">
          {partnerName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-ink text-base leading-tight">{partnerName}</p>
          <p className="text-xs text-ink-muted">Personality match</p>
        </div>
      </div>

      {/* New match banner */}
      {isNew && sharedCategory && (
        <div className="px-4 py-2.5 bg-primary-pale border-t border-primary-pale">
          <p className="text-sm text-primary text-center">
            You matched because you both value{" "}
            <span className="font-medium">&ldquo;{sharedCategory}&rdquo;</span>
          </p>
        </div>
      )}
    </div>
  );
}
