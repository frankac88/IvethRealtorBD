import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Building2, MapPin, DollarSign, BarChart3 } from "lucide-react";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { investTranslations } from "@/i18n/translations/invest";
import investHeroFlorida from "@/assets/invest-hero-florida.webp";
import { siteConfig } from "@/config/site";

const HERO_IMAGE_POSITION_Y = "5%";
const investWhatsappMessage = {
  es: "Hola Iveth, quiero recibir una asesoría personalizada para invertir en Florida. ¿Podemos conversar?",
  en: "Hi Iveth, I would like to receive personalized guidance to invest in Florida. Can we talk?",
} as const;

const InvestPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const inv = investTranslations;
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(
    t(investWhatsappMessage),
  )}`;

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
      <section className="relative isolate overflow-hidden bg-muted text-primary-foreground">
        <img
          src={investHeroFlorida}
          alt="Miami waterfront skyline at golden hour"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `center ${HERO_IMAGE_POSITION_Y}` }}
        />
        <div className="absolute inset-0 bg-foreground/70" />

        <div className="container relative mx-auto flex min-h-[60svh] items-end px-4 py-20 text-center lg:px-8 lg:py-24">
          <div className="w-full">
            <p className="type-h3 mb-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">{t(inv.label)}</p>
            <h1 className="type-h1 mb-6 text-white">{t(inv.title)}</h1>
            <p className="type-body mx-auto mb-10 max-w-2xl font-light text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">{t(inv.subtitle)}</p>
          </div>
        </div>
      </section>

      <section id="invest-content" className="py-20">
        <div className="container mx-auto max-w-4xl px-4 lg:px-8">
          <div className="space-y-16">
            {sections.map((section) => (
              <div key={t(section.title)} className="flex gap-6">
                <section.icon size={32} className="mt-1 shrink-0 text-primary" />
                <div>
                  <h2 className="mb-3 font-serif text-[2rem] leading-tight tracking-[-0.02em]">{t(section.title)}</h2>
                  <p className="type-body text-muted-foreground">{t(section.content)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button variant="hero" size="lg" asChild>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                {t(inv.cta)}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InvestPage;
