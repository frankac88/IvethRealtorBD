export type LocalizedText = {
  es: string;
  en: string;
};

export type ProjectItem = {
  id: string;
  title: string;
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
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProjectFormValues = {
  title: string;
  priceFrom: string;
  locationEs: string;
  locationEn: string;
  residencesEs: string;
  residencesEn: string;
  bathsEs: string;
  bathsEn: string;
  typeEs: string;
  typeEn: string;
  deliveryEs: string;
  deliveryEn: string;
  idealForEs: string;
  idealForEn: string;
  parkingEs: string;
  parkingEn: string;
  hookEs: string;
  hookEn: string;
};

export const emptyProjectFormValues: ProjectFormValues = {
  title: "",
  priceFrom: "",
  locationEs: "",
  locationEn: "",
  residencesEs: "",
  residencesEn: "",
  bathsEs: "",
  bathsEn: "",
  typeEs: "",
  typeEn: "",
  deliveryEs: "",
  deliveryEn: "",
  idealForEs: "",
  idealForEn: "",
  parkingEs: "",
  parkingEn: "",
  hookEs: "",
  hookEn: "",
};

export function projectToFormValues(project: ProjectItem): ProjectFormValues {
  return {
    title: project.title,
    priceFrom: project.priceFrom?.toString() ?? "",
    locationEs: project.location.es,
    locationEn: project.location.en,
    residencesEs: project.residences.es,
    residencesEn: project.residences.en,
    bathsEs: project.baths.es,
    bathsEn: project.baths.en,
    typeEs: project.type.es,
    typeEn: project.type.en,
    deliveryEs: project.delivery.es,
    deliveryEn: project.delivery.en,
    idealForEs: project.idealFor.es,
    idealForEn: project.idealFor.en,
    parkingEs: project.parking?.es ?? "",
    parkingEn: project.parking?.en ?? "",
    hookEs: project.hook.es,
    hookEn: project.hook.en,
  };
}
