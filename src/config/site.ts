const whatsappNumber = "1234567890";
const whatsappDefaultMessage = "Hola Iveth, me interesa invertir en Miami";

export const siteConfig = {
  brand: {
    name: "Iveth Coll",
    descriptor: "International Real Estate Advisor",
  },
  contact: {
    email: "info@ivethcoll.com",
    phoneDisplay: "+1 (234) 567-890",
    phoneHref: "+1234567890",
    location: "Miami, Florida",
    locationFull: "Miami, Florida, USA",
  },
  whatsapp: {
    number: whatsappNumber,
    defaultMessage: whatsappDefaultMessage,
    href: `https://wa.me/${whatsappNumber}`,
    hrefWithMessage: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappDefaultMessage)}`,
  },
} as const;
