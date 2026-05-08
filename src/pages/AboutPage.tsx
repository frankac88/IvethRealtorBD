import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Globe, Building2, Users } from "lucide-react";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { aboutTranslations } from "@/i18n/translations/about";
import ivethImg from "@/assets/iveth-portrait.webp";

const AboutPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const a = aboutTranslations;
  const contactFormHref = `${getLocalizedPath("contact", language)}#contact-form-view`;

  const values = [
    { icon: Globe, ...a.values.international },
    { icon: Building2, ...a.values.precon },
    { icon: Award, ...a.values.track },
    { icon: Users, ...a.values.team },
  ];

  return (
    <Layout>
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="type-caption mb-4">{t(a.label)}</p>
              <h1 className="type-h1 mb-6">{t(a.title)}</h1>
              <p className="type-body mb-8 text-justify">{t(a.desc1)}</p>
              <Button variant="default" asChild>
                <Link to={contactFormHref}>{t(a.cta)} <ArrowRight size={16} /></Link>
              </Button>
            </div>
            <img src={ivethImg} alt="Iveth Coll - International Real Estate Advisor" className="w-full max-w-md mx-auto object-cover aspect-[3/4] rounded-sm" loading="eager" fetchPriority="high" width={800} height={1000} />
          </div>
        </div>
      </section>

      <AnimatedSection className="relative overflow-hidden bg-background py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(42,123,137,0.05),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(124,63,99,0.07),transparent_28%)]" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-gold/25 bg-card/65 px-6 py-12 shadow-[0_30px_90px_rgba(26,31,46,0.08)] backdrop-blur-sm md:px-10 lg:px-12 lg:py-16">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
            <div className="pointer-events-none absolute -left-12 top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rounded-full bg-wine/10 blur-3xl" />
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <div className="mb-4 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
                <span className="type-caption">{t(a.whyEyebrow)}</span>
                <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
              </div>
              <h2 className="type-h2 mt-4 text-wine">{t(a.whyTitle)}</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {values.map((item, i) => (
              <AnimatedSection
                as="article"
                key={t(item.title)}
                delay={i * 100}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-border/80 bg-background/90 p-7 text-center shadow-[0_18px_46px_rgba(26,31,46,0.06)] transition-all duration-500 ease-luxury hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_28px_70px_rgba(26,31,46,0.14)] md:p-8"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle,rgba(124,63,99,0.10),transparent_68%)] opacity-80 transition-transform duration-500 group-hover:scale-110" />
                <span className="mb-5 font-serif text-[0.9rem] tracking-[0.2em] text-wine/55">
                  0{i + 1}
                </span>
                <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_30px_rgba(26,31,46,0.06)] transition-transform duration-500 group-hover:scale-105">
                  <item.icon size={28} className="text-primary" />
                </span>
                <h3 className="mb-4 font-serif text-[1.35rem] leading-[1.08] tracking-[-0.02em] text-wine md:text-[1.45rem]">
                  {t(item.title)}
                </h3>
                <p className="type-body-sm text-muted-foreground">{t(item.desc)}</p>
                <span className="mx-auto mt-6 h-px w-12 bg-gradient-to-r from-transparent via-gold/70 to-transparent transition-all duration-500 group-hover:w-16" aria-hidden="true" />
              </AnimatedSection>
            ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default AboutPage;




