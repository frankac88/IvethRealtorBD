import type { LuxuryProject } from "@/features/projects/luxuryPlaceholderCatalog";
import { cn } from "@/lib/utils";

const toneClassNames: Record<LuxuryProject["gallery"][number]["tone"], string> = {
  sand: "from-[#d8c2a3] via-[#c8b18d] to-[#8a5579]",
  teal: "from-[#d7c1a4] via-primary/55 to-primary",
  wine: "from-[#d8c2a3] via-accent/65 to-wine",
  sage: "from-[#d8c2a3] via-[#aebfaf] to-primary/75",
};

export function ProjectImagePlaceholder({
  label,
  tone = "sand",
  className,
  compact = false,
  imageUrl,
}: {
  label: string;
  tone?: LuxuryProject["gallery"][number]["tone"];
  className?: string;
  compact?: boolean;
  imageUrl?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border border-gold/35 bg-gradient-to-br shadow-[0_28px_80px_rgba(26,31,46,0.14)]",
        toneClassNames[tone],
        className,
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={label}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.34),transparent_28%),linear-gradient(135deg,transparent,rgba(26,31,46,0.18))]" />
      <div className="absolute inset-3 border border-white/45" />
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
        <span className="bg-background/90 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-wine shadow-sm">
          {label}
        </span>
        {!compact ? (
          <span className="hidden h-px flex-1 bg-white/60 sm:block" />
        ) : null}
      </div>
    </div>
  );
}
