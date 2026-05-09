import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

import AnimatedSection from "@/components/AnimatedSection";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { ProjectCitySection } from "@/components/projects/ProjectCitySection";
import { ProjectsLuxuryFilter } from "@/components/projects/ProjectsLuxuryFilter";
import { Button } from "@/components/ui/button";
import projectsHeroMiami from "@/assets/hero-projects-florida-wide.webp";
import differentiatorImage from "@/assets/iveth-differentiator.webp";
import { createWhatsAppHref, getWhatsAppMessage, whatsappMessages } from "@/config/site";
import {
  defaultProjectFilters,
  filterLuxuryProjects,
  luxuryPlaceholderProjects,
  type LuxuryProject,
  type LuxuryProjectFilters,
  type ProjectBudgetRange,
  type ProjectCity,
  type ProjectGoal,
  type ProjectRentalType,
} from "@/features/projects/luxuryPlaceholderCatalog";
import { projectItemsToLuxuryProjects } from "@/features/projects/luxuryProjectAdapter";
import { usePublishedProjectsQuery } from "@/features/projects/hooks";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";

const copy = {
  heroEyebrow: {
    es: "Selección privada · Florida",
    en: "Private selection · Florida",
  },
  heroTitle: {
    es: "Proyectos seleccionados con visión de inversión.",
    en: "Projects selected with an investment vision.",
  },
  heroSubtitle: {
    es: "Ubicación, demanda de renta y potencial de valorización en Miami y Orlando.",
    en: "Location, rental demand, and appreciation potential in Miami and Orlando.",
  },
  explore: { es: "Explorar selección", en: "Explore selection" },
  whatsapp: { es: "WhatsApp", en: "WhatsApp" },
  privateAdvisory: { es: "Criterios de selección", en: "Selection criteria" },
  maxProjects: {
    es: "Renta · Entrega 2029–2030 · Desde $380K",
    en: "Rental · 2029–2030 delivery · From $380K",
  },
  maxProjectsDescription: {
    es: "Entrada seleccionada a Florida: ubicaciones con demanda, renta flexible y potencial de valorización desde $380K.",
    en: "Selected entry into Florida: demand-driven locations, flexible rental options, and appreciation potential from $380K.",
  },
  noResultsTitle: {
    es: "No encontramos una coincidencia exacta.",
    en: "We did not find an exact match.",
  },
  noResultsBody: {
    es: "Puedo ayudarte a filtrar oportunidades privadas según presupuesto, renta esperada y objetivo.",
    en: "I can help you filter private opportunities by budget, expected rental profile, and goal.",
  },
  differentiatorEyebrow: {
    es: "Método Iveth Coll",
    en: "Iveth Coll method",
  },
  differentiatorTitle: {
    es: "No todos los proyectos merecen tu atención.",
    en: "Not every project deserves your attention.",
  },
  differentiatorBody: {
    es: "Selecciono oportunidades considerando ubicación, demanda de renta, perfil del comprador y potencial de valorización. Mas que mostrar opciones, mi trabajo es ayudarte a tomar decisiones estrategicas.",
    en: "I select opportunities by weighing location, rental demand, buyer profile, and appreciation potential. My job is not to show everything; it is to help you make strategic decisions.",
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

const isProjectCity = (value: string | null): value is ProjectCity =>
  value === "miami" || value === "orlando";
const isProjectGoal = (value: string | null): value is ProjectGoal =>
  value === "investment" ||
  value === "vacation-rental" ||
  value === "primary-home" ||
  value === "long-term";
const isRentalType = (value: string | null): value is ProjectRentalType =>
  value === "flexible" ||
  value === "short-term" ||
  value === "30-90-days" ||
  value === "long-term";
const isBudgetRange = (value: string | null): value is ProjectBudgetRange =>
  value === "under-500k" ||
  value === "500k-1m" ||
  value === "1m-2m" ||
  value === "2m-plus";

const getFiltersFromParams = (
  searchParams: URLSearchParams,
): LuxuryProjectFilters => ({
  city: isProjectCity(searchParams.get("city"))
    ? (searchParams.get("city") as ProjectCity)
    : "all",
  goal: isProjectGoal(searchParams.get("goal"))
    ? (searchParams.get("goal") as ProjectGoal)
    : "all",
  rentalType: isRentalType(searchParams.get("rental"))
    ? (searchParams.get("rental") as ProjectRentalType)
    : "all",
  budgetRange: isBudgetRange(searchParams.get("budget"))
    ? (searchParams.get("budget") as ProjectBudgetRange)
    : "all",
});

const getProjectBySlug = (projects: LuxuryProject[], slug: string | null) =>
  projects.find((project) => project.slug === slug) ?? null;

const getSelectionFromProject = (
  project: LuxuryProject | null,
): Partial<Record<ProjectCity, string>> =>
  project ? { [project.city]: project.slug } : {};

const updateParamsFromFilters = (
  filters: LuxuryProjectFilters,
  selectedProjectSlug?: string | null,
) => {
  const params = new URLSearchParams();

  if (filters.city !== "all") params.set("city", filters.city);
  if (filters.goal !== "all") params.set("goal", filters.goal);
  if (filters.rentalType !== "all") params.set("rental", filters.rentalType);
  if (filters.budgetRange !== "all") params.set("budget", filters.budgetRange);
  if (selectedProjectSlug) params.set("project", selectedProjectSlug);

  return params;
};

const groupByCity = (projects: LuxuryProject[]) => ({
  miami: projects.filter((project) => project.city === "miami"),
  orlando: projects.filter((project) => project.city === "orlando"),
});

const ProjectsPage = () => {
  const t = useT();
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: publishedProjects = [] } = usePublishedProjectsQuery();
  const catalogProjects = useMemo(() => {
    const supabaseProjects = projectItemsToLuxuryProjects(publishedProjects);
    return supabaseProjects.length > 0
      ? supabaseProjects
      : luxuryPlaceholderProjects;
  }, [publishedProjects]);
  const [filters, setFilters] = useState<LuxuryProjectFilters>(() =>
    getFiltersFromParams(searchParams),
  );
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(
    () => {
      const selectedProject = getProjectBySlug(
        luxuryPlaceholderProjects,
        searchParams.get("project"),
      );
      return selectedProject?.slug ?? null;
    },
  );
  const [selectedProjectByCity, setSelectedProjectByCity] = useState<
    Partial<Record<ProjectCity, string>>
  >(() => {
    const selectedProject = getProjectBySlug(
      luxuryPlaceholderProjects,
      searchParams.get("project"),
    );
    return getSelectionFromProject(selectedProject);
  });
  const contactPath = `${getLocalizedPath("contact", language)}#contact-form-view`;
  const projectsWhatsappHref = createWhatsAppHref(
    getWhatsAppMessage(whatsappMessages.projectsPage, language),
  );

  useEffect(() => {
    setFilters(getFiltersFromParams(searchParams));
    const selectedProject = getProjectBySlug(
      catalogProjects,
      searchParams.get("project"),
    );

    if (selectedProject) {
      setSelectedProjectSlug(selectedProject.slug);
      setSelectedProjectByCity((prev) => ({
        ...prev,
        [selectedProject.city]: selectedProject.slug,
      }));
    }
  }, [catalogProjects, searchParams]);

  useEffect(() => {
    const nextParams = updateParamsFromFilters(filters, selectedProjectSlug);
    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [filters, searchParams, selectedProjectSlug, setSearchParams]);

  const filteredProjects = useMemo(
    () => filterLuxuryProjects(catalogProjects, filters),
    [catalogProjects, filters],
  );
  const groupedProjects = useMemo(
    () => groupByCity(filteredProjects),
    [filteredProjects],
  );
  const showNoResults = filteredProjects.length === 0;

  const handleFilterChange = <Key extends keyof LuxuryProjectFilters>(
    key: Key,
    value: LuxuryProjectFilters[Key],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => setFilters(defaultProjectFilters);
  const handleSelectProject = (project: LuxuryProject) => {
    setSelectedProjectSlug(project.slug);
    setSelectedProjectByCity((prev) => ({
      ...prev,
      [project.city]: project.slug,
    }));
  };

  return (
    <Layout>
      <SEO 
        title={t(copy.heroTitle)}
        description={t(copy.heroSubtitle).substring(0, 160)}
        canonicalUrl={`https://www.ivethcollrealtor.com${getLocalizedPath("projects", language)}`}
      />
      <section className="relative isolate overflow-hidden bg-background">
        <div className="absolute inset-0 -z-10">
          <img
            src={projectsHeroMiami}
            alt={t({
              es: "Vista panorámica de Miami",
              en: "Panoramic view of Miami",
            })}
            className="h-full w-full object-cover object-[center_60%]"
            loading="eager"
            fetchPriority="high"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
        </div>
        <div className="container mx-auto flex min-h-[calc(100vh-7rem)] items-center px-4 py-20 lg:px-8 lg:py-24">
          <AnimatedSection as="div" className="relative z-10 max-w-3xl">
            <p className="type-caption font-bold text-primary drop-shadow-[0_2px_10px_rgba(255,255,255,0.72)]">
              {t(copy.heroEyebrow)}
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-[3.05rem] font-medium leading-[0.92] tracking-[-0.055em] text-wine md:text-[5rem] xl:text-[6rem]">
              {t(copy.heroTitle)}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 tracking-[-0.01em] text-foreground drop-shadow-[0_2px_10px_rgba(255,255,255,0.72)] md:text-xl">
              {t(copy.heroSubtitle)}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="bg-wine text-white shadow-[0_18px_44px_rgba(124,63,99,0.22)] hover:bg-accent"
              >
                <a href="#project-selection">
                  {t(copy.explore)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                className="bg-primary text-primary-foreground shadow-[0_18px_44px_rgba(42,123,137,0.22)] hover:bg-green-light"
              >
                <a
                  href={projectsWhatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t(copy.whatsapp)}
                </a>
              </Button>
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
                className="rounded-[2rem] border border-dashed border-wine/35 bg-card/80 p-10 text-center shadow-[0_24px_70px_rgba(26,31,46,0.08)]"
              >
                <Sparkles className="mx-auto h-8 w-8 text-primary" />
                <h2 className="type-h2 mt-4 text-wine">
                  {t(copy.noResultsTitle)}
                </h2>
                <p className="type-body mx-auto mt-4 max-w-2xl">
                  {t(copy.noResultsBody)}
                </p>
                <Button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 bg-primary text-primary-foreground hover:bg-green-light"
                >
                  {t({
                    es: "Ver selección completa",
                    en: "View full selection",
                  })}
                </Button>
              </AnimatedSection>
            </div>
          </section>
        ) : (
          <>
            <ProjectCitySection
              city="miami"
              projects={groupedProjects.miami}
              selectedProjectSlug={selectedProjectByCity.miami}
              onSelectProject={handleSelectProject}
              className="bg-background"
            />
            <ProjectCitySection
              city="orlando"
              projects={groupedProjects.orlando}
              selectedProjectSlug={selectedProjectByCity.orlando}
              onSelectProject={handleSelectProject}
              className="bg-muted/50"
            />
          </>
        )}
      </div>

      <section className="relative overflow-hidden bg-card py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(42,123,137,0.12),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(138,85,121,0.12),transparent_30%)]" />
        <div className="container relative mx-auto grid gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
          <AnimatedSection as="div" className="relative min-h-[20rem]">
            <div className="absolute inset-0 left-8 overflow-hidden rounded-[2rem] border border-gold/30 shadow-2xl">
              <img
                src={differentiatorImage}
                alt={t({
                  es: "Selección Iveth Coll",
                  en: "Iveth Coll Selection",
                })}
                className="h-full w-full object-cover"
                loading="lazy"
                width={800}
                height={1000}
              />
            </div>
            <div className="absolute bottom-0 left-0 max-w-[13rem] bg-wine p-5 text-white shadow-[0_22px_55px_rgba(124,63,99,0.28)]">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
                Iveth Coll
              </p>
              <p className="mt-2 font-serif text-2xl leading-none tracking-[-0.035em]">
                {t({ es: "Internacional Real Estate Advisor", en: "International Real Estate Advisor" })}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection as="div" delay={120}>
            <p className="type-caption text-primary">
              {t(copy.differentiatorEyebrow)}
            </p>
            <h2 className="type-h2 mt-3 text-wine">
              {t(copy.differentiatorTitle)}
            </h2>
            <p className="type-body mt-5 max-w-2xl text-foreground/72">
              {t(copy.differentiatorBody)}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="bg-wine text-white hover:bg-accent">
                <Link to={contactPath}>{t(copy.agenda)}</Link>
              </Button>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-green-light"
              >
                <a
                  href={projectsWhatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(copy.whatsapp)}
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-background py-20 md:py-24">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <AnimatedSection as="div" className="mx-auto max-w-3xl">
            <p className="type-caption text-primary">
              {t({ es: "Siguiente paso", en: "Next step" })}
            </p>
            <h2 className="type-h2 mt-3 text-wine">{t(copy.finalTitle)}</h2>
            <p className="type-body mx-auto mt-4 max-w-2xl">
              {t(copy.finalBody)}
            </p>
            <Button
              asChild
              className="mt-7 bg-primary px-7 text-primary-foreground hover:bg-green-light"
            >
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
