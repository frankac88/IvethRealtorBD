import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Shield, Building2, ArrowRight, ExternalLink, MessageCircle } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import HomeTestimonialsCarousel from "@/components/home/HomeTestimonialsCarousel";
import { googleReviewsContent } from "@/content/googleReviews";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { homeTranslations } from "@/i18n/translations/home";
import { createWhatsAppHref } from "@/config/site";
import { useFeaturedProjectsQuery } from "@/features/projects/hooks";
import { getProjectSlug } from "@/features/projects/luxuryProjectAdapter";
import heroImg from "@/assets/hero-miami.webp";
import ivethHomeImg from "@/assets/iveth-home.webp";

const formatProjectPrice = (value: number, language: "es" | "en") =>
  new Intl.NumberFormat(language === "es" ? "es-US" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const WhatsappChatIcon = () => (
  <MessageCircle className="fill-none text-[hsl(var(--whatsapp-green))] transition-colors duration-300 group-hover:text-white" />
);

const Index = () => {
  const { language } = useLanguage();
  const t = useT();
  const h = homeTranslations;
  const { data: featuredProjects = [], isLoading: isLoadingFeaturedProjects } = useFeaturedProjectsQuery(3);
  const contactFormHref = `${getLocalizedPath("contact", language)}#contact-form-view`;
  const homeWhatsappHref = createWhatsAppHref(
    "Hola Iveth, vengo desde la página de inicio y quiero hablar sobre oportunidades en Florida.",
  );

  const whyItems = [
    { icon: TrendingUp, ...h.whyItems.appreciation },
    { icon: Shield, ...h.whyItems.tax },
    { icon: Building2, ...h.whyItems.precon },
    { icon: MapPin, ...h.whyItems.location },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex h-[90vh] min-h-[600px] items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroImg}
          aria-hidden="true"
          onLoadedMetadata={(event) => {
            event.currentTarget.defaultPlaybackRate = 0.5;
            event.currentTarget.playbackRate = 0.5;
          }}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-primary-foreground">
          <p className="type-h3 mb-4 text-primary-foreground/80">{t(h.heroSubtitle)}</p>
          <h1 className="type-h1 mb-6 text-primary-foreground">
            {t(h.heroTitle1)} <span className="italic">{t(h.heroTitle2)}</span>
          </h1>
          <p className="type-body mx-auto mb-10 max-w-2xl font-light text-primary-foreground/85">{t(h.heroDesc)}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="lg" asChild><Link to={contactFormHref}>{t(h.heroCta1)}</Link></Button>
            <Button variant="heroOutline" size="lg" asChild><Link to={getLocalizedPath("projects", language)}>{t(h.heroCta2)}</Link></Button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <AnimatedSection className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="relative">
              <img src={ivethHomeImg} alt="Iveth Coll" className="mx-auto aspect-[3/4] w-full max-w-md rounded-sm object-cover lg:mx-0" loading="lazy" width={800} height={1000} />
            </div>
            <div>
              <p className="type-caption mb-4">{t(h.aboutLabel)}</p>
              <h2 className="type-h2 mb-6">{t(h.aboutTitle)}</h2>
              <p className="type-body mb-6 text-justify">{t(h.aboutDesc)}</p>
              <div className="mb-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                  {[
                    { number: "20+", label: t(h.stats.transactions) },
                    { number: "15+", label: t(h.stats.countries) },
                    { number: "15+", label: t(h.stats.volume) },
                  ].map((stat) => (
                    <div key={stat.label} className="grid min-w-0 grid-cols-[1px_minmax(0,1fr)] items-start gap-4 sm:gap-5">
                      <span className="block h-full w-px bg-primary/20" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="font-serif text-3xl font-semibold leading-none text-primary md:text-[2.4rem]">{stat.number}</p>
                        <p className="mt-2 text-sm leading-snug text-muted-foreground lg:text-[0.9rem]">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-border/70 pt-5">
                  <div className="grid grid-cols-1 gap-3">
                    {[t(h.highlights.preconstruction), t(h.highlights.team)].map((highlight) => (
                      <div key={highlight} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <p className="type-body-sm text-muted-foreground">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="default" asChild>
                <Link to={getLocalizedPath("about", language)}>{t(h.learnMore)} <ArrowRight size={16} /></Link>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Why Invest */}
      <AnimatedSection className="bg-muted py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <p className="type-caption mb-4">{t(h.whyFloridaLabel)}</p>
            <h2 className="type-h2 mx-auto max-w-2xl">{t(h.whyFloridaTitle)}</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item, i) => (
              <AnimatedSection as="div" key={t(item.title)} delay={i * 100} className="rounded-sm border border-border bg-background p-8 transition-shadow hover:shadow-lg">
                <item.icon size={28} className="mb-4 text-primary" />
                <h3 className="type-h3 mb-3 text-primary">{t(item.title)}</h3>
                <p className="type-body-sm text-muted-foreground">{t(item.desc)}</p>
              </AnimatedSection>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-3xl text-center font-serif text-lg italic leading-relaxed text-primary md:text-[1.5rem]">
            &quot;{t(h.whyQuote)}&quot;
          </p>
        </div>
      </AnimatedSection>

      {/* Featured Projects */}
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
                      <span className="absolute left-4 top-4 border border-white/20 bg-primary/90 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_12px_26px_rgba(26,31,46,0.18)] backdrop-blur">
                        {t(project.badge)}
                      </span>
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

      {/* Testimonials */}
      <AnimatedSection className="bg-foreground py-20 text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <p className="type-caption mb-4">{t(googleReviewsContent.labels.homeEyebrow)}</p>
            <h2 className="type-h2">{t(h.testimonialsTitle)}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-primary-foreground/72 md:text-base">
              {t(googleReviewsContent.labels.source)}
            </p>
          </div>
          <HomeTestimonialsCarousel reviews={googleReviewsContent.reviews} />
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              className="border-[#9B6B8A] bg-[#9B6B8A] text-[#F2EDE8] hover:bg-[#875C78] hover:text-[#F2EDE8]"
              asChild
            >
              <a href={googleReviewsContent.googleBusinessUrl} target="_blank" rel="noopener noreferrer">
                {t(googleReviewsContent.labels.homeCta)}
                <ExternalLink size={16} />
              </a>
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact CTA */}
      <AnimatedSection className="py-20 lg:py-28">
        <div className="container mx-auto max-w-2xl px-4 text-center lg:px-8">
          <p className="type-caption mb-4">{t(h.ctaLabel)}</p>
          <h2 className="mb-6 text-3xl font-serif md:text-4xl">{t(h.ctaTitle)}</h2>
          <p className="type-body mb-10">{t(h.ctaDesc)}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="lg" asChild><Link to={contactFormHref}>{t(h.ctaButton1)}</Link></Button>
            <Button variant="outline" size="lg" className="group" asChild>
              <a href={homeWhatsappHref} target="_blank" rel="noopener noreferrer">
                <WhatsappChatIcon />
                {t(h.ctaButton2)}
              </a>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default Index;

