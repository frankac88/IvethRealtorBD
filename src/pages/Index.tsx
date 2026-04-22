import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Shield, Building2, Star, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { homeTranslations } from "@/i18n/translations/home";
import { siteConfig } from "@/config/site";
import { useFeaturedProjectsQuery } from "@/features/projects/hooks";
import heroImg from "@/assets/hero-miami.webp";
import ivethHomeImg from "@/assets/iveth-home.webp";

const formatProjectPrice = (value: number, language: "es" | "en") =>
  new Intl.NumberFormat(language === "es" ? "es-US" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const Index = () => {
  const { language } = useLanguage();
  const t = useT();
  const h = homeTranslations;
  const { data: featuredProjects = [], isLoading: isLoadingFeaturedProjects } = useFeaturedProjectsQuery(3);
  const contactFormHref = `${getLocalizedPath("contact", language)}#contact-form-view`;

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
      <AnimatedSection className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="type-caption mb-4">{t(h.portfolioLabel)}</p>
              <h2 className="type-h2">{t(h.portfolioTitle)}</h2>
            </div>
            <Button variant="outline" asChild><Link to={getLocalizedPath("projects", language)}>{t(h.viewAll)}</Link></Button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {isLoadingFeaturedProjects
              ? Array.from({ length: 3 }).map((_, index) => (
                  <AnimatedSection as="div" key={index} delay={index * 150} className="animate-pulse">
                    <div className="mb-4 aspect-[4/3] rounded-sm bg-muted" />
                    <div className="mb-2 h-7 w-3/4 bg-muted" />
                    <div className="mb-3 h-4 w-1/2 bg-muted" />
                    <div className="h-5 w-1/3 bg-muted" />
                  </AnimatedSection>
                ))
              : featuredProjects.map((project, index) => (
                  <AnimatedSection as="div" key={project.id} delay={index * 150} className="group cursor-pointer">
                    <div className="relative mb-4 overflow-hidden rounded-sm">
                      <img
                        src={project.imageUrl}
                        alt={`${project.title} — ${t(project.location)}`}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        width={800}
                        height={600}
                      />
                      <span className="absolute left-4 top-4 bg-primary px-3 py-1 text-xs uppercase tracking-wider text-primary-foreground">
                        {t(project.badge)}
                      </span>
                    </div>
                    <h3 className="mb-1 font-serif text-[1.65rem] leading-tight">{project.title}</h3>
                    <div className="type-body-sm mb-2 flex items-center gap-1 text-muted-foreground"><MapPin size={14} />{t(project.location)}</div>
                    {project.priceFrom ? (
                      <p className="text-lg font-semibold text-primary">{t(h.projectPricePrefix)} {formatProjectPrice(project.priceFrom, language)}</p>
                    ) : null}
                  </AnimatedSection>
                ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="bg-foreground py-20 text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <p className="type-caption mb-4">{t(h.testimonialsLabel)}</p>
            <h2 className="type-h2">{t(h.testimonialsTitle)}</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {h.testimonials.map((item, i) => (
              <AnimatedSection as="div" key={item.name} delay={i * 150} className="rounded-sm border border-primary-foreground/10 p-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="type-body mb-6 italic text-primary-foreground/88">&quot;{t(item.text)}&quot;</p>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="type-body-sm text-primary-foreground/65">{t(item.country)}</p>
                </div>
              </AnimatedSection>
            ))}
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
            <Button variant="whatsapp" size="lg" asChild>
              <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">{t(h.ctaButton2)}</a>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default Index;

