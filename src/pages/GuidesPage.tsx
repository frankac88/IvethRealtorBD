import { ArrowRight, BookOpen, Building2, ExternalLink, Landmark, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import guidesHeroMiami from "@/assets/guides-hero-miami.webp";
import AnimatedSection from "@/components/AnimatedSection";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { guidesTranslations } from "@/i18n/translations/guides";

const guideVisuals = {
  investor: {
    icon: Landmark,
    accentClassName: "from-[#183226] via-[#20402B] to-[#7D8A69]",
  },
  preconstruction: {
    icon: Building2,
    accentClassName: "from-[#4E3826] via-[#6B4B34] to-[#C59A67]",
  },
  financing: {
    icon: ShieldCheck,
    accentClassName: "from-[#152A40] via-[#21466A] to-[#88A6C6]",
  },
  buyer: {
    icon: BookOpen,
    accentClassName: "from-[#322416] via-[#5D4330] to-[#BFA78D]",
  },
} as const;

const guideOrder = ["investor", "preconstruction", "financing", "buyer"] as const;

const GuidesPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const g = guidesTranslations;

  return (
    <Layout>
      <section className="relative isolate overflow-hidden bg-[#0f1d17]">
        <div className="absolute inset-0">
          <img
            src={guidesHeroMiami}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,14,12,0.78)_0%,rgba(8,14,12,0.62)_38%,rgba(8,14,12,0.34)_65%,rgba(8,14,12,0.5)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(197,154,103,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(24,50,38,0.32),transparent_34%)]" />
        </div>

        <div className="container relative mx-auto flex min-h-[72svh] items-end px-4 py-20 lg:px-8 lg:py-24">
          <div className="w-full">
            <AnimatedSection as="div" className="w-full max-w-4xl">
              <p className="mb-4 text-xs uppercase tracking-[0.32em] text-gold">{t(g.label)}</p>
              <h1 className="w-full text-4xl font-serif leading-tight text-white md:text-5xl lg:text-6xl">
                {t(g.title)}
              </h1>
              <p className="mt-6 w-full max-w-3xl text-base leading-8 text-white/95 md:text-lg [text-shadow:0_2px_18px_rgba(0,0,0,0.42)]">
                {t(g.subtitle)}
              </p>
            </AnimatedSection>

            <AnimatedSection
              as="aside"
              delay={120}
              className="mt-10 w-full overflow-hidden border border-white/15 bg-[rgba(7,12,10,0.42)] shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm"
            >
              <div className="flex flex-col gap-5 p-6 md:gap-6 md:p-8">
                <div className="border-l-2 border-gold pl-4 md:pl-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white">{t(g.editorialNoteTitle)}</p>
                </div>
                <p className="max-w-5xl text-sm leading-7 text-white md:text-[15px] [text-shadow:0_2px_18px_rgba(0,0,0,0.4)]">{t(g.editorialNoteBody)}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-background py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs uppercase tracking-[0.26em] text-foreground/60">{t(g.quickNavLabel)}</p>
            <div className="flex flex-wrap gap-3">
              {guideOrder.map((guideKey) => (
                <a
                  key={guideKey}
                  href={`#${guideKey}`}
                  className="inline-flex items-center gap-2 border border-border/70 px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <span>{t(g.guides[guideKey].navTitle)}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-10">
            {guideOrder.map((guideKey, index) => {
              const guide = g.guides[guideKey];
              const visual = guideVisuals[guideKey];
              const Icon = visual.icon;

              return (
                <AnimatedSection
                  as="article"
                  id={guideKey}
                  key={guideKey}
                  delay={index * 90}
                  className="overflow-hidden border border-border/70 bg-background shadow-[0_24px_70px_rgba(15,23,42,0.05)]"
                >
                  <div className="grid lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
                    <div className={`flex min-h-[260px] flex-col justify-between bg-gradient-to-br ${visual.accentClassName} p-8 text-white lg:p-10`}>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/70">{t(guide.eyebrow)}</p>
                        <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h2 className="mt-8 max-w-sm font-serif text-3xl leading-tight">{t(guide.title)}</h2>
                        <p className="mt-4 max-w-md text-sm leading-7 text-white/80">{t(guide.summary)}</p>
                      </div>

                      <div className="mt-8">
                        <Button variant="heroOutline" size="sm" asChild className="border-white/30 text-white hover:bg-white hover:text-foreground">
                          <Link to={getLocalizedPath("contact", language)}>{t(g.primaryCta)}</Link>
                        </Button>
                      </div>
                    </div>

                    <div className="p-8 lg:p-10">
                      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.7fr)]">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-gold">{t(g.detailLabel)}</p>
                          <ul className="mt-5 space-y-4">
                            {guide.bullets[language].map((bullet) => (
                              <li key={bullet} className="flex gap-3 text-sm leading-7 text-muted-foreground">
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border border-border/70 bg-muted/30 p-6">
                          <p className="text-xs uppercase tracking-[0.24em] text-foreground/60">{t(g.resourceLabel)}</p>
                          <div className="mt-5 flex flex-col gap-3">
                            {guide.resources.map((resource) => (
                              <a
                                key={resource.href}
                                href={resource.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-start justify-between gap-3 border border-border/60 bg-background px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                              >
                                <span className="leading-6">{t(resource.label)}</span>
                                <ExternalLink className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#183226] py-20 text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection as="div" className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{t(g.label)}</p>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl">{t(g.finalTitle)}</h2>
            <p className="mt-6 text-base leading-8 text-primary-foreground/78">{t(g.finalBody)}</p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button variant="gold" size="lg" asChild>
                <Link to={getLocalizedPath("contact", language)}>{t(g.finalPrimary)}</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href={siteConfig.whatsapp.hrefWithMessage} target="_blank" rel="noopener noreferrer">
                  {t(g.finalSecondary)}
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default GuidesPage;





