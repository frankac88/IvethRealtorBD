import { useRef } from "react";

import AnimatedSection from "@/components/AnimatedSection";
import { ProjectFeatureCard } from "@/components/projects/ProjectFeatureCard";
import type { LuxuryProject, ProjectCity } from "@/features/projects/luxuryPlaceholderCatalog";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const cityContent: Record<ProjectCity, {
  title: { es: string; en: string };
  subtitle: { es: string; en: string };
}> = {
  miami: {
    title: {
      es: "Ubicación, demanda internacional y valorización.",
      en: "Location, international demand, and appreciation.",
    },
    subtitle: {
      es: "Una selección pensada para quienes buscan invertir con visión, estilo y proyección internacional.",
      en: "A curated selection for those investing with vision, style, and international upside.",
    },
  },
  orlando: {
    title: {
      es: "Renta vacacional, turismo y flujo con narrativa visual.",
      en: "Vacation rental, tourism, and cash-flow with visual storytelling.",
    },
    subtitle: {
      es: "Espacios diseñados para disfrutar, rentabilizar y vivir la experiencia de Florida desde el primer día.",
      en: "Spaces designed to enjoy, monetize, and experience Florida living from day one.",
    },
  },
};

export function ProjectCitySection({
  city,
  projects,
  className,
  selectedProjectSlug,
  onSelectProject,
}: {
  city: ProjectCity;
  projects: LuxuryProject[];
  className?: string;
  selectedProjectSlug?: string;
  onSelectProject?: (project: LuxuryProject) => void;
}) {
  const t = useT();
  const content = cityContent[city];
  const featuredProjectRef = useRef<HTMLDivElement | null>(null);
  const fallbackProject = projects[0];
  const featuredProject = projects.find((project) => project.slug === selectedProjectSlug) ?? fallbackProject;
  const secondaryProjects = projects.filter((project) => project.slug !== featuredProject?.slug);
  const handleSelectProject = (project: LuxuryProject) => {
    onSelectProject?.(project);
    window.requestAnimationFrame(() => {
      featuredProjectRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    });
  };

  if (!featuredProject) return null;

  return (
    <section className={cn("relative overflow-hidden py-20 md:py-24", className)}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(138,85,121,0.10),transparent_28%),radial-gradient(circle_at_88%_22%,rgba(42,123,137,0.10),transparent_32%)]" />
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection
          as="div"
          className="mb-9 grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)] md:items-end"
        >
          <div className="border-l-2 border-gold pl-5">
            <p className="font-serif text-5xl leading-none tracking-[-0.05em] text-wine">
              {city === "miami" ? "01" : "02"}
            </p>
          </div>
          <div className="max-w-4xl">
            <h2 className="type-h2 text-wine">
              {city === "miami" ? "Miami" : "Orlando"} · {t(content.title)}
            </h2>
            <p className="type-body mt-4 max-w-2xl">{t(content.subtitle)}</p>
          </div>
        </AnimatedSection>

        <div className="space-y-5">
          <div
            ref={featuredProjectRef}
            data-testid={`featured-project-${city}`}
            className="scroll-mt-52"
          >
            <AnimatedSection as="div">
              <ProjectFeatureCard project={featuredProject} index={0} />
            </AnimatedSection>
          </div>

          {secondaryProjects.length > 0 ? (
            <div className="grid items-stretch gap-5 lg:grid-cols-2">
              {secondaryProjects.map((project, index) => (
                <AnimatedSection as="div" key={project.slug} delay={(index + 1) * 60} className="w-full">
                  <ProjectFeatureCard
                    project={project}
                    index={index + 1}
                    compact
                    onSelectProject={() => handleSelectProject(project)}
                  />
                </AnimatedSection>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
