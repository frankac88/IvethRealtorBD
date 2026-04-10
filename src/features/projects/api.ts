import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

import { supabase } from "@/integrations/supabase/client";

import type { ProjectFormValues, ProjectItem } from "./catalog";

const PROJECT_IMAGES_BUCKET = "project-images";

export type ProjectRow = Tables<"projects">;
export type ProjectInsert = TablesInsert<"projects">;
export type ProjectUpdate = TablesUpdate<"projects">;

export interface SaveProjectPayload {
  values: ProjectFormValues;
  imageFile?: File | null;
}

type DerivedProjectMeta = {
  badge_es: string;
  badge_en: string;
  filter_location_es: string;
  filter_location_en: string;
  filter_type_es: string;
  filter_type_en: string;
  filter_strategy_es: string;
  filter_strategy_en: string;
};

function normalizeOptional(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOptionalNumber(value: string) {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  const numericValue = Number(trimmed.replace(/,/g, ""));
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    throw new Error("El precio desde debe ser un número válido en dólares.");
  }

  return Math.round(numericValue);
}

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-");
}

function mapProjectRow(row: ProjectRow): ProjectItem {
  return {
    id: row.id,
    title: row.title,
    priceFrom: row.price_from,
    badge: { es: row.badge_es, en: row.badge_en },
    location: { es: row.location_es, en: row.location_en },
    residences: { es: row.residences_es, en: row.residences_en },
    baths: { es: row.baths_es, en: row.baths_en },
    type: { es: row.type_es, en: row.type_en },
    delivery: { es: row.delivery_es, en: row.delivery_en },
    idealFor: { es: row.ideal_for_es, en: row.ideal_for_en },
    parking: row.parking_es || row.parking_en ? { es: row.parking_es ?? "", en: row.parking_en ?? "" } : null,
    hook: { es: row.hook_es, en: row.hook_en },
    filterLocation: { es: row.filter_location_es, en: row.filter_location_en },
    filterType: { es: row.filter_type_es, en: row.filter_type_en },
    filterStrategy: { es: row.filter_strategy_es, en: row.filter_strategy_en },
    imageUrl: row.image_url,
    imagePath: row.image_path,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function deriveBadgeText(
  locale: "es" | "en",
  values: Pick<ProjectFormValues, "deliveryEs" | "deliveryEn" | "typeEs" | "typeEn" | "idealForEs" | "idealForEn">,
) {
  const delivery = (locale === "es" ? values.deliveryEs : values.deliveryEn).toLowerCase();
  const type = (locale === "es" ? values.typeEs : values.typeEn).toLowerCase();
  const idealFor = (locale === "es" ? values.idealForEs : values.idealForEn).toLowerCase();

  if (delivery.includes("precon")) return locale === "es" ? "Preconstrucción" : "Pre-construction";
  if (delivery.includes("constru")) return locale === "es" ? "En construcción" : "Under construction";
  if (delivery.includes("fase")) return locale === "es" ? "En fases" : "Phased";
  if (delivery.includes("nueva")) return locale === "es" ? "Nueva construcción" : "New construction";

  if (type.includes("waterfront")) return "Waterfront";
  if (type.includes("branded")) return locale === "es" ? "Branded" : "Branded";
  if (type.includes("boutique")) return locale === "es" ? "Boutique" : "Boutique";
  if (type.includes("single family")) return locale === "es" ? "Residencial" : "Residential";
  if (type.includes("condo hotel")) return locale === "es" ? "Rentas cortas" : "Short-term";

  if (idealFor.includes("short") || idealFor.includes("corta")) {
    return locale === "es" ? "Rentas cortas" : "Short-term";
  }
  if (idealFor.includes("long") || idealFor.includes("largo")) {
    return locale === "es" ? "Largo plazo" : "Long-term";
  }
  if (idealFor.includes("lujo") || idealFor.includes("luxury")) {
    return "Luxury";
  }
  if (idealFor.includes("invers")) {
    return locale === "es" ? "Inversión" : "Investment";
  }

  return locale === "es" ? "Destacado" : "Featured";
}

function deriveProjectMeta(values: ProjectFormValues): DerivedProjectMeta {
  return {
    badge_es: deriveBadgeText("es", values),
    badge_en: deriveBadgeText("en", values),
    filter_location_es: values.locationEs.trim(),
    filter_location_en: values.locationEn.trim(),
    filter_type_es: values.typeEs.trim(),
    filter_type_en: values.typeEn.trim(),
    filter_strategy_es: values.idealForEs.trim(),
    filter_strategy_en: values.idealForEn.trim(),
  };
}

function buildProjectPayload(
  values: ProjectFormValues,
  {
    image,
    meta,
    sortOrder,
    isPublished,
  }: {
    image?: { image_url?: string; image_path?: string | null };
    meta: DerivedProjectMeta;
    sortOrder: number;
    isPublished: boolean;
  },
): ProjectInsert {
  const safeSortOrder = Number.isFinite(sortOrder) ? sortOrder : 0;

  return {
    title: values.title.trim(),
    price_from: normalizeOptionalNumber(values.priceFrom),
    is_featured: values.featured,
    badge_es: meta.badge_es,
    badge_en: meta.badge_en,
    location_es: values.locationEs.trim(),
    location_en: values.locationEn.trim(),
    residences_es: values.residencesEs.trim(),
    residences_en: values.residencesEn.trim(),
    baths_es: values.bathsEs.trim(),
    baths_en: values.bathsEn.trim(),
    type_es: values.typeEs.trim(),
    type_en: values.typeEn.trim(),
    delivery_es: values.deliveryEs.trim(),
    delivery_en: values.deliveryEn.trim(),
    ideal_for_es: values.idealForEs.trim(),
    ideal_for_en: values.idealForEn.trim(),
    parking_es: normalizeOptional(values.parkingEs),
    parking_en: normalizeOptional(values.parkingEn),
    hook_es: values.hookEs.trim(),
    hook_en: values.hookEn.trim(),
    filter_location_es: meta.filter_location_es,
    filter_location_en: meta.filter_location_en,
    filter_type_es: meta.filter_type_es,
    filter_type_en: meta.filter_type_en,
    filter_strategy_es: meta.filter_strategy_es,
    filter_strategy_en: meta.filter_strategy_en,
    image_url: image?.image_url ?? "",
    image_path: image?.image_path ?? null,
    sort_order: safeSortOrder,
    is_published: isPublished,
  };
}

async function getNextSortOrder() {
  const { data, error } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  const currentMax = data?.sort_order ?? 0;
  return currentMax + 10;
}

async function uploadProjectImage(file: File) {
  const fileExt = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  const safeName = sanitizeFileName(file.name.replace(/\.[^.]+$/, ""));
  const path = `projects/${crypto.randomUUID()}-${safeName}${fileExt ? `.${fileExt}` : ""}`;

  const { error: uploadError } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .upload(path, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path);

  return {
    image_path: path,
    image_url: data.publicUrl,
  };
}

async function removeProjectImage(path: string) {
  const { error } = await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([path]);
  if (error) throw error;
}

export async function fetchProjects({
  includeUnpublished = false,
  featuredOnly = false,
  limit,
}: {
  includeUnpublished?: boolean;
  featuredOnly?: boolean;
  limit?: number;
} = {}) {
  let query = supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }

  if (featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(mapProjectRow);
}

export async function createProject({ values, imageFile }: SaveProjectPayload) {
  if (!imageFile) {
    throw new Error("Debes seleccionar una imagen para el proyecto.");
  }

  let uploadedImage: { image_url: string; image_path: string } | null = null;

  try {
    const meta = deriveProjectMeta(values);
    const sortOrder = await getNextSortOrder();
    uploadedImage = await uploadProjectImage(imageFile);
    const payload = buildProjectPayload(values, {
      image: uploadedImage,
      meta,
      sortOrder,
      isPublished: true,
    });

    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    return mapProjectRow(data);
  } catch (error) {
    if (uploadedImage?.image_path) {
      await removeProjectImage(uploadedImage.image_path).catch(() => undefined);
    }
    throw error;
  }
}

export async function updateProject(projectId: string, { values, imageFile }: SaveProjectPayload) {
  const { data: existingProject, error: existingError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (existingError) throw existingError;

  let uploadedImage: { image_url: string; image_path: string } | null = null;

  try {
    const meta = deriveProjectMeta(values);

    if (imageFile) {
      uploadedImage = await uploadProjectImage(imageFile);
    }

    const payload: ProjectUpdate = buildProjectPayload(values, {
      image: uploadedImage ?? {
        image_url: existingProject.image_url,
        image_path: existingProject.image_path,
      },
      meta,
      sortOrder: existingProject.sort_order,
      isPublished: existingProject.is_published,
    });

    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", projectId)
      .select("*")
      .single();

    if (error) throw error;

    if (uploadedImage?.image_path && existingProject.image_path) {
      await removeProjectImage(existingProject.image_path).catch(() => undefined);
    }

    return mapProjectRow(data);
  } catch (error) {
    if (uploadedImage?.image_path) {
      await removeProjectImage(uploadedImage.image_path).catch(() => undefined);
    }
    throw error;
  }
}

export async function deleteProject(projectId: string) {
  const { data, error } = await supabase.functions.invoke("delete-project", {
    body: { projectId },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);

  return true;
}
