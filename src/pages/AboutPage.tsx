import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Globe, Building2, Users } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { aboutTranslations } from "@/i18n/translations/about";
import ivethImg from "@/assets/iveth-portrait.webp";

const AboutPage = () => {
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
              <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(a.label)}</p>
              <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">{t(a.title)}</h1>
              <p className="text-muted-foreground leading-relaxed mb-6">{t(a.desc1)}</p>
              <p className="text-muted-foreground leading-relaxed mb-8">{t(a.desc2)}</p>
              <Button variant="default" asChild>
                <Link to="/contacto">{t(a.cta)} <ArrowRight size={16} /></Link>
              </Button>
            </div>
            <img src={ivethImg} alt="Iveth Coll - International Real Estate Advisor" className="w-full max-w-md mx-auto object-cover aspect-[3/4] rounded-sm" loading="lazy" width={800} height={1000} />
          </div>
        </div>
      </section>

      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-serif text-center mb-16">{t(a.whyTitle)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, i) => (
              <AnimatedSection as="div" key={t(item.title)} delay={i * 100} className="text-center p-6">
                <item.icon size={32} className="text-primary mx-auto mb-4" />
                <h3 className="font-serif text-lg mb-3">{t(item.title)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(item.desc)}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default AboutPage;
