import type { ProjectGalleryImage, ProjectItem, LocalizedText } from "./catalog";
import type { LuxuryProject, ProjectBudgetRange, ProjectGoal, ProjectRentalType } from "./luxuryPlaceholderCatalog";

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const knownProjectSlugs: Record<string, string> = {
  "EDGE HOUSE": "edge-house",
  "BLOOM NORTH MIAMI": "bloom-north-miami",
  "MANDARIN ORIENTAL RESIDENCES": "mandarin-oriental-residences",
  "HOUSE OF WELLNESS": "house-of-wellness",
  "THE WILLIAM RESIDENCES": "the-william",
  "CASSIA CORAL GABLES": "cassia",
  "REUNION VILLAGE": "reunion-village",
  "STOREY LAKE": "storey-lake",
  "WINDSOR CAY": "windsor-cay",
  "EVERBE": "everbe",
};

const formatPriceLabel = (priceFrom: number | null): LocalizedText => {
  if (!priceFrom) return { es: "Precio a consultar", en: "Price upon request" };

  const price = `$${priceFrom.toLocaleString("en-US")}`;
  return { es: `Desde ${price}`, en: `From ${price}` };
};

const inferRentalType = (project: ProjectItem): ProjectRentalType => {
  const text = `${project.type.es} ${project.type.en}`.toLowerCase();

  if (text.includes("90") || text.includes("30")) return "30-90-days";
  if (text.includes("short") || text.includes("corta") || text.includes("airbnb")) return "short-term";
  if (text.includes("long") || text.includes("largo")) return "long-term";

  return "flexible";
};

const inferGoal = (project: ProjectItem): ProjectGoal => {
  const text = `${project.idealFor.es} ${project.idealFor.en} ${project.type.es} ${project.type.en}`.toLowerCase();

  if (text.includes("vacation") || text.includes("vacacional")) return "vacation-rental";
  if (text.includes("primary") || text.includes("vivienda")) return "primary-home";
  if (text.includes("long") || text.includes("largo")) return "long-term";

  return "investment";
};

const inferBudgetRange = (priceFrom: number | null): ProjectBudgetRange => {
  if (!priceFrom || priceFrom < 500_000) return "under-500k";
  if (priceFrom < 1_000_000) return "500k-1m";
  if (priceFrom < 2_000_000) return "1m-2m";
  return "2m-plus";
};

const mapGalleryImage = (image: ProjectGalleryImage, index: number): LuxuryProject["gallery"][number] => ({
  label: { es: image.labelEs, en: image.labelEn },
  tone: (["sand", "sage", "teal", "wine"] as const)[index % 4],
  imageUrl: image.url,
});

export function projectItemToLuxuryProject(project: ProjectItem): LuxuryProject {
  const gallery = project.galleryImages.map(mapGalleryImage);
  const titleSlug = slugify(project.title);
  const fallbackSlug = project.id ? `${titleSlug}-${project.id.slice(0, 8)}` : titleSlug;

  return {
    slug: knownProjectSlugs[project.title.toUpperCase()] ?? (titleSlug || fallbackSlug),
    city: project.city,
    title: project.title,
    location: project.location,
    eyebrow: project.badge,
    priceLabel: formatPriceLabel(project.priceFrom),
    deliveryLabel: project.delivery,
    rentalLabel: project.type,
    unitsLabel: project.residences,
    shortDescription: project.hook,
    strategicSummary: project.idealFor,
    cardCta: { es: `Ver ${project.title}`, en: `View ${project.title}` },
    imageHint: { es: "Foto del proyecto", en: "Project photo" },
    imageUrl: project.imageUrl,
    detailImageUrl: project.imageUrl,
    goal: inferGoal(project),
    rentalType: inferRentalType(project),
    budgetRange: inferBudgetRange(project.priceFrom),
    featured: project.isFeatured,
    gallery: gallery.length > 0
      ? gallery
      : [{ label: { es: "Foto principal", en: "Main photo" }, tone: "sand", imageUrl: project.imageUrl }],
  };
}

export function projectItemsToLuxuryProjects(projects: ProjectItem[]) {
  return projects.map(projectItemToLuxuryProject);
}
