const whatsappNumber = "17868677180";
const whatsappDefaultMessage = "Hola Iveth, quiero conocer oportunidades para invertir en Miami. ¿Podemos conversar?";
const locationQuery = "7791 NW 46 St Suite 308, Doral, FL 33166";

export const siteConfig = {
  brand: {
    name: "Iveth Coll",
    descriptor: "International Real Estate Advisor",
  },
  contact: {
    email: "ivethcoll@gmail.com",
    phoneDisplay: "1786-867-7180",
    phoneHref: "+17868677180",
    location: "Doral, Florida",
    locationFull: "7791 NW 46 St Suite 308, Doral, FL 33166",
    locationMapsHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`,
    locationEmbedSrc: `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
  },
  social: {
    facebook: "https://www.facebook.com/ivethcollrealtor",
    instagram: "https://www.instagram.com/ivethcollrealtor",
    youtube: "https://www.youtube.com/@ivethcollrealtor",
    linkedin: "https://www.linkedin.com/in/ivethcollrealtor/",
  },
  whatsapp: {
    number: whatsappNumber,
    defaultMessage: whatsappDefaultMessage,
    href: `https://wa.me/${whatsappNumber}`,
    hrefWithMessage: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappDefaultMessage)}`,
  },
} as const;
