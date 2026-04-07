import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const FinancingPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const f = translations.financing;

  return (
    <Layout>
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(f.label)}</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t(f.title)}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t(f.subtitle)}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-muted p-8 rounded-sm">
              <h2 className="font-serif text-2xl mb-4">{t(f.foreigners)}</h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {f.foreignerItems[language].map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-muted p-8 rounded-sm">
              <h2 className="font-serif text-2xl mb-4">{t(f.residents)}</h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {f.residentItems[language].map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="font-serif text-3xl text-center mb-12">{t(f.stepsTitle)}</h2>
          <div className="space-y-6 max-w-lg mx-auto mb-16">
            {f.steps[language].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">
                  {i + 1}
                </div>
                <p className="text-foreground">{step}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="hero" size="lg" asChild><Link to="/contacto">{t(f.cta)}</Link></Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FinancingPage;
