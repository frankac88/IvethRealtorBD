import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

import AnimatedSection from "@/components/AnimatedSection";
import Layout from "@/components/Layout";
import { ProjectCitySection } from "@/components/projects/ProjectCitySection";
import { ProjectImagePlaceholder } from "@/components/projects/ProjectImagePlaceholder";
import { ProjectsLuxuryFilter } from "@/components/projects/ProjectsLuxuryFilter";
import { Button } from "@/components/ui/button";
import {
  defaultProjectFilters,
  filterLuxuryProjects,
  luxuryPlaceholderProjects,
  type LuxuryProjectFilters,
  type ProjectBudgetRange,
  type ProjectCity,
  type ProjectGoal,
  type ProjectRentalType,
} from "@/features/projects/luxuryPlaceholderCatalog";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";

const copy = {
  heroEyebrow: { es: "Selección privada · Florida", en: "Private selection · Florida" },
  heroTitle: {
    es: "Oportunidades que no se eligen por catálogo.",
    en: "Opportunities you do not choose from a catalog.",
  },
  heroSubtitle: {
    es: "Una curaduría de proyectos en Miami y Orlando filtrada por ubicación, renta, valorización y perfil del comprador.",
    en: "A curated selection of Miami and Orlando projects filtered by location, rental demand, appreciation, and buyer profile.",
  },
  explore: { es: "Explorar selección", en: "Explore selection" },
  whatsapp: { es: "WhatsApp", en: "WhatsApp" },
  privateAdvisory: { es: "Private advisory", en: "Private advisory" },
  maxProjects: { es: "10 proyectos máximo", en: "10 projects maximum" },
  maxProjectsDescription: {
    es: "Menos ruido, más criterio: 6 Miami + 4 Orlando.",
    en: "Less noise, more judgment: 6 Miami + 4 Orlando.",
  },
  noResultsTitle: {
    es: "No encontramos una coincidencia exacta.",
    en: "We did not find an exact match.",
  },
  noResultsBody: {
    es: "Puedo ayudarte a filtrar oportunidades privadas según presupuesto, renta esperada y objetivo.",
    en: "I can help you filter private opportunities by budget, expected rental profile, and goal.",
  },
  differentiatorEyebrow: { es: "Diferencial Iveth Coll", en: "Iveth Coll difference" },
  differentiatorTitle: {
    es: "No todos los proyectos merecen tu atención.",
    en: "Not every project deserves your attention.",
  },
  differentiatorBody: {
    es: "Selecciono oportunidades considerando ubicación, demanda de renta, perfil del comprador y potencial de valorización. Mi trabajo no es mostrarte todo: es ayudarte a filtrar mejor.",
    en: "I select opportunities by weighing location, rental demand, buyer profile, and appreciation potential. My job is not to show everything; it is to help you filter better.",
  },
  finalTitle: {
    es: "¿Cuál proyecto encaja con tu estrategia?",
    en: "Which project fits your strategy?",
  },
  finalBody: {
    es: "Hablemos de presupuesto, objetivo y horizonte de inversión antes de pedir disponibilidad actualizada.",
    en: "Let us talk budget, goal, and investment horizon before requesting updated availability.",
  },
  agenda: { es: "Agenda asesoría", en: "Schedule advisory" },
} as const;

const isProjectCity = (value: string | null): value is ProjectCity => value === "miami" || value === "orlando";
const isProjectGoal = (value: string | null): value is ProjectGoal =>
  value === "investment" || value === "vacation-rental" || value === "primary-home" || value === "long-term";
const isRentalType = (value: string | null): value is ProjectRentalType =>
  value === "flexible" || value === "short-term" || value === "30-90-days" || value === "long-term";
const isBudgetRange = (value: string | null): value is ProjectBudgetRange =>
  value === "under-500k" || value === "500k-1m" || value === "1m-2m" || value === "2m-plus";

const getFiltersFromParams = (searchParams: URLSearchParams): LuxuryProjectFilters => ({
  city: isProjectCity(searchParams.get("city")) ? searchParams.get("city") as ProjectCity : "all",
  goal: isProjectGoal(searchParams.get("goal")) ? searchParams.get("goal") as ProjectGoal : "all",
  rentalType: isRentalType(searchParams.get("rental")) ? searchParams.get("rental") as ProjectRentalType : "all",
  budgetRange: isBudgetRange(searchParams.get("budget")) ? searchParams.get("budget") as ProjectBudgetRange : "all",
});

const updateParamsFromFilters = (filters: LuxuryProjectFilters) => {
  const params = new URLSearchParams();

  if (filters.city !== "all") params.set("city", filters.city);
  if (filters.goal !== "all") params.set("goal", filters.goal);
  if (filters.rentalType !== "all") params.set("rental", filters.rentalType);
  if (filters.budgetRange !== "all") params.set("budget", filters.budgetRange);

  return params;
};

const groupByCity = (projects: typeof luxuryPlaceholderProjects) => ({
  miami: projects.filter((project) => project.city === "miami"),
  orlando: projects.filter((project) => project.city === "orlando"),
});

