import AnimatedSection from "@/components/AnimatedSection";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import finHeroImage from "@/assets/fin-hero.webp";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { financingTranslations } from "@/i18n/translations/financing";
import { Link } from "react-router-dom";

const FinancingPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const f = financingTranslations;

  return (
    <Layout>
      <section className="relative isolate overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <img
            src={finHeroImage}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover object-[center_80%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,31,46,0.84)_0%,rgba(26,31,46,0.7)_38%,rgba(26,31,46,0.42)_65%,rgba(26,31,46,0.56)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(155,107,138,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(42,123,136,0.24),transparent_34%)]" />
        </div>

        <div className="container relative mx-auto flex min-h-[60svh] items-end px-4 py-20 lg:px-8 lg:py-24">
          <div className="w-full">
            <AnimatedSection as="div" className="w-full max-w-4xl text-white">
              <p className="type-h3 mb-4 text-white">{t(f.label)}</p>
              <h1 className="type-h1 w-full text-white">{t(f.title)}</h1>
              <p className="type-body mt-6 w-full max-w-3xl text-white/95 [text-shadow:0_2px_18px_rgba(26,31,46,0.42)]">
                {t(f.subtitle)}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card p-8 rounded-sm ring-1 ring-border/50">
              <h2 className="type-h3 mb-4 text-primary">{t(f.foreigners)}</h2>
              <ul className="type-body-sm space-y-3 text-muted-foreground">
                {f.foreignerItems[language].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-[0.2em] shrink-0 text-[0.95em] leading-none">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card p-8 rounded-sm ring-1 ring-border/50">
              <h2 className="type-h3 mb-4 text-primary">{t(f.residents)}</h2>
              <ul className="type-body-sm space-y-3 text-muted-foreground">
                {f.residentItems[language].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-[0.2em] shrink-0 text-[0.95em] leading-none">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="type-h2 mb-12 text-center">{t(f.stepsTitle)}</h2>
          <div className="space-y-6 max-w-lg mx-auto mb-16">
            {f.steps[language].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">
                  {i + 1}
                </div>
                <p className="type-body text-foreground">{step}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="hero" size="lg" asChild>
              <Link to={`${getLocalizedPath("contact", language)}#contact-form-view`}>{t(f.cta)}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FinancingPage;


