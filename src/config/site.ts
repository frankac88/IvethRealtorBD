const whatsappNumber = "17868677180";
const whatsappDefaultMessage = "Hola Iveth, quiero conocer oportunidades para invertir en Miami. ¿Podemos conversar?";
const locationQuery = "7791 NW 46th St STE 308, Doral, FL 33166";

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
    locationFull: "7791 NW 46 ST SUITE 308, Doral, FL 33166",
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
    defaultMessage: whatsappDefaultMessage,
    href: `https://wa.me/${whatsappNumber}`,
    hrefWithMessage: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappDefaultMessage)}`,
  },
} as const;
