import type { Language } from "@/i18n/translations/types";

const whatsappNumber = "17868677180";
const locationQuery = "7791 NW 46th St STE 308, Doral, FL 33166";

export const createWhatsAppHref = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

export const whatsappMessages = {
  default: {
    es: "Hola Iveth, quiero conocer oportunidades para invertir en Miami. ¿Podemos conversar?",
    en: "Hi Iveth, I would like to learn about investment opportunities in Miami. Can we chat?",
  },
  floatingButton: {
    es: "Hola Iveth, vengo desde el botón flotante de WhatsApp y quiero conversar.",
    en: "Hi Iveth, I am coming from the floating WhatsApp button and I would like to chat.",
  },
  homePage: {
    es: "Hola Iveth, vengo desde la página de inicio y quiero hablar sobre oportunidades en Florida.",
    en: "Hi Iveth, I am coming from the home page and I want to talk about opportunities in Florida.",
  },
  contactPage: {
    es: "Hola Iveth, vengo desde la página de contacto y quiero comunicarme contigo.",
    en: "Hi Iveth, I am coming from the contact page and I would like to get in touch with you.",
  },
  investPage: {
    es: "Hola Iveth, vengo desde la página Invertir en Florida y quiero asesoría de inversión.",
    en: "Hi Iveth, I am coming from the Invest in Florida page and I would like investment guidance.",
  },
  projectsPage: {
    es: "Hola Iveth, vengo desde la página de proyectos y quiero ayuda para elegir una oportunidad.",
    en: "Hi Iveth, I am coming from the projects page and I want help choosing an opportunity.",
  },
} as const;

export const getWhatsAppMessage = (message: { es: string; en: string }, language: Language) =>
  message[language];

export const siteConfig = {
  brand: {
    name: "Iveth Coll",
    descriptor: "International Real Estate Advisor",
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
    hrefWithMessage: {
      es: createWhatsAppHref(whatsappMessages.default.es),
      en: createWhatsAppHref(whatsappMessages.default.en),
    },
  },
} as const;
