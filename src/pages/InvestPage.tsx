import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Shield, Building2, MapPin, DollarSign, BarChart3 } from "lucide-react";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { investTranslations } from "@/i18n/translations/invest";
import investHeroFlorida from "@/assets/invest-hero-florida.jpg";

const HERO_IMAGE_POSITION_Y = "58%";

const InvestPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const inv = investTranslations;

  const sections = [
    { icon: TrendingUp, ...inv.sections.why },
    { icon: Shield, ...inv.sections.tax },
    { icon: Building2, ...inv.sections.precon },
    { icon: DollarSign, ...inv.sections.types },
    { icon: BarChart3, ...inv.sections.roi },
    { icon: MapPin, ...inv.sections.markets },
  ];

  return (
    <Layout>
      <section className="relative isolate overflow-hidden bg-muted py-20 text-primary-foreground md:py-24">
        <img
          src={investHeroFlorida}
          alt="Miami waterfront skyline at golden hour"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `center ${HERO_IMAGE_POSITION_Y}` }}
        />
        <div className="absolute inset-0 bg-foreground/70" />

        <div className="container relative mx-auto px-4 text-center lg:px-8">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">{t(inv.label)}</p>
          <h1 className="mb-6 text-4xl font-serif font-medium leading-tight md:text-6xl lg:text-7xl">{t(inv.title)}</h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-xl">{t(inv.subtitle)}</p>
        </div>
      </section>

      <section id="invest-content" className="py-20">
        <div className="container mx-auto max-w-4xl px-4 lg:px-8">
          <div className="space-y-16">
            {sections.map((section) => (
              <div key={t(section.title)} className="flex gap-6">
                <section.icon size={32} className="mt-1 shrink-0 text-primary" />
                <div>
                  <h2 className="mb-3 font-serif text-2xl">{t(section.title)}</h2>
                  <p className="leading-relaxed text-muted-foreground">{t(section.content)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button variant="hero" size="lg" asChild>
              <Link to={getLocalizedPath("contact", language)}>{t(inv.cta)}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InvestPage;
