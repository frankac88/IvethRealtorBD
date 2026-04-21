import type { LucideIcon } from "lucide-react";
import { Check, Download, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface GuideCardProps {
  title: string;
  description: string;
  bullets: string[];
  Icon: LucideIcon;
  cardClassName?: string;
  iconClassName?: string;
  onDownload: () => void;
  downloadLabel: string;
  whatsappLabel: string;
  whatsappHref: string;
}

const GuideCard = ({
  title,
  description,
  bullets,
  Icon,
  cardClassName,
  iconClassName,
  onDownload,
  downloadLabel,
  whatsappLabel,
  whatsappHref,
}: GuideCardProps) => {
  return (
    <article className={`group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[18px] border border-white/12 p-6 text-white shadow-[0_24px_70px_rgba(20,20,20,0.12)] transition-transform duration-300 hover:-translate-y-1 md:min-h-[470px] md:p-8 ${cardClassName ?? ""}`}>
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(212,176,104,0.14),transparent_34%)]" />
        <div className="absolute bottom-0 right-0 h-40 w-56 bg-[radial-gradient(circle_at_bottom_right,rgba(225,194,127,0.25),transparent_62%)]" />
        <div className="absolute -bottom-8 right-[-20px] h-44 w-72 rounded-full border border-[rgba(229,205,156,0.22)]" />
        <div className="absolute -bottom-2 right-10 h-36 w-64 rounded-full border border-[rgba(229,205,156,0.15)]" />
        <div className="absolute bottom-6 right-6 h-28 w-52 rounded-full border border-[rgba(229,205,156,0.12)]" />
      </div>

      <div className="relative flex flex-1 flex-col">
        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-[10px] border border-[#d7b56b]/35 bg-black/10 text-[#d7b56b] shadow-[0_12px_30px_rgba(0,0,0,0.14)] ${iconClassName ?? ""}`}>
          <Icon className="h-8 w-8" strokeWidth={1.7} />
        </div>

        <h3 className="mt-6 max-w-[14ch] font-serif text-[2rem] leading-[1.05] tracking-[-0.03em] text-[#f6e9ce] md:text-[2.25rem]">
          {title}
        </h3>

        <p className="mt-5 max-w-[34ch] text-[1.08rem] leading-8 text-[#f4ead8]/92">
          {description}
        </p>

        <ul className="mt-7 space-y-3 text-[1.04rem] leading-7 text-[#f4ead8]">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#d7b56b]">
                <Check className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
          <Button type="button" variant="gold" size="lg" className="w-full rounded-[8px] px-5 text-sm normal-case sm:flex-1" onClick={onDownload}>
            <Download className="h-4 w-4" />
            {downloadLabel}
          </Button>

          <Button variant="whatsapp" size="lg" asChild className="w-full rounded-[8px] px-5 text-sm normal-case sm:flex-1">
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
