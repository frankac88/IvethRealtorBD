import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Shield, Building2, Star, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { useT } from "@/i18n/LanguageContext";
import { homeTranslations } from "@/i18n/translations/home";
import { siteConfig } from "@/config/site";
import heroImg from "@/assets/hero-miami.webp";
import ivethImg from "@/assets/iveth-portrait.webp";
import project1 from "@/assets/project-1.webp";
import project2 from "@/assets/project-2.webp";
import project3 from "@/assets/project-3.webp";

const Index = () => {
  const t = useT();
  const h = homeTranslations;

  const projects = [
    { title: "The Residences at Brickell", location: "Brickell, Miami", price: "$450,000", image: project1, tagKey: "precon" as const },
    { title: "Ocean Bay Tower", location: "Miami Beach", price: "$680,000", image: project2, tagKey: "waterfront" as const },
    { title: "Palm Villas Orlando", location: "Orlando, FL", price: "$320,000", image: project3, tagKey: "investment" as const },
  ];

  const whyItems = [
    { icon: TrendingUp, ...h.whyItems.appreciation },
    { icon: Shield, ...h.whyItems.tax },
    { icon: Building2, ...h.whyItems.precon },
    { icon: MapPin, ...h.whyItems.location },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Miami luxury skyline" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative z-10 text-center text-primary-foreground max-w-3xl mx-auto px-4">
          <p className="text-xs tracking-[0.4em] uppercase mb-4 text-primary-foreground/80">{t(h.heroSubtitle)}</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight mb-6">
            {t(h.heroTitle1)} <span className="italic">{t(h.heroTitle2)}</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/85 font-light mb-10 max-w-2xl mx-auto leading-relaxed">{t(h.heroDesc)}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild><Link to="/contacto">{t(h.heroCta1)}</Link></Button>
            <Button variant="heroOutline" size="lg" asChild><Link to="/proyectos">{t(h.heroCta2)}</Link></Button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <AnimatedSection className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src={ivethImg} alt="Iveth Coll" className="w-full max-w-md mx-auto lg:mx-0 object-cover aspect-[3/4] rounded-sm" loading="lazy" width={800} height={1000} />
              
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(h.aboutLabel)}</p>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 leading-tight">{t(h.aboutTitle)}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{t(h.aboutDesc)}</p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { number: "100+", label: t(h.stats.transactions) },
                  { number: "15+", label: t(h.stats.countries) },
                  { number: "$50M+", label: t(h.stats.volume) },
                  { number: "10+", label: t(h.stats.experience) },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-serif text-primary font-semibold">{stat.number}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Button variant="default" asChild>
                <Link to="/sobre-iveth">{t(h.learnMore)} <ArrowRight size={16} /></Link>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Why Invest */}
      <AnimatedSection className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(h.whyFloridaLabel)}</p>
            <h2 className="text-3xl md:text-4xl font-serif max-w-2xl mx-auto">{t(h.whyFloridaTitle)}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyItems.map((item, i) => (
              <AnimatedSection as="div" key={t(item.title)} delay={i * 100} className="bg-background p-8 rounded-sm border border-border hover:shadow-lg transition-shadow">
                <item.icon size={28} className="text-primary mb-4" />
                <h3 className="font-serif text-lg mb-3">{t(item.title)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(item.desc)}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Projects */}
      <AnimatedSection className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(h.portfolioLabel)}</p>
              <h2 className="text-3xl md:text-4xl font-serif">{t(h.portfolioTitle)}</h2>
            </div>
            <Button variant="outline" asChild><Link to="/proyectos">{t(h.viewAll)}</Link></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <AnimatedSection as="div" key={project.title} delay={i * 150} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-sm mb-4">
                  <img src={project.image} alt={project.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={800} height={600} />
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 tracking-wider uppercase">
                    {t(h.projectTags[project.tagKey])}
                  </span>
                </div>
                <h3 className="font-serif text-xl mb-1">{project.title}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2"><MapPin size={14} />{project.location}</div>
                <p className="text-primary font-semibold">{t(h.projectPricePrefix)} {project.price}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="py-20 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(h.testimonialsLabel)}</p>
            <h2 className="text-3xl md:text-4xl font-serif">{t(h.testimonialsTitle)}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {h.testimonials.map((item, i) => (
              <AnimatedSection as="div" key={item.name} delay={i * 150} className="border border-primary-foreground/10 p-8 rounded-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-primary-foreground/80 leading-relaxed mb-6 italic">"{t(item.text)}"</p>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-primary-foreground/50">{t(item.country)}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Contact CTA */}
      <AnimatedSection className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(h.ctaLabel)}</p>
          <h2 className="text-3xl md:text-4xl font-serif mb-6">{t(h.ctaTitle)}</h2>
          <p className="text-muted-foreground leading-relaxed mb-10">{t(h.ctaDesc)}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild><Link to="/contacto">{t(h.ctaButton1)}</Link></Button>
            <Button variant="gold" size="lg" asChild>
              <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">{t(h.ctaButton2)}</a>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default Index;
