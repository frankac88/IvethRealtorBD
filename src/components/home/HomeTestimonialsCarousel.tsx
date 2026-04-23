import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { googleReviewsContent } from "@/content/googleReviews";
import { useT } from "@/i18n/LanguageContext";

type Review = (typeof googleReviewsContent.reviews)[number];

interface HomeTestimonialsCarouselProps {
  reviews: readonly Review[];
}

const VISIBLE_REVIEWS = 3;

const getRelativeDateRank = (value: string) => {
  const normalized = value.trim().toLowerCase();
  const amountMatch = normalized.match(/\d+/);
  const amount = amountMatch ? Number(amountMatch[0]) : 0;

  if (normalized.includes("month") || normalized.includes("mes")) {
    return amount || 1;
  }

  if (normalized.includes("year") || normalized.includes("año")) {
    return (amount || 1) * 12;
  }

  if (normalized.includes("week") || normalized.includes("semana")) {
    return (amount || 1) * 0.25;
  }

  if (normalized.includes("day") || normalized.includes("día")) {
    return (amount || 1) * 0.03;
  }

  if (normalized.includes("hour") || normalized.includes("hora")) {
    return (amount || 1) * 0.001;
  }

  return Number.MAX_SAFE_INTEGER;
};

const getVisibleReviews = (reviews: readonly Review[], startIndex: number) =>
  Array.from({ length: Math.min(VISIBLE_REVIEWS, reviews.length) }, (_, offset) => {
    const reviewIndex = (startIndex + offset) % reviews.length;
    return reviews[reviewIndex];
  });

const HomeTestimonialsCarousel = ({ reviews }: HomeTestimonialsCarouselProps) => {
  const t = useT();
  const [startIndex, setStartIndex] = useState(0);

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) => getRelativeDateRank(t(a.relativeDate)) - getRelativeDateRank(t(b.relativeDate)),
      ),
    [reviews, t],
  );

  const visibleReviews = useMemo(() => {
    if (sortedReviews.length === 0) {
      return [];
    }

    return getVisibleReviews(sortedReviews, startIndex);
  }, [sortedReviews, startIndex]);

  const handlePrevious = () => {
    if (sortedReviews.length <= 1) {
      return;
    }

    setStartIndex((current) => (current - 1 + sortedReviews.length) % sortedReviews.length);
  };

  const handleNext = () => {
    if (sortedReviews.length <= 1) {
      return;
    }

    setStartIndex((current) => (current + 1) % sortedReviews.length);
  };

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <div className="shrink-0">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          onClick={handlePrevious}
          aria-label="Testimonio anterior"
        >
          <ChevronLeft size={18} />
        </Button>
      </div>

      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {visibleReviews.map((item, index) => (
            <AnimatedSection
              as="div"
              key={`${item.author}-${startIndex}-${index}`}
              delay={index * 120}
              className="rounded-sm border border-primary-foreground/10 p-8"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{item.author}</p>
                  <p className="type-body-sm text-primary-foreground/65">{t(item.relativeDate)}</p>
                </div>
              </div>

              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} size={16} className="fill-accent text-accent" />
                ))}
              </div>

              <p className="mb-6 text-[1.02rem] leading-[1.85] italic !text-white [text-shadow:0_1px_10px_rgba(255,255,255,0.18)] md:text-[1.08rem]">
                &quot;{t(item.text)}&quot;
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <div className="shrink-0">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          onClick={handleNext}
          aria-label="Siguiente testimonio"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default HomeTestimonialsCarousel;
