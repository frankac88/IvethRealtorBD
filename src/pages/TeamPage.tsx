import AnimatedSection from "@/components/AnimatedSection";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import acmmLogo from "@/assets/acmm-logo.png";
import fortexLogo from "@/assets/fortex-logo.png";
import ftgLogo from "@/assets/ftg-logo.png";
import homeFinancingExpertsLogo from "@/assets/home-financing-experts-logo.jpg";
import ivethImg from "@/assets/veth-team.webp";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { teamTranslations } from "@/i18n/translations/team";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const TeamPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const tm = teamTranslations;

  const partnerCompanies = [
    {
      name: "ACMM Consulting",
      logo: acmmLogo,
      badge: tm.acmmBadge,
      description: tm.acmmDesc,
      logoClassName: "h-28 sm:h-32 w-auto",
      alt: "Logo de ACMM Consulting",
    },
    {
      name: "First Title Group",
      logo: ftgLogo,
      badge: tm.ftgBadge,
      description: tm.ftgDesc,
      logoClassName: "h-20 sm:h-24 w-auto",
      alt: "Logo de First Title Group",
    },
    {
      name: "Fortex Realty",
      logo: fortexLogo,
      badge: tm.fortexBadge,
      description: tm.fortexDesc,
      logoClassName: "h-28 sm:h-32 w-auto",
      alt: "Logo de Fortex Realty",
    },
    {
      name: "Home Financing Experts",
      logo: homeFinancingExpertsLogo,
      badge: tm.hfeBadge,
      description: tm.hfeDesc,
      logoClassName: "h-28 sm:h-32 w-auto rounded-md object-contain",
      titleClassName: "mt-6 md:mt-8",
      alt: "Logo de Home Financing Experts",
    },
  ] as const;

  return (
    <Layout>
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">{t(tm.label)}</p>
          <h1 className="mb-4 text-4xl font-serif md:text-5xl">{t(tm.title)}</h1>
          <p className="mx-auto max-w-xl text-muted-foreground">{t(tm.subtitle)}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 lg:px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-16 md:grid-cols-2">
            <div className="text-center">
              <img src={ivethImg} alt="Iveth Coll" className="mx-auto mb-6 h-64 w-64 rounded-sm object-cover" loading="lazy" />
              <h2 className="mb-1 font-serif text-2xl">Iveth Coll</h2>
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">{t(tm.ivethRole)}</p>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{t(tm.ivethDesc)}</p>
              <Button variant="default" size="sm" asChild><Link to={getLocalizedPath("about", language)}>{t(tm.learnMore)}</Link></Button>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-64 w-64 items-center justify-center rounded-sm bg-card ring-1 ring-border/50">
                <span className="font-serif text-4xl text-muted-foreground">RS</span>
              </div>
              <h2 className="mb-1 font-serif text-2xl">Ricardo Suarez</h2>
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">{t(tm.ricardoRole)}</p>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{t(tm.ricardoDesc)}</p>
              <Button variant="default" size="sm" asChild><Link to={getLocalizedPath("financing", language)}>{t(tm.viewOptions)}</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection className="bg-muted py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">{t(tm.partnersLabel)}</p>
            <h2 className="mb-4 font-serif text-3xl text-primary md:text-4xl">{t(tm.partnersTitle)}</h2>
            <p className="max-w-2xl leading-relaxed text-muted-foreground">{t(tm.partnersSubtitle)}</p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {partnerCompanies.map((company, index) => (
              <AnimatedSection
                as="div"
                key={company.name}
                delay={index * 120}
                className="group flex h-full flex-col rounded-[28px] border border-border/60 bg-background/90 p-7 shadow-[0_18px_45px_rgba(26,31,46,0.08)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-full flex-col">
                  <div className="mx-auto inline-flex w-fit rounded-full border border-primary/10 bg-primary/5 px-4 py-1 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-primary/80">
                    {t(company.badge)}
                  </div>
                  <div className="mt-6 flex h-[136px] items-center justify-center">
                    <img
                      src={company.logo}
                      alt={company.alt}
                      className={company.logoClassName}
                      loading="lazy"
                    />
                  </div>
                  <h3 className={cn("mt-6 min-h-[2.75rem] font-serif text-2xl leading-tight text-primary", company.titleClassName)}>{company.name}</h3>
                  <p
                    className="mt-1 text-sm leading-7 text-muted-foreground"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textAlign: "justify",
                      hyphens: "auto",
                      overflowWrap: "break-word",
                    }}
                  >
                    {t(company.description)}
                  </p>

                  <div className="mt-auto pt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="px-3 py-1.5 text-xs">
                          {t(tm.viewMore)}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[640px]">
                        <DialogHeader>
                          <DialogTitle className="font-serif text-2xl text-primary">{company.name}</DialogTitle>
                          <DialogDescription>{t(company.badge)}</DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center justify-center py-2">
                          <img
                            src={company.logo}
                            alt={company.alt}
                            className={company.logoClassName}
                            loading="lazy"
                          />
                        </div>
                        <p className="text-sm leading-7 text-muted-foreground [text-align:justify] [hyphens:auto] [overflow-wrap:break-word]">{t(company.description)}</p>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default TeamPage;




