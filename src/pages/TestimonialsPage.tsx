import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { googleReviewsContent } from "@/content/googleReviews";
import { useT } from "@/i18n/LanguageContext";
import { testimonialsTranslations } from "@/i18n/translations/testimonials";

const TestimonialsPage = () => {
  const t = useT();
  const tp = testimonialsTranslations;
  const reviews = googleReviewsContent.reviews.slice(0, 6);

  return (
    <Layout>
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="type-caption mb-4">{t(tp.label)}</p>
          <h1 className="type-h1 mb-4">{t(tp.title)}</h1>
          <p className="type-body mx-auto max-w-xl">{t(tp.subtitle)}</p>
          <div className="mx-auto mt-8 flex w-fit flex-wrap items-center justify-center gap-3 rounded-full border border-border bg-background/90 px-5 py-3 shadow-sm">
            <span className="text-2xl font-semibold text-primary">{googleReviewsContent.rating.toFixed(1)}</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {googleReviewsContent.reviewCount} {t(tp.reviewsCountLabel)}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {t(tp.googleVerifiedLabel)}
            </span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((item, i) => (
              <AnimatedSection
                as="div"
                key={item.author}
                delay={i * 100}
                className="rounded-sm border border-border bg-card/70 p-8"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item.author}</p>
                    <p className="type-body-sm text-muted-foreground">{t(item.relativeDate)}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {t(tp.googleVerifiedLabel)}
                  </span>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="type-body italic text-muted-foreground">"{t(item.text)}"</p>
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button variant="hero" asChild>
              <a href={googleReviewsContent.googleBusinessUrl} target="_blank" rel="noopener noreferrer">
                {t(tp.viewMoreCta)}
                <ExternalLink size={16} />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TestimonialsPage;




