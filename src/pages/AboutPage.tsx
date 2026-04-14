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
              <p className="type-body mb-6">{t(a.desc1)}</p>
              <p className="type-body mb-8">{t(a.desc2)}</p>
              <Button variant="default" asChild>
                <Link to={getLocalizedPath("contact", language)}>{t(a.cta)} <ArrowRight size={16} /></Link>
              </Button>
            </div>
            <img src={ivethImg} alt="Iveth Coll - International Real Estate Advisor" className="w-full max-w-md mx-auto object-cover aspect-[3/4] rounded-sm" loading="lazy" width={800} height={1000} />
          </div>
        </div>
      </section>

      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="type-h2 mb-16 text-center">{t(a.whyTitle)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, i) => (
              <AnimatedSection as="div" key={t(item.title)} delay={i * 100} className="text-center p-6">
                <item.icon size={32} className="text-primary mx-auto mb-4" />
                <h3 className="type-h3 mb-3 text-primary">{t(item.title)}</h3>
                <p className="type-body-sm text-muted-foreground">{t(item.desc)}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default AboutPage;




