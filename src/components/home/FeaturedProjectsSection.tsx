import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useFeaturedProjectsQuery } from "@/features/projects/hooks";
import { getProjectSlug } from "@/features/projects/luxuryProjectAdapter";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { homeTranslations } from "@/i18n/translations/home";

const formatProjectPrice = (value: number, language: "es" | "en") =>
  new Intl.NumberFormat(language === "es" ? "es-US" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const FeaturedProjectsSection = () => {
  const { language } = useLanguage();
  const t = useT();
  const h = homeTranslations;
  const { data: featuredProjects = [], isLoading: isLoadingFeaturedProjects } = useFeaturedProjectsQuery(3);

  return (
    <AnimatedSection className="relative overflow-hidden border-y border-gold/20 bg-card py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(124,63,99,0.12),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(42,123,137,0.11),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0))]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="container relative mx-auto px-4 lg:px-8">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-12 bg-gold/70" aria-hidden="true" />
              <p className="type-caption">{t(h.portfolioLabel)}</p>
            </div>
            <h2 className="type-h2 text-wine">{t(h.portfolioTitle)}</h2>
          </div>
          <Button
            variant="outline"
            className="border-gold/35 bg-background/70 px-6 text-wine shadow-[0_16px_36px_rgba(26,31,46,0.08)] backdrop-blur transition-all duration-300 hover:border-gold/70 hover:bg-card hover:text-wine"
            asChild
          >
            <Link to={getLocalizedPath("projects", language)}>{t(h.viewAll)}</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3 lg:gap-8">
          {isLoadingFeaturedProjects
            ? Array.from({ length: 3 }).map((_, index) => (
                <AnimatedSection
                  as="div"
                  key={index}
                  delay={index * 150}
                  className="animate-pulse overflow-hidden rounded-[1.25rem] border border-gold/25 bg-card/80 p-3 shadow-[0_24px_70px_rgba(26,31,46,0.09)]"
                >
                  <div className="aspect-[4/3] rounded-[1rem] bg-muted" />
                  <div className="px-3 pb-4 pt-5">
                    <div className="mb-3 h-7 w-3/4 rounded-full bg-muted" />
                    <div className="mb-4 h-4 w-1/2 rounded-full bg-muted" />
                    <div className="mb-6 h-5 w-1/3 rounded-full bg-muted" />
                    <div className="h-10 w-36 rounded-full bg-muted" />
                  </div>
                </AnimatedSection>
              ))
            : featuredProjects.map((project, index) => (
                <AnimatedSection
                  as="article"
                  key={project.id}
                  delay={index * 150}
                  className="group/card flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-gold/30 bg-card/90 p-3 shadow-[0_24px_70px_rgba(26,31,46,0.10)] transition-all duration-500 ease-luxury hover:-translate-y-1 hover:border-gold/65 hover:shadow-[0_34px_90px_rgba(26,31,46,0.16)]"
                >
                  <div className="relative overflow-hidden rounded-[1rem] bg-muted">
                    <img
                      src={project.imageUrl}
                      alt={`${project.title} — ${t(project.location)}`}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-luxury group-hover/card:scale-105"
                      loading="lazy"
                      width={800}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/48 via-foreground/6 to-transparent" />
                    <span className="absolute bottom-4 left-4 h-px w-14 bg-gold/80" aria-hidden="true" />
                  </div>
                  <div className="flex flex-1 flex-col px-3 pb-4 pt-5">
                    <h3 className="font-serif text-[1.75rem] leading-none tracking-[-0.035em] text-wine">
                      {project.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-sm leading-6 text-muted-foreground">
                      <MapPin size={14} className="shrink-0 text-primary" />
                      {t(project.location)}
                    </div>
                    {project.priceFrom ? (
                      <p className="mt-auto pt-5 text-[1.05rem] font-semibold tracking-[-0.01em] text-primary">
                        {t(h.projectPricePrefix)} {formatProjectPrice(project.priceFrom, language)}
                      </p>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-6 min-w-36 border-gold/40 bg-background/80 px-5 text-wine shadow-[0_12px_28px_rgba(26,31,46,0.08)] hover:border-gold/70 hover:bg-wine hover:text-white"
                      asChild
                    >
                      <Link to={`${getLocalizedPath("projects", language)}/${getProjectSlug(project)}`}>
                        {t({ es: "Ver proyecto", en: "View project" })}
                      </Link>
                    </Button>
                  </div>
                </AnimatedSection>
              ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default FeaturedProjectsSection;
