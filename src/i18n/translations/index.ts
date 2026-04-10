export { type Language } from "./types";
export { navTranslations } from "./nav";
export { footerTranslations } from "./footer";
export { homeTranslations } from "./home";
export { aboutTranslations } from "./about";
export { teamTranslations } from "./team";
export { projectsTranslations } from "./projects";
export { investTranslations } from "./invest";
export { financingTranslations } from "./financing";
export { guidesTranslations } from "./guides";
export { testimonialsTranslations } from "./testimonials";
export { contactTranslations } from "./contact";

import { navTranslations } from "./nav";
import { footerTranslations } from "./footer";
import { homeTranslations } from "./home";
import { aboutTranslations } from "./about";
import { teamTranslations } from "./team";
import { projectsTranslations } from "./projects";
import { investTranslations } from "./invest";
import { financingTranslations } from "./financing";
import { guidesTranslations } from "./guides";
import { testimonialsTranslations } from "./testimonials";
import { contactTranslations } from "./contact";

export const translations = {
  nav: navTranslations,
  footer: footerTranslations,
  home: homeTranslations,
  about: aboutTranslations,
  team: teamTranslations,
  projects: projectsTranslations,
  invest: investTranslations,
  financing: financingTranslations,
  guides: guidesTranslations,
  testimonials: testimonialsTranslations,
  contact: contactTranslations,
} as const;
