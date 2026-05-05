import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { LuxuryProject } from "@/features/projects/luxuryPlaceholderCatalog";
import { useT } from "@/i18n/LanguageContext";

import { ProjectImagePlaceholder } from "./ProjectImagePlaceholder";

const labels = {
  title: { es: "Galería privada", en: "Private gallery" },
  subtitle: {
    es: "Fachada, amenidades, interiores y vistas se reemplazarán por fotos reales.",
    en: "Facade, amenities, interiors, and views will be replaced with real photos.",
  },
} as const;

export function ProjectGalleryCarousel({ project }: { project: LuxuryProject }) {
  const t = useT();

  return (
    <section className="py-16">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="type-caption text-primary">{t(labels.title)}</p>
          <h2 className="type-h2 mt-2 text-wine">{project.title}</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">{t(labels.subtitle)}</p>
      </div>

      <Carousel opts={{ align: "start", loop: true }} className="px-10">
        <CarouselContent>
          {project.gallery.map((item, index) => (
            <CarouselItem key={`${project.slug}-${t(item.label)}-${index}`} className="md:basis-1/2">
              <ProjectImagePlaceholder
                label={t(item.label)}
                tone={item.tone}
                imageUrl={item.imageUrl}
                className="min-h-[17rem] md:min-h-[24rem]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 border-wine/40 text-wine hover:bg-secondary" />
        <CarouselNext className="right-0 border-wine/40 text-wine hover:bg-secondary" />
      </Carousel>
    </section>
  );
}