const ProjectsPage = () => {
  const t = useT();
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<LuxuryProjectFilters>(() => getFiltersFromParams(searchParams));
  const contactPath = `${getLocalizedPath("contact", language)}#contact-form-view`;

  useEffect(() => {
    setFilters(getFiltersFromParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const nextParams = updateParamsFromFilters(filters);
    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  const filteredProjects = useMemo(
    () => filterLuxuryProjects(luxuryPlaceholderProjects, filters),
    [filters],
  );
  const groupedProjects = useMemo(() => groupByCity(filteredProjects), [filteredProjects]);
  const showNoResults = filteredProjects.length === 0;

  const handleFilterChange = <Key extends keyof LuxuryProjectFilters>(
    key: Key,
    value: LuxuryProjectFilters[Key],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => setFilters(defaultProjectFilters);

  return (
    <Layout>
      <section className="relative isolate overflow-hidden bg-background">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(138,85,121,0.16),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(42,123,137,0.14),transparent_30%)]" />
        <div className="container mx-auto grid min-h-[calc(100vh-7rem)] gap-10 px-4 py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8 lg:py-24">
          <AnimatedSection as="div" className="relative z-10">
            <p className="type-caption text-primary">{t(copy.heroEyebrow)}</p>
            <h1 className="mt-5 max-w-4xl font-serif text-[3.05rem] font-medium leading-[0.92] tracking-[-0.055em] text-wine md:text-[5rem] xl:text-[6rem]">
              {t(copy.heroTitle)}
            </h1>
            <p className="type-body mt-6 max-w-2xl text-foreground/70">{t(copy.heroSubtitle)}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="bg-primary text-primary-foreground shadow-[0_18px_44px_rgba(42,123,137,0.22)] hover:bg-green-light">
                <a href="#project-selection">
                  {t(copy.explore)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild className="bg-wine text-white shadow-[0_18px_44px_rgba(124,63,99,0.22)] hover:bg-accent">
                <Link to={contactPath}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t(copy.whatsapp)}
                </Link>
              </Button>
            </div>
          </AnimatedSection>

          <AnimatedSection as="div" delay={120} className="relative min-h-[26rem]">
            <ProjectImagePlaceholder
              label={t({ es: "Imagen hero principal", en: "Main hero image" })}
              tone="teal"
              className="absolute right-0 top-0 h-[22rem] w-[82%] md:h-[28rem]"
            />
            <div className="absolute bottom-0 left-0 max-w-[18rem] border border-gold/35 bg-card/95 p-5 shadow-[0_24px_70px_rgba(26,31,46,0.16)]">
              <p className="type-caption text-primary">{t(copy.privateAdvisory)}</p>
              <p className="mt-3 font-serif text-3xl leading-none tracking-[-0.04em] text-wine">
                {t(copy.maxProjects)}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(copy.maxProjectsDescription)}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <ProjectsLuxuryFilter
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        resultCount={filteredProjects.length}
      />

      <div id="project-selection" className="scroll-mt-28">
        {showNoResults ? (
          <section className="py-20">
            <div className="container mx-auto px-4 lg:px-8">
              <AnimatedSection
                as="div"
                className="border border-dashed border-wine/35 bg-card/80 p-10 text-center shadow-[0_24px_70px_rgba(26,31,46,0.08)]"
              >
                <Sparkles className="mx-auto h-8 w-8 text-primary" />
                <h2 className="type-h2 mt-4 text-wine">{t(copy.noResultsTitle)}</h2>
                <p className="type-body mx-auto mt-4 max-w-2xl">{t(copy.noResultsBody)}</p>
                <Button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 bg-primary text-primary-foreground hover:bg-green-light"
                >
                  {t({ es: "Ver selección completa", en: "View full selection" })}
                </Button>
              </AnimatedSection>
            </div>
          </section>
        ) : (
          <>
            <ProjectCitySection city="miami" projects={groupedProjects.miami} className="bg-background" />
            <ProjectCitySection city="orlando" projects={groupedProjects.orlando} className="bg-muted/50" />
          </>
        )}
      </div>

      <section className="relative overflow-hidden bg-card py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(42,123,137,0.12),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(138,85,121,0.12),transparent_30%)]" />
        <div className="container relative mx-auto grid gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
          <AnimatedSection as="div" className="relative min-h-[20rem]">
            <ProjectImagePlaceholder
              label={t({ es: "Iveth / ciudad", en: "Iveth / city" })}
              tone="sand"
              className="absolute inset-0 right-8"
            />
            <div className="absolute bottom-0 right-0 max-w-[13rem] bg-wine p-5 text-white shadow-[0_22px_55px_rgba(124,63,99,0.28)]">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em]">Iveth Coll</p>
              <p className="mt-2 font-serif text-2xl leading-none tracking-[-0.035em]">
                {t({ es: "Curaduría primero.", en: "Curation first." })}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection as="div" delay={120}>
            <p className="type-caption text-primary">{t(copy.differentiatorEyebrow)}</p>
            <h2 className="type-h2 mt-3 text-wine">{t(copy.differentiatorTitle)}</h2>
            <p className="type-body mt-5 max-w-2xl text-foreground/72">{t(copy.differentiatorBody)}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="bg-wine text-white hover:bg-accent">
                <Link to={contactPath}>{t(copy.agenda)}</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-green-light">
                <Link to={contactPath}>{t(copy.whatsapp)}</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-background py-20 md:py-24">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <AnimatedSection as="div" className="mx-auto max-w-3xl">
            <p className="type-caption text-primary">{t({ es: "Siguiente paso", en: "Next step" })}</p>
            <h2 className="type-h2 mt-3 text-wine">{t(copy.finalTitle)}</h2>
            <p className="type-body mx-auto mt-4 max-w-2xl">{t(copy.finalBody)}</p>
            <Button asChild className="mt-7 bg-primary px-7 text-primary-foreground hover:bg-green-light">
              <Link to={contactPath}>
                {t(copy.agenda)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;
