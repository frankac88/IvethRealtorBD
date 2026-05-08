import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Transforms a Supabase storage object URL into an optimized render URL.
 * Requires Supabase Image Transformations (Pro plan).
 * 
 * @param url The original Supabase storage URL (e.g. /object/public/...)
 * @param options Resizing options
 * @returns The transformed URL, or the original if not a valid Supabase URL
 */
export function getSupabaseOptimizedUrl(
  url: string,
  options: { width?: number; height?: number; resize?: "cover" | "contain" | "fill" } = {}
) {
  // En el plan Free de Supabase, las transformaciones de imágenes (/render/image) no están disponibles.
  // Por lo tanto, retornamos la URL original sin modificaciones.
  // Si en el futuro se actualiza a plan Pro, se puede reactivar la lógica de redimensionamiento.
  return url;
}
