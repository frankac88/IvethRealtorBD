import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, Download, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuideCardProps {
  titleLead?: string;
  title: string;
  displayTitle?: ReactNode;
  description: string;
  bullets: readonly string[];
  Icon: LucideIcon;
  isLight?: boolean;
  cardClassName?: string;
  iconClassName?: string;
  backgroundImage?: string;
  backgroundImageClassName?: string;
  onDownload: () => void;
  downloadLabel: string;
  whatsappLabel: string;
  whatsappHref: string;
}

const GuideCard = ({
  titleLead,
  title,
  displayTitle,
  description,
  bullets,
  Icon,
  isLight = false,
  cardClassName,
  iconClassName,
  backgroundImage,
  backgroundImageClassName,
  onDownload,
  downloadLabel,
  whatsappLabel,
  whatsappHref,
}: GuideCardProps) => {
  return (
    <article
      className={cn(
        "group relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-[12px] border p-7 shadow-[0_20px_45px_rgba(45,31,18,0.14)] transition-transform duration-300 hover:-translate-y-1 md:min-h-[470px] md:p-8",
        isLight ? "border-black/8 text-[#1f252c]" : "border-white/10 text-[#171717]",
        cardClassName,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        {backgroundImage ? (
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30",
              backgroundImageClassName,
            )}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : null}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.62),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02))]"
        />
        <div
          className="absolute right-0 top-0 h-40 w-44 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.55),transparent_70%)]"
        />
        <div
          className="absolute bottom-0 right-0 h-44 w-56 bg-[radial-gradient(circle_at_bottom_right,rgba(196,168,104,0.18),transparent_64%)]"
        />
        <div
          className="absolute -bottom-10 right-[-10px] h-40 w-80 rounded-full border border-[rgba(198,171,122,0.24)]"
        />
        <div
          className="absolute -bottom-1 right-10 h-32 w-72 rounded-full border border-[rgba(198,171,122,0.18)]"
        />
        <div
          className="absolute bottom-6 right-6 h-24 w-56 rounded-full border border-[rgba(198,171,122,0.12)]"
        />
        <div
          className="absolute bottom-10 right-20 h-px w-40 rotate-[-17deg] bg-[rgba(198,171,122,0.16)]"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div
          className="absolute inset-0 bg-white/22"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))]"
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="relative w-fit max-w-full self-start">
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute inset-0 rounded-[22px] bg-[linear-gradient(180deg,rgba(255,249,241,0.64)_0%,rgba(255,247,238,0.56)_52%,rgba(255,245,236,0.46)_100%)] shadow-[0_18px_40px_rgba(76,58,33,0.08)] backdrop-blur-[4px]" />
          </div>

          <div className="relative z-10 rounded-[22px] px-5 py-5 md:px-6 md:py-6">
            <div className="flex items-start gap-4 md:gap-5">
              <div
                className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] text-[#2f5f7a]",
              iconClassName,
            )}
          >
            <Icon className="h-10 w-10 text-[#2f5f7a] drop-shadow-[0_3px_8px_rgba(0,0,0,0.18)]" strokeWidth={1.65} />
          </div>

              <div className="w-full max-w-[28ch] min-w-0">
                {titleLead ? (
                  <p
                    className={cn(
                      "font-serif text-[1.05rem] leading-none tracking-[-0.02em] drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] md:text-[1.15rem]",
                      isLight ? "text-[#3c2c17]" : "text-[#2f2213]",
                    )}
                  >
                    {titleLead}
                  </p>
                ) : null}
                <h3
                  className={cn(
                    "font-serif text-[1.45rem] leading-[1.02] tracking-[-0.025em] [text-wrap:balance] drop-shadow-[0_1px_1px_rgba(255,255,255,0.56)] sm:text-[1.6rem] md:text-[1.9rem]",
                    isLight ? "text-[#111111]" : "text-black",
                  )}
                >
                  {displayTitle ?? title}
                </h3>
              </div>
            </div>

            <p
              className={cn(
                "mt-7 max-w-[33ch] text-[1.02rem] leading-[1.42] drop-shadow-[0_1px_1px_rgba(255,255,255,0.34)] md:text-[1.08rem]",
                isLight ? "text-[#161616]" : "text-[#161616]",
              )}
            >
              {description}
            </p>

            <ul
              className={cn(
                "mt-7 space-y-2.5 text-[1rem] leading-[1.35] drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)] md:text-[1.06rem]",
                isLight ? "text-[#101010]" : "text-[#101010]",
              )}
            >
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#2f5f7a]">
                    <Check className="h-4 w-4" strokeWidth={2.4} />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
          <Button
            type="button"
            variant="gold"
            size="lg"
            className="h-11 w-full rounded-[4px] border border-[#c8a25c]/75 bg-[#c6a058] px-5 font-serif text-[1.05rem] font-normal normal-case tracking-[-0.01em] text-[#fff8e8] shadow-[0_6px_16px_rgba(111,84,37,0.28)] hover:scale-100 hover:bg-[#bc954d] hover:shadow-[0_8px_18px_rgba(111,84,37,0.32)] sm:flex-1"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
            {downloadLabel}
          </Button>

          <Button
            variant="whatsapp"
            size="lg"
            asChild
            className="h-11 w-full rounded-[4px] border border-white/10 bg-[#2d5b53] px-5 font-serif text-[1.03rem] font-normal normal-case tracking-[-0.01em] text-[#f7f3e6] shadow-[0_6px_16px_rgba(21,42,37,0.24)] hover:scale-100 hover:bg-[#244d46] hover:shadow-[0_8px_18px_rgba(21,42,37,0.3)] sm:flex-1"
          >
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              {whatsappLabel}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
};

export default GuideCard;
