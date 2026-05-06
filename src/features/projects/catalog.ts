export type LocalizedText = {
  es: string;
  en: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  city: "miami" | "orlando";
  priceFrom: number | null;
  badge: LocalizedText;
  location: LocalizedText;
  residences: LocalizedText;
  baths: LocalizedText;
  type: LocalizedText;
  delivery: LocalizedText;
  idealFor: LocalizedText;
  parking: LocalizedText | null;
  hook: LocalizedText;
  filterLocation: LocalizedText;
  filterType: LocalizedText;
  filterStrategy: LocalizedText;
  imageUrl: string;
  imagePath: string | null;
  galleryImages: ProjectGalleryImage[];
  sortOrder: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProjectGalleryImage = {
  url: string;
  path: string | null;
  labelEs: string;
  labelEn: string;
};

export type ProjectFormValues = {
  title: string;
  city: "miami" | "orlando";
  priceFrom: string;
  featured: boolean;
  locationEs: string;
  locationEn: string;
  unitsEs: string;
  unitsEn: string;
  rentalEs: string;
  rentalEn: string;
  deliveryEs: string;
  deliveryEn: string;
  shortDescriptionEs: string;
  shortDescriptionEn: string;
  strategicSummaryEs: string;
  strategicSummaryEn: string;
};

export const emptyProjectFormValues: ProjectFormValues = {
  title: "",
  city: "miami",
  priceFrom: "",
  featured: false,
  locationEs: "",
  locationEn: "",
  unitsEs: "",
  unitsEn: "",
  rentalEs: "",
  rentalEn: "",
  deliveryEs: "",
  deliveryEn: "",
  shortDescriptionEs: "",
  shortDescriptionEn: "",
  strategicSummaryEs: "",
  strategicSummaryEn: "",
};

export function projectToFormValues(project: ProjectItem): ProjectFormValues {
  return {
    title: project.title,
    city: project.city,
    priceFrom: project.priceFrom?.toString() ?? "",
    featured: project.isFeatured,
    locationEs: project.location.es,
    locationEn: project.location.en,
    unitsEs: project.residences.es,
    unitsEn: project.residences.en,
    rentalEs: project.type.es,
    rentalEn: project.type.en,
    deliveryEs: project.delivery.es,
    deliveryEn: project.delivery.en,
    shortDescriptionEs: project.hook.es,
    shortDescriptionEn: project.hook.en,
    strategicSummaryEs: project.idealFor.es,
    strategicSummaryEn: project.idealFor.en,
  };
}
