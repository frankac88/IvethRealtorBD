import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { teamTranslations } from "@/i18n/translations/team";
import ivethImg from "@/assets/iveth-portrait.webp";

const TeamPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const tm = teamTranslations;

  return (
    <Layout>
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(tm.label)}</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t(tm.title)}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t(tm.subtitle)}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            <div className="text-center">
              <img src={ivethImg} alt="Iveth Coll" className="w-64 h-64 object-cover rounded-sm mx-auto mb-6" loading="lazy" />
              <h2 className="font-serif text-2xl mb-1">Iveth Coll</h2>
              <p className="text-xs tracking-[0.2em] uppercase text-gold mb-4">{t(tm.ivethRole)}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t(tm.ivethDesc)}</p>
              <Button variant="default" size="sm" asChild><Link to={getLocalizedPath("about", language)}>{t(tm.learnMore)}</Link></Button>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 bg-muted rounded-sm mx-auto mb-6 flex items-center justify-center">
                <span className="font-serif text-4xl text-muted-foreground">RS</span>
              </div>
              <h2 className="font-serif text-2xl mb-1">Ricardo Suarez</h2>
              <p className="text-xs tracking-[0.2em] uppercase text-gold mb-4">{t(tm.ricardoRole)}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t(tm.ricardoDesc)}</p>
              <Button variant="default" size="sm" asChild><Link to={getLocalizedPath("financing", language)}>{t(tm.viewOptions)}</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TeamPage;
