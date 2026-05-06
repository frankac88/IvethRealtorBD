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
  interactive = false,
}: {
  label: string;
  tone?: LuxuryProject["gallery"][number]["tone"];
  className?: string;
  compact?: boolean;
  imageUrl?: string;
  interactive?: boolean;
}) {
  const visibleLabel = label.trim();

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border border-gold/35 bg-gradient-to-br shadow-[0_28px_80px_rgba(26,31,46,0.14)]",
        interactive && "group transition duration-500 ease-luxury hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_36px_96px_rgba(26,31,46,0.20)]",
        toneClassNames[tone],
        className,
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={label}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-center",
            interactive && "transition duration-700 ease-luxury group-hover:scale-[1.045] group-hover:saturate-[1.08]",
          )}
          loading="lazy"
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.34),transparent_28%),linear-gradient(135deg,transparent,rgba(26,31,46,0.18))]",
          interactive && "transition duration-500 group-hover:bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.22),transparent_28%),linear-gradient(135deg,rgba(26,31,46,0.02),rgba(26,31,46,0.24))]",
        )}
      />
      {interactive ? (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/22 to-transparent transition duration-1000 ease-luxury group-hover:translate-x-full" />
      ) : null}
      <div
        className={cn(
          "absolute inset-3 border border-white/45",
          interactive && "transition duration-500 group-hover:inset-4 group-hover:border-white/70",
        )}
      />
      {visibleLabel ? (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <span
            className={cn(
              "bg-background/90 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-wine shadow-sm",
              interactive && "transition duration-500 group-hover:-translate-y-1 group-hover:bg-background group-hover:shadow-[0_14px_30px_rgba(26,31,46,0.16)]",
            )}
          >
            {visibleLabel}
          </span>
          {!compact ? (
            <span className={cn("hidden h-px flex-1 bg-white/60 sm:block", interactive && "transition duration-500 group-hover:bg-white/85")} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
