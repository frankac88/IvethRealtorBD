import type { Language } from "./translations/types";

export type LocalizedRouteKey =
  | "home"
  | "about"
  | "team"
  | "projects"
  | "invest"
  | "financing"
  | "guides"
  | "testimonials"
  | "contact";

type LocalizedRouteMap = Record<LocalizedRouteKey, Record<Language, string>>;

export const localizedRoutes: LocalizedRouteMap = {
  home: { es: "/", en: "/" },
  about: { es: "/sobre-iveth", en: "/about-iveth" },
  team: { es: "/equipo", en: "/team" },
  projects: { es: "/proyectos", en: "/projects" },
  invest: { es: "/invertir-en-florida", en: "/invest-in-florida" },
  financing: { es: "/financiamiento", en: "/financing" },
  guides: { es: "/guias", en: "/guides" },
  testimonials: { es: "/testimonios", en: "/testimonials" },
  contact: { es: "/contacto", en: "/contact" },
};

const normalizePath = (path: string) => {
  if (!path || path === "/") {
    return "/";
  }

  return path.endsWith("/") ? path.slice(0, -1) : path;
};

export const getLocalizedPath = (routeKey: LocalizedRouteKey, language: Language) =>
  localizedRoutes[routeKey][language];

export const getLocalizedPaths = (routeKey: LocalizedRouteKey) => {
  const route = localizedRoutes[routeKey];
  return Array.from(new Set([route.es, route.en]));
};

export const getRouteKeyForPath = (path: string): LocalizedRouteKey | null => {
  const normalizedPath = normalizePath(path);

  for (const [routeKey, route] of Object.entries(localizedRoutes) as Array<
    [LocalizedRouteKey, LocalizedRouteMap[LocalizedRouteKey]]
  >) {
    if (normalizePath(route.es) === normalizedPath || normalizePath(route.en) === normalizedPath) {
      return routeKey;
    }
  }

  return null;
};

export const getLanguageForPath = (path: string): Language | null => {
  const normalizedPath = normalizePath(path);

  for (const route of Object.values(localizedRoutes)) {
    if (normalizePath(route.es) === normalizePath(route.en) && normalizePath(route.es) === normalizedPath) {
      return null;
    }

    if (normalizePath(route.es) === normalizedPath) {
      return "es";
    }

    if (normalizePath(route.en) === normalizedPath) {
      return "en";
    }
  }

  return null;
};

export const getAlternateLocalizedPath = (path: string, language: Language) => {
  const routeKey = getRouteKeyForPath(path);
  return routeKey ? getLocalizedPath(routeKey, language) : null;
};
