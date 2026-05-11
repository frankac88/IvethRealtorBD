import type { Language } from "@/i18n/translations/types";

const whatsappNumber = "17868677180";
const locationQuery = "7791 NW 46th St STE 308, Doral, FL 33166";

export const createWhatsAppHref = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

export const whatsappMessages = {
  default: "Hola Iveth, quiero conocer oportunidades para invertir en Miami. ¿Podemos conversar?",
  floatingButton: "Hola Iveth, vengo desde el botón flotante de WhatsApp y quiero conversar.",
  homePage: "Hola Iveth, vengo desde la página de inicio y quiero hablar sobre oportunidades en Florida.",
  contactPage: "Hola Iveth, vengo desde la página de contacto y quiero comunicarme contigo.",
  investPage: "Hola Iveth, vengo desde la página Invertir en Florida y quiero asesoría de inversión.",
  projectsPage: "Hola Iveth, vengo desde la página de proyectos y quiero ayuda para elegir una oportunidad.",
} as const;

export const getWhatsAppMessage = (message: string, _language?: Language) => message;

export const siteConfig = {
  brand: {
    name: "Iveth Coll",
    descriptor: "International Real Estate Advisor",
    description: "Iveth Coll is an International Real Estate Advisor specializing in luxury properties and investment opportunities in Miami and Orlando, Florida.",
  },
  contact: {
    email: "iveth@ivethcollrealtor.com",
    phoneDisplay: "+1 786-867-7180",
    phoneHref: "+17868677180",
    location: "7791 NW 46 ST SUITE 308, Doral, FL 33166",
    locationMapsHref: "https://share.google/VMcl7Hd0jICQbPv4G",
    locationEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&output=embed`,
  },
  social: {
    facebook: "https://www.facebook.com/ivethcollrealtor",
    instagram: "https://www.instagram.com/ivethcollrealtor",
    youtube: "https://www.youtube.com/@ivethcollrealtor",
    linkedin: "https://www.linkedin.com/in/ivethcollrealtor/",
  },
  whatsapp: {
    number: whatsappNumber,
    defaultMessage: whatsappMessages.default,
    href: `https://wa.me/${whatsappNumber}`,
    hrefWithMessage: createWhatsAppHref(whatsappMessages.default),
  },
} as const;
