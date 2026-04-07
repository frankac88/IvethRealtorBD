import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Star } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const TestimonialsPage = () => {
  const t = useT();
  const tp = translations.testimonials;

  return (
    <Layout>
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(tp.label)}</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t(tp.title)}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t(tp.subtitle)}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tp.items.map((item, i) => (
              <AnimatedSection as="div" key={item.name} delay={i * 100} className="border border-border p-8 rounded-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic">"{t(item.text)}"</p>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{t(item.country)}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TestimonialsPage;
