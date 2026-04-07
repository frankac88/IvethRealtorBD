import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Shield, Building2, MapPin, DollarSign, BarChart3 } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const InvestPage = () => {
  const t = useT();
  const inv = translations.invest;

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
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(inv.label)}</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t(inv.title)}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t(inv.subtitle)}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="space-y-16">
            {sections.map((section) => (
              <div key={t(section.title)} className="flex gap-6">
                <section.icon size={32} className="text-primary shrink-0 mt-1" />
                <div>
                  <h2 className="font-serif text-2xl mb-3">{t(section.title)}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t(section.content)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button variant="hero" size="lg" asChild><Link to="/contacto">{t(inv.cta)}</Link></Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InvestPage;
