import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Shield, Building2, ArrowRight, ExternalLink, MessageCircle } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import SEO from "@/components/SEO";
import HomeTestimonialsCarousel from "@/components/home/HomeTestimonialsCarousel";
import { googleReviewsContent } from "@/content/googleReviews";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { homeTranslations } from "@/i18n/translations/home";
import { createWhatsAppHref, getWhatsAppMessage, whatsappMessages } from "@/config/site";
import heroImg from "@/assets/hero-miami.webp";
import heroImgMobile from "@/assets/hero-miami-mobile.webp";
import ivethHomeImg from "@/assets/iveth-home.webp";

const FeaturedProjectsSection = lazy(() => import("@/components/home/FeaturedProjectsSection"));

const WhatsappChatIcon = () => (
  <MessageCircle className="fill-none text-[hsl(var(--whatsapp-green))] transition-colors duration-300 group-hover:text-white" />
);

const FeaturedProjectsFallback = () => {
  return (
    <section
      className="relative min-h-[32rem] overflow-hidden border-y border-gold/20 bg-card py-24 lg:py-32"
      aria-busy="true"
      aria-label="Cargando proyectos destacados"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(124,63,99,0.12),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(42,123,137,0.11),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0))]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    </section>
  );
};

const canLoadDecorativeHeroVideo = () => {
  if (!("matchMedia" in window)) {
    return false;
  }

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !connection?.saveData && window.matchMedia("(min-width: 768px)").matches;
};

const Index = () => {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const featuredProjectsRef = useRef<HTMLDivElement>(null);
  const [shouldLoadHeroVideo, setShouldLoadHeroVideo] = useState(false);
  const [shouldRenderFeaturedProjects, setShouldRenderFeaturedProjects] = useState(false);
  const { language } = useLanguage();
  const t = useT();
  const h = homeTranslations;
  const contactFormHref = `${getLocalizedPath("contact", language)}#contact-form-view`;
  const homeWhatsappHref = createWhatsAppHref(getWhatsAppMessage(whatsappMessages.homePage));

  const whyItems = [
    { icon: TrendingUp, ...h.whyItems.appreciation },
    { icon: Shield, ...h.whyItems.tax },
    { icon: Building2, ...h.whyItems.precon },
    { icon: MapPin, ...h.whyItems.location },
  ];

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!canLoadDecorativeHeroVideo()) {
      return;
    }

    const loadHeroVideo = () => setShouldLoadHeroVideo(true);

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(loadHeroVideo, { timeout: 3000 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(loadHeroVideo, 2500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (shouldRenderFeaturedProjects || typeof window === "undefined") {
      return;
    }

    const element = featuredProjectsRef.current;
    if (!element || typeof window.IntersectionObserver !== "function") {
      setShouldRenderFeaturedProjects(true);
      return;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRenderFeaturedProjects(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldRenderFeaturedProjects]);

  useEffect(() => {
    if (!shouldLoadHeroVideo || !heroVideoRef.current) {
      return;
    }

    heroVideoRef.current.load();
    void heroVideoRef.current.play().catch(() => {
      // Autoplay can be blocked by browser policies; the poster preserves the hero visual.
    });
  }, [shouldLoadHeroVideo]);

  return (
    <Layout>
      <SEO 
        title={t(h.heroTitle1)}
        description={t(h.heroDesc).substring(0, 160)}
        canonicalUrl={`https://www.ivethcollrealtor.com${getLocalizedPath("home", language) === "/" ? "" : getLocalizedPath("home", language)}`}
      />
      {/* Hero */}
      <section className="relative flex h-[90vh] min-h-[600px] items-center justify-center overflow-hidden">
        <picture className="absolute inset-0 h-full w-full">
          <source srcSet={heroImgMobile} media="(max-width: 767px)" />
          <img
            src={heroImg}
            alt=""
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
            fetchpriority="high"
            decoding="async"
            aria-hidden="true"
          />
        </picture>
        <video
          ref={heroVideoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            shouldLoadHeroVideo ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroImg}
          width={1920}
          height={1080}
          aria-hidden="true"
          onLoadedMetadata={(event) => {
            event.currentTarget.defaultPlaybackRate = 0.5;
            event.currentTarget.playbackRate = 0.5;
          }}
        >
          {shouldLoadHeroVideo ? <source src="/videos/hero-video.mp4" type="video/mp4" /> : null}
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
      <div ref={featuredProjectsRef}>
        {shouldRenderFeaturedProjects ? (
          <Suspense fallback={<FeaturedProjectsFallback />}>
            <FeaturedProjectsSection />
          </Suspense>
        ) : (
          <FeaturedProjectsFallback />
        )}
      </div>

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

