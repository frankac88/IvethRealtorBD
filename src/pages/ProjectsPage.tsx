import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarClock,
  CarFront,
  MapPin,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

import AnimatedSection from "@/components/AnimatedSection";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { type ProjectItem } from "@/features/projects/catalog";
import { usePublishedProjectsQuery } from "@/features/projects/hooks";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { projectsTranslations } from "@/i18n/translations/projects";

const labels = {
  search: { es: "Buscar", en: "Search" },
  searchPlaceholder: {
    es: "Buscar por proyecto, zona o característica",
    en: "Search by project, area, or feature",
  },
  filtersTitle: { es: "Filtra oportunidades", en: "Filter opportunities" },
  allLocations: { es: "Todas las ubicaciones", en: "All locations" },
  allTypes: { es: "Todos los tipos", en: "All types" },
  allPrices: { es: "Todos los precios", en: "All prices" },
  location: { es: "Ubicación", en: "Location" },
  type: { es: "Tipo", en: "Type" },
  price: { es: "Precio", en: "Price" },
  results: { es: "resultados", en: "results" },
  priceFrom: { es: "Precios desde", en: "Prices from" },
  residences: { es: "Residencias desde", en: "Residences from" },
  baths: { es: "Baños", en: "Bathrooms" },
  delivery: { es: "Entrega", en: "Delivery" },
  idealFor: { es: "Ideal para", en: "Ideal for" },
  parking: { es: "Parqueadero", en: "Parking" },
  hook: { es: "Destacado", en: "Highlight" },
  notAvailable: { es: "—", en: "—" },
  clearFilters: { es: "Limpiar filtros", en: "Clear filters" },
  loading: { es: "Cargando proyectos…", en: "Loading projects…" },
  unavailable: {
    es: "No pudimos cargar los proyectos ahora mismo. Intenta nuevamente en unos minutos.",
    en: "We could not load projects right now. Please try again in a few minutes.",
  },
  emptyCatalog: {
    es: "Aún no hay proyectos publicados en el catálogo.",
    en: "There are no published projects in the catalog yet.",
  },
  noResults: {
    es: "No encontramos proyectos con esos filtros. Prueba otra ubicación o estrategia.",
    en: "No projects matched those filters. Try another location or strategy.",
  },
} as const;

const detailIconClassName = "h-[0.95rem] w-[0.95rem] text-primary";
const detailLabelClassName =
  "text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-foreground/58";
const detailValueClassName = "mt-0.5 text-[0.92rem] leading-5 text-foreground";

