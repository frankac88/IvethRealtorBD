import { ArrowRight, CalendarClock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { ProjectImagePlaceholder } from "@/components/projects/ProjectImagePlaceholder";
import { Button } from "@/components/ui/button";
import { createWhatsAppHref } from "@/config/site";
import type { LuxuryProject } from "@/features/projects/luxuryPlaceholderCatalog";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";

const labels = {
  requestInfo: { es: "Solicitar info", en: "Request info" },
  details: { es: "Datos clave", en: "Key details" },
} as const;

export function ProjectFeatureCard({
  project,
  index,
  compact = false,
  onSelectProject,
}: {
  project: LuxuryProject;
  index: number;
  compact?: boolean;
  onSelectProject?: (slug: string) => void;
}) {
  const t = useT();
  const { language } = useLanguage();
  const projectsPath = getLocalizedPath("projects", language);
  const detailPath = `${projectsPath}/${project.slug}`;
  const requestInfoHref = createWhatsAppHref(
    `Hola Iveth, vengo desde el detalle del proyecto ${project.title} y quiero recibir precios y disponibilidad.`,
  );
  const tone = project.gallery[index % project.gallery.length]?.tone ?? "sand";
  const imageUrl = project.imageUrl ?? project.gallery[index % project.gallery.length]?.imageUrl;

  if (compact) {
    const cardContent = (
      <>
        <ProjectImagePlaceholder
          label={t(project.imageHint)}
          tone={tone}
          compact
          imageUrl={imageUrl}
          showLabel={false}
          className="min-h-[9rem] rounded-[1.15rem]"
        />
        <div className="flex min-w-0 flex-col justify-center py-1 text-left">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">
            {t(project.eyebrow)}
          </p>
          <h3 className="mt-2 font-serif text-2xl leading-none tracking-[-0.03em] text-wine">
            {project.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {t(project.location)}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/78">{t(project.shortDescription)}</p>
          <span className="mt-3 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-wine transition group-hover:text-primary">
            {t(project.cardCta)}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </>
    );

    if (onSelectProject) {
      return (
        <button
          type="button"
          aria-label={t({ es: `Seleccionar ${project.title}`, en: `Select ${project.title}` })}
          onClick={() => onSelectProject(project.slug)}
          className="group grid h-full w-full gap-4 overflow-hidden rounded-[1.5rem] border border-gold/25 bg-card/95 p-3 shadow-[0_18px_48px_rgba(26,31,46,0.08)] transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_28px_70px_rgba(26,31,46,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:grid-cols-[9rem_minmax(0,1fr)]"
        >
          {cardContent}
        </button>
      );
    }

    return (
      <article className="group grid h-full w-full gap-4 overflow-hidden rounded-[1.5rem] border border-gold/25 bg-card/95 p-3 shadow-[0_18px_48px_rgba(26,31,46,0.08)] transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_28px_70px_rgba(26,31,46,0.13)] sm:grid-cols-[9rem_minmax(0,1fr)]">
        {cardContent}
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-gold/30 bg-card/95 shadow-[0_28px_80px_rgba(26,31,46,0.10)] transition duration-300 hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_34px_96px_rgba(26,31,46,0.16)] lg:grid lg:grid-cols-[42%_minmax(0,1fr)]">
      <ProjectImagePlaceholder
        label={t(project.imageHint)}
        tone={tone}
        imageUrl={imageUrl}
        className="min-h-[18rem] lg:min-h-full"
      />

      <div className="flex flex-col justify-center p-6 md:p-8">
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {t(project.eyebrow)}
        </p>

        <h3 className="mt-3 font-serif text-[2.35rem] leading-[0.94] tracking-[-0.045em] text-wine md:text-[3rem]">
          {project.title}
        </h3>

        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          {t(project.location)}
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {[project.priceLabel, project.rentalLabel, project.deliveryLabel, project.unitsLabel].map((item) => (
            <div key={t(item)} className="rounded-2xl border border-gold/20 bg-background/70 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-foreground/50">
                {t(labels.details)}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{t(item)}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 max-w-2xl text-[0.98rem] leading-7 text-foreground/78">
          {t(project.shortDescription)}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-green-light">
            <Link to={detailPath}>
              {t(project.cardCta)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-wine/50 text-wine hover:bg-secondary/50">
            <a href={requestInfoHref} target="_blank" rel="noopener noreferrer">
              <CalendarClock className="mr-2 h-4 w-4" />
              {t(labels.requestInfo)}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
