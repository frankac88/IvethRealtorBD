import type {
  LuxuryProjectFilters,
  ProjectBudgetRange,
  ProjectCity,
  ProjectGoal,
  ProjectRentalType,
} from "@/features/projects/luxuryPlaceholderCatalog";
import {
  defaultProjectFilters,
  projectBudgetRangeLabels,
  projectCityLabels,
  projectGoalLabels,
  projectRentalTypeLabels,
} from "@/features/projects/luxuryPlaceholderCatalog";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const filterLabels = {
  title: { es: "Encuentra tu oportunidad", en: "Find your opportunity" },
  subtitle: {
    es: "Filtra sin perder la experiencia curada.",
    en: "Filter without losing the curated experience.",
  },
  city: { es: "Ciudad", en: "City" },
  goal: { es: "Objetivo", en: "Goal" },
  rentalType: { es: "Tipo de renta", en: "Rental type" },
  budget: { es: "Presupuesto", en: "Budget" },
  clear: { es: "Limpiar filtros", en: "Clear filters" },
  count: { es: "oportunidades", en: "opportunities" },
} as const;

type SelectConfig<Key extends keyof LuxuryProjectFilters> = {
  id: Key;
  label: { es: string; en: string };
  options: Array<{ value: LuxuryProjectFilters[Key]; label: { es: string; en: string } }>;
};

const selectConfigs: Array<SelectConfig<keyof LuxuryProjectFilters>> = [
  {
    id: "city",
    label: filterLabels.city,
    options: (["all", "miami", "orlando"] as Array<ProjectCity | "all">).map((value) => ({
      value,
      label: projectCityLabels[value],
    })),
  },
  {
    id: "goal",
    label: filterLabels.goal,
    options: (["all", "investment", "vacation-rental", "primary-home", "long-term"] as Array<ProjectGoal | "all">).map(
      (value) => ({ value, label: projectGoalLabels[value] }),
    ),
  },
  {
    id: "rentalType",
    label: filterLabels.rentalType,
    options: (["all", "flexible", "short-term", "30-90-days", "long-term"] as Array<ProjectRentalType | "all">).map(
      (value) => ({ value, label: projectRentalTypeLabels[value] }),
    ),
  },
  {
    id: "budgetRange",
    label: filterLabels.budget,
    options: (["all", "under-500k", "500k-1m", "1m-2m", "2m-plus"] as Array<ProjectBudgetRange | "all">).map(
      (value) => ({ value, label: projectBudgetRangeLabels[value] }),
    ),
  },
];

export function ProjectsLuxuryFilter({
  filters,
  onChange,
  onClear,
  resultCount,
  className,
}: {
  filters: LuxuryProjectFilters;
  onChange: <Key extends keyof LuxuryProjectFilters>(key: Key, value: LuxuryProjectFilters[Key]) => void;
  onClear: () => void;
  resultCount: number;
  className?: string;
}) {
  const t = useT();
  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => defaultProjectFilters[key as keyof LuxuryProjectFilters] !== value,
  );

  return (
    <section className={cn("relative z-10 -mt-10 px-4 lg:px-8", className)}>
      <div className="container mx-auto">
        <div className="border border-gold/30 bg-card/95 p-4 shadow-[0_24px_70px_rgba(26,31,46,0.12)] backdrop-blur md:p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="type-caption text-primary">{t(filterLabels.title)}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t(filterLabels.subtitle)} · {resultCount} {t(filterLabels.count)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClear}
              disabled={!hasActiveFilters}
              className="self-start text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-wine underline-offset-4 transition hover:text-primary hover:underline disabled:pointer-events-none disabled:opacity-45 md:self-auto"
            >
              {t(filterLabels.clear)}
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {selectConfigs.map((config) => (
              <label key={config.id} className="block">
                <span className="mb-2 block text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-foreground/60">
                  {t(config.label)}
                </span>
                <select
                  value={filters[config.id]}
                  onChange={(event) => onChange(config.id, event.target.value as never)}
                  className="h-12 w-full border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  {config.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
