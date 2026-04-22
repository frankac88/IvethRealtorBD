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
import acmmLogo from "@/assets/acmm-logo.webp";
import fortexLogo from "@/assets/fortex-logo.webp";
import ftgLogo from "@/assets/ftg-logo.webp";
import hostLogo from "@/assets/host-logo.webp";
import homeFinancingExpertsLogo from "@/assets/home-financing-experts-logo.webp";
import ivethImg from "@/assets/veth-team.webp";
import ricardoImg from "@/assets/ricardo-team.webp";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { teamTranslations } from "@/i18n/translations/team";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const TeamPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const tm = teamTranslations;

  const teamMembers = [
    {
      name: "Iveth Coll",
      image: ivethImg,
      role: tm.ivethRole,
      description: tm.ivethDesc,
      ctaLabel: tm.learnMore,
      ctaPath: `${getLocalizedPath("contact", language)}#contact-form-view`,
      imageAlt: "Iveth Coll",
    },
    {
      name: "Ricardo Suarez",
      image: ricardoImg,
      role: tm.ricardoRole,
      description: tm.ricardoDesc,
      ctaLabel: tm.viewOptions,
      ctaPath: getLocalizedPath("financing", language),
      imageAlt: "Ricardo Suarez",
    },
  ] as const;

  const partnerCompanies: ReadonlyArray<{
    name: string;
    logo: string;
    badge: { es: string; en: string };
    description: { es: string; en: string };
    logoClassName: string;
    titleClassName?: string;
    alt: string;
  }> = [
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
    {
      name: "HOST",
      logo: hostLogo,
      badge: tm.hostBadge,
      description: tm.hostDesc,
      logoClassName: "h-24 sm:h-28 w-auto rounded-md object-contain",
      alt: "Logo de HOST",
    },
  ] as const;

  return (
    <Layout>
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <p className="type-caption mb-4">{t(tm.label)}</p>
          <h1 className="type-h1 mb-4">{t(tm.title)}</h1>
          <p className="type-body mx-auto max-w-xl">{t(tm.subtitle)}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
            {teamMembers.map((member, index) => (
              <AnimatedSection
                as="article"
                key={member.name}
                data-testid="team-profile-card"
                delay={index * 120}
                className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-primary/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,245,239,0.98)_100%)] p-6 text-center shadow-[0_20px_60px_rgba(31,41,55,0.08)] ring-1 ring-[rgba(194,168,120,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(31,41,55,0.12)] md:p-8"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(194,168,120,0.18),transparent_72%)]" />
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(194,168,120,0.8)] to-transparent" />

                <div className="relative flex h-full flex-col">
                  <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-[rgba(194,168,120,0.95)]" />
                    <span className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-primary/80">
                      {t(member.role)}
                    </span>
                  </div>

                  <div className="mx-auto mb-7 w-full max-w-[19.5rem] rounded-[26px] border border-white/70 bg-white/75 p-3 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
                    <div className="overflow-hidden rounded-[20px]">
                      <img
                        src={member.image}
                        alt={member.imageAlt}
                        className="aspect-square h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <h2 className="mb-2 font-serif text-[2.15rem] leading-tight tracking-[-0.03em] text-primary">
                    {member.name}
                  </h2>
                  <div className="mx-auto mb-5 h-px w-20 bg-gradient-to-r from-transparent via-[rgba(194,168,120,0.95)] to-transparent" />
                  <p
                    lang={language}
                    className="type-body-sm mx-auto max-w-md text-justify text-muted-foreground"
                    style={{ hyphens: "auto", overflowWrap: "break-word" }}
                  >
                    {t(member.description)}
                  </p>

                  <div className="mt-auto pt-8">
                    <Button
                      variant="default"
                      size="sm"
                      className="min-w-[150px] rounded-full bg-primary px-6 shadow-[0_12px_24px_rgba(42,123,136,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
                      asChild
                    >
                      <Link to={member.ctaPath}>{t(member.ctaLabel)}</Link>
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AnimatedSection className="bg-muted py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="type-caption mb-4">{t(tm.partnersLabel)}</p>
            <h2 className="type-h2 mb-4 text-primary">{t(tm.partnersTitle)}</h2>
            <p className="type-body max-w-2xl">{t(tm.partnersSubtitle)}</p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {partnerCompanies.map((company, index) => (
              <AnimatedSection
                as="div"
                key={company.name}
                delay={index * 120}
                className="group flex h-full w-full flex-col rounded-[28px] border border-border/60 bg-background/90 p-7 shadow-[0_18px_45px_rgba(26,31,46,0.08)] transition-transform duration-300 hover:-translate-y-1"
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
                  <h3 className={cn("mt-6 min-h-[2.75rem] font-serif text-[2rem] leading-tight tracking-[-0.02em] text-primary", company.titleClassName)}>{company.name}</h3>
                  <p
                    className="type-body-sm mt-1 text-muted-foreground"
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
                          <DialogTitle className="font-serif text-[2rem] tracking-[-0.02em] text-primary">{company.name}</DialogTitle>
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
                        <p className="type-body-sm text-muted-foreground [text-align:justify] [hyphens:auto] [overflow-wrap:break-word]">{t(company.description)}</p>
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