const formatPriceFrom = (value: number, language: "es" | "en") =>
  new Intl.NumberFormat(language === "es" ? "es-US" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const priceRanges = [
  { value: "under-500k", min: null, max: 500000 },
  { value: "500k-1m", min: 500000, max: 1000000 },
  { value: "1m-2m", min: 1000000, max: 2000000 },
  { value: "2m-plus", min: 2000000, max: null },
] as const;

const priceRangeLabels: Record<(typeof priceRanges)[number]["value"], { es: string; en: string }> = {
  "under-500k": { es: "Hasta $500K", en: "Up to $500K" },
  "500k-1m": { es: "$500K - $1M", en: "$500K - $1M" },
  "1m-2m": { es: "$1M - $2M", en: "$1M - $2M" },
  "2m-plus": { es: "$2M+", en: "$2M+" },
};

const dedupeLocalizedOptions = (
  items: ProjectItem[],
  selector: (item: ProjectItem) => { es: string; en: string },
) => {
  const map = new Map<string, { es: string; en: string }>();

  items.forEach((item) => {
    const option = selector(item);
    const key = `${option.es}|||${option.en}`;

    if (!map.has(key)) {
      map.set(key, option);
    }
  });

  return Array.from(map.values());
};

const estimateCardWeight = (
  project: ProjectItem,
  t: (value: { es: string; en: string }) => string,
) => {
  const values = [
    project.title,
    t(project.location),
    t(project.residences),
    t(project.baths),
    t(project.type),
    t(project.delivery),
    t(project.idealFor),
    project.parking ? t(project.parking) : "",
    t(project.hook),
  ];

  return values.reduce((total, value) => total + value.length, 0);
};

const pairProjectsByEstimatedHeight = (
  items: ProjectItem[],
  t: (value: { es: string; en: string }) => string,
) => {
  const preferredPairs = [["CELEBRATION", "CLERMONT"]] as const;
  const remaining = [...items];
  const paired: ProjectItem[] = [];

  preferredPairs.forEach(([firstTitle, secondTitle]) => {
    const firstIndex = remaining.findIndex((project) => project.title === firstTitle);
    const secondIndex = remaining.findIndex((project) => project.title === secondTitle);

    if (firstIndex === -1 || secondIndex === -1) return;

    const [firstProject] = remaining.splice(firstIndex, 1);
    const adjustedSecondIndex = secondIndex > firstIndex ? secondIndex - 1 : secondIndex;
    const [secondProject] = remaining.splice(adjustedSecondIndex, 1);

    paired.push(firstProject, secondProject);
  });

  const weighted = remaining
    .map((project, index) => ({
      project,
      index,
      weight: estimateCardWeight(project, t),
    }))
    .sort((a, b) => a.weight - b.weight || a.index - b.index);

  const rows: Array<typeof weighted> = [];

  for (let index = 0; index < weighted.length; index += 2) {
    rows.push(weighted.slice(index, index + 2));
  }

  return [
    ...paired,
    ...rows.flatMap((row) =>
      [...row]
        .sort((a, b) => a.index - b.index)
        .map((entry) => entry.project),
    ),
  ];
};

const ProjectDetailRow = ({
  icon,
  label,
  value,
  emphasize = false,
  compact = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  emphasize?: boolean;
  compact?: boolean;
}) => (
  <div
    className={`grid h-full w-full items-start gap-2 rounded-2xl border transition-colors ${
      compact ? "grid-cols-[2.1rem_minmax(0,1fr)] px-2.5 py-2.5" : "grid-cols-[2.5rem_minmax(0,1fr)] px-3 py-3"
    } ${
      emphasize ? "border-primary/20 bg-primary/5" : "border-border/70 bg-muted/30"
    }`}
  >
    <div
      className={`flex items-center justify-center rounded-full bg-background shadow-sm ${
        compact ? "h-8 w-8" : "h-10 w-10"
      }`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className={detailLabelClassName}>{label}</p>
      <p className={`${detailValueClassName} ${emphasize ? "line-clamp-3 text-foreground/90" : ""}`}>
        {value}
      </p>
    </div>
  </div>
);

const ProjectsPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const p = projectsTranslations;
  const { data: projects = [], isLoading, error } = usePublishedProjectsQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("q") ?? "");
  const [selectedLocation, setSelectedLocation] = useState(() => searchParams.get("location") ?? "all");
  const [selectedType, setSelectedType] = useState(() => searchParams.get("type") ?? "all");
  const [selectedPriceRange, setSelectedPriceRange] = useState(() => searchParams.get("price") ?? "all");

  useEffect(() => {
    setSearchTerm(searchParams.get("q") ?? "");
    setSelectedLocation(searchParams.get("location") ?? "all");
    setSelectedType(searchParams.get("type") ?? "all");
    setSelectedPriceRange(searchParams.get("price") ?? "all");
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (searchTerm.trim()) nextParams.set("q", searchTerm.trim());
    if (selectedLocation !== "all") nextParams.set("location", selectedLocation);
    if (selectedType !== "all") nextParams.set("type", selectedType);
    if (selectedPriceRange !== "all") nextParams.set("price", selectedPriceRange);

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, searchTerm, selectedLocation, selectedType, selectedPriceRange, setSearchParams]);

  const locationOptions = useMemo(
    () => dedupeLocalizedOptions(projects, (project) => project.filterLocation),
    [projects],
  );
  const typeOptions = useMemo(
    () => dedupeLocalizedOptions(projects, (project) => project.filterType),
    [projects],
  );
  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        term.length === 0 ||
        project.title.toLowerCase().includes(term) ||
        project.location.es.toLowerCase().includes(term) ||
        project.location.en.toLowerCase().includes(term) ||
        project.type.es.toLowerCase().includes(term) ||
        project.type.en.toLowerCase().includes(term) ||
        project.idealFor.es.toLowerCase().includes(term) ||
        project.idealFor.en.toLowerCase().includes(term) ||
        project.hook.es.toLowerCase().includes(term) ||
        project.hook.en.toLowerCase().includes(term) ||
        project.filterLocation.es.toLowerCase().includes(term) ||
        project.filterLocation.en.toLowerCase().includes(term) ||
        project.filterType.es.toLowerCase().includes(term) ||
        project.filterType.en.toLowerCase().includes(term);

      const matchesLocation =
        selectedLocation === "all" || project.filterLocation.es === selectedLocation;
      const matchesType = selectedType === "all" || project.filterType.es === selectedType;
      const selectedRange = priceRanges.find((range) => range.value === selectedPriceRange);
      const matchesPrice =
        !selectedRange ||
        (project.priceFrom !== null &&
          (selectedRange.min === null || project.priceFrom >= selectedRange.min) &&
          (selectedRange.max === null || project.priceFrom < selectedRange.max));

      return matchesSearch && matchesLocation && matchesType && matchesPrice;
    });
  }, [projects, searchTerm, selectedLocation, selectedType, selectedPriceRange]);

  const balancedProjects = useMemo(
    () => pairProjectsByEstimatedHeight(filteredProjects, t),
    [filteredProjects, t],
  );

  const showEmptyCatalog = !isLoading && !error && projects.length === 0;
  const showNoResults = !isLoading && !error && projects.length > 0 && filteredProjects.length === 0;

  return (
    <Layout>
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <AnimatedSection as="div" className="mx-auto max-w-3xl">
            <p className="type-caption mb-4">{t(p.label)}</p>
            <h1 className="type-h1 mb-4">{t(p.title)}</h1>
            <p className="type-body mx-auto max-w-2xl">{t(p.subtitle)}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection as="div" className="border border-border bg-background p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="type-caption">
                  {t(labels.filtersTitle)}
                </p>
                <p className="type-body-sm mt-2">
                  {filteredProjects.length} {t(labels.results)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLocation("all");
                  setSelectedType("all");
                  setSelectedPriceRange("all");
                }}
                className="type-body-sm text-primary underline-offset-4 hover:underline"
              >
                {t(labels.clearFilters)}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="type-caption mb-2 block text-foreground/65">
                  {t(labels.search)}
                </span>
                <div className="flex items-center gap-2 border border-border bg-background px-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    name="catalog-search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={t(labels.searchPlaceholder)}
                    autoComplete="off"
                    className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </label>

              <label className="block">
                <span className="type-caption mb-2 block text-foreground/65">
                  {t(labels.location)}
                </span>
                <select
                  value={selectedLocation}
                  onChange={(event) => setSelectedLocation(event.target.value)}
                  className="h-12 w-full border border-border bg-background px-3 text-sm outline-none"
                >
                  <option value="all">{t(labels.allLocations)}</option>
                  {locationOptions.map((option) => (
                    <option key={`${option.es}-${option.en}`} value={option.es}>
                      {t(option)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="type-caption mb-2 block text-foreground/65">
                  {t(labels.type)}
                </span>
                <select
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value)}
                  className="h-12 w-full border border-border bg-background px-3 text-sm outline-none"
                >
                  <option value="all">{t(labels.allTypes)}</option>
                  {typeOptions.map((option) => (
                    <option key={`${option.es}-${option.en}`} value={option.es}>
                      {t(option)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="type-caption mb-2 block text-foreground/65">
                  {t(labels.price)}
                </span>
                <select
                  value={selectedPriceRange}
                  onChange={(event) => setSelectedPriceRange(event.target.value)}
                  className="h-12 w-full border border-border bg-background px-3 text-sm outline-none"
                >
                  <option value="all">{t(labels.allPrices)}</option>
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {t(priceRangeLabels[range.value])}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <AnimatedSection
              as="div"
              className="type-body border border-dashed border-border p-10 text-center text-muted-foreground"
            >
              {t(labels.loading)}
            </AnimatedSection>
          ) : error ? (
            <AnimatedSection
              as="div"
              className="type-body border border-dashed border-border p-10 text-center text-muted-foreground"
            >
              {t(labels.unavailable)}
            </AnimatedSection>
          ) : showEmptyCatalog ? (
            <AnimatedSection
              as="div"
              className="type-body border border-dashed border-border p-10 text-center text-muted-foreground"
            >
              {t(labels.emptyCatalog)}
            </AnimatedSection>
          ) : showNoResults ? (
            <AnimatedSection
              as="div"
              className="type-body border border-dashed border-border p-10 text-center text-muted-foreground"
            >
              {t(labels.noResults)}
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {balancedProjects.map((project, index) => (
                <AnimatedSection
                  as="article"
                  key={project.id}
                  delay={index * 70}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/80 bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(26,31,46,0.12)]"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={`${project.title} — ${t(project.location)}`}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      width={900}
                      height={675}
                    />
                    <span className="absolute left-4 top-4 bg-primary px-3 py-1 text-xs uppercase tracking-[0.16em] text-primary-foreground">
                      {t(project.badge)}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <h3 className="font-serif text-[1.65rem] leading-none tracking-tight text-foreground">
                        {project.title}
                      </h3>
                      {project.priceFrom ? (
                        <div className="type-body-sm shrink-0 whitespace-nowrap rounded-md border border-border bg-card px-3 py-1.5 font-semibold text-foreground">
                          {t(labels.priceFrom)} {formatPriceFrom(project.priceFrom, language)}
                        </div>
                      ) : null}
                    </div>
                    <div className="type-body-sm mt-3 flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{t(project.location)}</span>
                    </div>

                    <div className="mt-5 grid auto-rows-fr gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-stretch">
                      <ProjectDetailRow
                        icon={<BedDouble className={detailIconClassName} />}
                        label={t(labels.residences)}
                        value={t(project.residences)}
                        compact
                      />
                      <ProjectDetailRow
                        icon={<Bath className={detailIconClassName} />}
                        label={t(labels.baths)}
                        value={t(project.baths)}
                        compact
                      />
                      <ProjectDetailRow
                        icon={<Building2 className={detailIconClassName} />}
                        label={t(labels.type)}
                        value={t(project.type)}
                        compact
                      />
                      <ProjectDetailRow
                        icon={<CalendarClock className={detailIconClassName} />}
                        label={t(labels.delivery)}
                        value={t(project.delivery)}
                        compact
                      />
                      <ProjectDetailRow
                        icon={<Target className={detailIconClassName} />}
                        label={t(labels.idealFor)}
                        value={t(project.idealFor)}
                        compact
                      />
                      <ProjectDetailRow
                        icon={<CarFront className={detailIconClassName} />}
                        label={t(labels.parking)}
                        value={project.parking ? t(project.parking) : t(labels.notAvailable)}
                        compact
                      />
                    </div>

                    <div className="mt-2">
                      <ProjectDetailRow
                        icon={<Sparkles className={detailIconClassName} />}
                        label={t(labels.hook)}
                        value={t(project.hook)}
                        emphasize
                      />
                    </div>

                    <div className="mt-auto flex justify-end pt-5">
                      <Button
                        size="sm"
                        asChild
                        className="border border-primary bg-primary px-5 text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-green-light hover:shadow-md"
                      >
                        <Link to={getLocalizedPath("contact", language)}>{t(p.info)}</Link>
                      </Button>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;




