import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Star } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { testimonialsTranslations } from "@/i18n/translations/testimonials";

const TestimonialsPage = () => {
  const t = useT();
  const tp = testimonialsTranslations;

  return (
    <Layout>
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="type-caption mb-4">{t(tp.label)}</p>
          <h1 className="type-h1 mb-4">{t(tp.title)}</h1>
          <p className="type-body mx-auto max-w-xl">{t(tp.subtitle)}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tp.items.map((item, i) => (
              <AnimatedSection as="div" key={item.name} delay={i * 100} className="border border-border bg-card/70 p-8 rounded-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="type-body mb-6 italic text-muted-foreground">"{t(item.text)}"</p>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="type-body-sm text-muted-foreground">{t(item.country)}</p>
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




