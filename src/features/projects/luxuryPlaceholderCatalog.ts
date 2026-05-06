import type { LocalizedText } from "./catalog";

export type ProjectCity = "miami" | "orlando";
export type ProjectGoal = "investment" | "vacation-rental" | "primary-home" | "long-term";
export type ProjectRentalType = "flexible" | "short-term" | "30-90-days" | "long-term";
export type ProjectBudgetRange = "under-500k" | "500k-1m" | "1m-2m" | "2m-plus";

export type LuxuryProject = {
  slug: string;
  city: ProjectCity;
  title: string;
  location: LocalizedText;
  eyebrow: LocalizedText;
  priceLabel: LocalizedText;
  deliveryLabel: LocalizedText;
  rentalLabel: LocalizedText;
  unitsLabel: LocalizedText;
  shortDescription: LocalizedText;
  strategicSummary: LocalizedText;
  cardCta: LocalizedText;
  imageHint: LocalizedText;
  imageUrl?: string;
  detailImageUrl?: string;
  goal: ProjectGoal;
  rentalType: ProjectRentalType;
  budgetRange: ProjectBudgetRange;
  featured?: boolean;
  gallery: Array<{
    label: LocalizedText;
    tone: "sand" | "teal" | "wine" | "sage";
    imageUrl?: string;
  }>;
};

export type LuxuryProjectFilters = {
  city: ProjectCity | "all";
  goal: ProjectGoal | "all";
  rentalType: ProjectRentalType | "all";
  budgetRange: ProjectBudgetRange | "all";
};

export const defaultProjectFilters: LuxuryProjectFilters = {
  city: "all",
  goal: "all",
  rentalType: "all",
  budgetRange: "all",
};

export const projectCityLabels: Record<ProjectCity | "all", LocalizedText> = {
  all: { es: "Todas", en: "All" },
  miami: { es: "Miami", en: "Miami" },
  orlando: { es: "Orlando", en: "Orlando" },
};

export const projectGoalLabels: Record<ProjectGoal | "all", LocalizedText> = {
  all: { es: "Todos", en: "All" },
  investment: { es: "Inversión", en: "Investment" },
  "vacation-rental": { es: "Renta vacacional", en: "Vacation rental" },
  "primary-home": { es: "Vivienda", en: "Primary home" },
  "long-term": { es: "Largo plazo", en: "Long term" },
};

export const projectRentalTypeLabels: Record<ProjectRentalType | "all", LocalizedText> = {
  all: { es: "Todos", en: "All" },
  flexible: { es: "Flexible / Airbnb", en: "Flexible / Airbnb" },
  "short-term": { es: "Renta corta", en: "Short-term" },
  "30-90-days": { es: "30–90 días", en: "30–90 days" },
  "long-term": { es: "Largo plazo", en: "Long-term" },
};

export const projectBudgetRangeLabels: Record<ProjectBudgetRange | "all", LocalizedText> = {
  all: { es: "Todos", en: "All" },
  "under-500k": { es: "Hasta $500K", en: "Up to $500K" },
  "500k-1m": { es: "$500K – $1M", en: "$500K – $1M" },
  "1m-2m": { es: "$1M – $2M", en: "$1M – $2M" },
  "2m-plus": { es: "$2M+", en: "$2M+" },
};

const baseGallery: LuxuryProject["gallery"] = [
  { label: { es: "Fachada", en: "Facade" }, tone: "sand" },
  { label: { es: "Amenidad", en: "Amenity" }, tone: "sage" },
  { label: { es: "Interior", en: "Interior" }, tone: "teal" },
  { label: { es: "Vista", en: "View" }, tone: "wine" },
];

const projectImagesBaseUrl =
  "https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects";

const edgeHouseImages = {
  hero: `${projectImagesBaseUrl}/edge-house-hero.webp`,
  poolDeck: `${projectImagesBaseUrl}/edge-house-pool-deck.webp`,
  livingRoom: `${projectImagesBaseUrl}/edge-house-living-room.webp`,
  aerialNight: `${projectImagesBaseUrl}/edge-house-aerial-night.webp`,
} as const;

const bloomImages = {
  building: `${projectImagesBaseUrl}/bloom-building.webp`,
  apartment: `${projectImagesBaseUrl}/bloom-apartment.webp`,
  lobby: `${projectImagesBaseUrl}/bloom-lobby.webp`,
  rooftopBbq: `${projectImagesBaseUrl}/bloom-rooftop-bbq.webp`,
  projectView: `${projectImagesBaseUrl}/bloom-project-view.webp`,
} as const;

const theWilliamImages = {
  hero: `${projectImagesBaseUrl}/the-william-hero.webp`,
  exterior: `${projectImagesBaseUrl}/the-william-exterior.webp`,
  livingRoom: `${projectImagesBaseUrl}/the-william-living-room.webp`,
  lobby: `${projectImagesBaseUrl}/the-william-lobby.webp`,
  pool: `${projectImagesBaseUrl}/the-william-pool.webp`,
  terrace: `${projectImagesBaseUrl}/the-william-terrace.webp`,
} as const;

const mandarinOrientalImages = {
  hero: `${projectImagesBaseUrl}/mandarin-oriental-residences/hero.webp`,
  hotelArrival: `${projectImagesBaseUrl}/mandarin-oriental-residences/hotel-arrival.webp`,
  diningSkyline: `${projectImagesBaseUrl}/mandarin-oriental-residences/all-day-dining-skyline-seating.webp`,
  gardenCabanas: `${projectImagesBaseUrl}/mandarin-oriental-residences/garden-cabanas.webp`,
  kitchenResidence: `${projectImagesBaseUrl}/mandarin-oriental-residences/kitchen-residence-warm-palette.webp`,
  privateLobby: `${projectImagesBaseUrl}/mandarin-oriental-residences/private-residential-lobby.webp`,
  privateResidence: `${projectImagesBaseUrl}/mandarin-oriental-residences/private-residence.webp`,
  residenceBathroom: `${projectImagesBaseUrl}/mandarin-oriental-residences/residence-bathroom.webp`,
} as const;

export const luxuryPlaceholderProjects: LuxuryProject[] = [
  {
    slug: "edge-house",
    city: "miami",
    title: "EDGE HOUSE",
    location: { es: "Edgewater, Miami", en: "Edgewater, Miami" },
    eyebrow: { es: "Inversión urbana premium", en: "Premium urban investment" },
    priceLabel: { es: "Desde $540,000", en: "From $540,000" },
    deliveryLabel: { es: "Entrega 2030", en: "Delivery 2030" },
    rentalLabel: { es: "Airbnb permitido", en: "Airbnb allowed" },
    unitsLabel: { es: "Studios – 3 habitaciones", en: "Studios – 3 bedrooms" },
    shortDescription: {
      es: "Invierte en Airbnb en el corazón de Edgewater, una de las zonas con mayor crecimiento y demanda.",
      en: "Invest in Airbnb in the heart of Edgewater, one of Miami's highest-growth, high-demand areas.",
    },
    strategicSummary: {
      es: "Edge House está ubicado en Edgewater, con una posición estratégica entre Downtown Miami y Design District, cerca de la bahía de Biscayne y con potencial de renta y apreciación a largo plazo.",
      en: "Edge House is located in Edgewater, strategically positioned between Downtown Miami and the Design District, near Biscayne Bay, with rental potential and long-term appreciation.",
    },
    cardCta: { es: "Descubre Edge House", en: "Discover Edge House" },
    imageHint: { es: "Fachada / skyline", en: "Facade / skyline" },
    imageUrl: edgeHouseImages.hero,
    detailImageUrl: edgeHouseImages.hero,
    goal: "investment",
    rentalType: "flexible",
    budgetRange: "500k-1m",
    featured: true,
    gallery: [
      { label: { es: "Fachada", en: "Facade" }, tone: "sand", imageUrl: edgeHouseImages.hero },
      { label: { es: "Amenidad", en: "Amenity" }, tone: "sage", imageUrl: edgeHouseImages.poolDeck },
      { label: { es: "Interior", en: "Interior" }, tone: "teal", imageUrl: edgeHouseImages.livingRoom },
      { label: { es: "Vista", en: "View" }, tone: "wine", imageUrl: edgeHouseImages.aerialNight },
    ],
  },
  {
    slug: "bloom-north-miami",
    city: "miami",
    title: "BLOOM NORTH MIAMI",
    location: { es: "North Miami", en: "North Miami" },
    eyebrow: { es: "Boutique growth corridor", en: "Boutique growth corridor" },
    priceLabel: { es: "Desde $500K+", en: "From $500K+" },
    deliveryLabel: { es: "Entrega 2029", en: "Delivery 2029" },
    rentalLabel: { es: "Mínimo 90 días", en: "90-day minimum" },
    unitsLabel: { es: "2 habitaciones + den", en: "2 bedrooms + den" },
    shortDescription: {
      es: "Donde el crecimiento de North Miami se convierte en oportunidad para construir patrimonio.",
      en: "Where North Miami's growth becomes an opportunity to build long-term wealth.",
    },
    strategicSummary: {
      es: "Proyecto boutique de 35 unidades y 9 pisos en North Miami, ubicado en una zona en plena transformación urbana con alto potencial de valorización. Su precio de entrada accesible frente a otras áreas de Miami, combinado con rentas mínimas flexibles de 90 días, lo convierte en una opción ideal para inversionistas que buscan generar ingresos y posicionarse temprano en un mercado en crecimiento.",
      en: "A 35-unit, 9-story boutique project in North Miami, located in an area undergoing urban transformation with strong appreciation potential. Its accessible entry price compared with other Miami areas, combined with flexible 90-day minimum rentals, makes it ideal for investors seeking income and early positioning in a growing market.",
    },
    cardCta: { es: "Ver si Bloom es para ti", en: "See if Bloom fits" },
    imageHint: { es: "Fachada / skyline", en: "Facade / skyline" },
    imageUrl: bloomImages.building,
    detailImageUrl: bloomImages.building,
    goal: "investment",
    rentalType: "30-90-days",
    budgetRange: "500k-1m",
    gallery: [
      { label: { es: "Fachada", en: "Facade" }, tone: "sand", imageUrl: bloomImages.building },
      { label: { es: "Interior", en: "Interior" }, tone: "teal", imageUrl: bloomImages.apartment },
      { label: { es: "Lobby", en: "Lobby" }, tone: "sage", imageUrl: bloomImages.lobby },
      { label: { es: "Rooftop", en: "Rooftop" }, tone: "wine", imageUrl: bloomImages.rooftopBbq },
      { label: { es: "Vista del proyecto", en: "Project view" }, tone: "teal", imageUrl: bloomImages.projectView },
    ],
  },
  {
    slug: "mandarin-oriental-residences",
    city: "miami",
    title: "MANDARIN ORIENTAL RESIDENCES",
    location: { es: "Brickell Key, Miami", en: "Brickell Key, Miami" },
    eyebrow: { es: "Ultra lujo frente al agua", en: "Waterfront ultra-luxury" },
    priceLabel: { es: "Desde $6M", en: "From $6M" },
    deliveryLabel: { es: "Entrega 2030", en: "Delivery 2030" },
    rentalLabel: { es: "Restricciones de renta", en: "Rental restrictions" },
    unitsLabel: {
      es: "2, 3, 4 & 5 habitaciones",
      en: "2, 3, 4 & 5 bedrooms",
    },
    shortDescription: {
      es: "Residencias icónicas en Brickell Key con vistas panorámicas, vida de resort cosmopolita y servicio Mandarin Oriental.",
      en: "Iconic residences on Brickell Key with panoramic views, cosmopolitan resort living, and Mandarin Oriental service.",
    },
    strategicSummary: {
      es: "The Residences at Mandarin Oriental, Miami se elevan sobre la costa de Brickell Key con 66 pisos y 228 residencias. Desarrolladas por Swire Properties, combinan glamour, vistas panorámicas y servicio cinco estrellas para compradores de alto patrimonio que buscan preservar capital en una propiedad icónica frente al agua.",
      en: "The Residences at Mandarin Oriental, Miami rise above the Brickell Key waterfront with 66 floors and 228 residences. Developed by Swire Properties, they combine glamour, panoramic views, and five-star service for high-net-worth buyers seeking to preserve capital in an iconic waterfront property.",
    },
    cardCta: { es: "Descubre Mandarin Oriental", en: "Discover Mandarin Oriental" },
    imageHint: { es: "Fachada / skyline", en: "Facade / skyline" },
    imageUrl: mandarinOrientalImages.hero,
    detailImageUrl: mandarinOrientalImages.hero,
    goal: "investment",
    rentalType: "long-term",
    budgetRange: "2m-plus",
    gallery: [
      { label: { es: "Fachada", en: "Facade" }, tone: "sand", imageUrl: mandarinOrientalImages.hero },
      { label: { es: "Llegada hotel", en: "Hotel arrival" }, tone: "teal", imageUrl: mandarinOrientalImages.hotelArrival },
      { label: { es: "Dining skyline", en: "Skyline dining" }, tone: "wine", imageUrl: mandarinOrientalImages.diningSkyline },
      { label: { es: "Cabanas jardín", en: "Garden cabanas" }, tone: "sage", imageUrl: mandarinOrientalImages.gardenCabanas },
      { label: { es: "Cocina residencia", en: "Residence kitchen" }, tone: "teal", imageUrl: mandarinOrientalImages.kitchenResidence },
      { label: { es: "Lobby privado", en: "Private lobby" }, tone: "sand", imageUrl: mandarinOrientalImages.privateLobby },
      { label: { es: "Residencia privada", en: "Private residence" }, tone: "wine", imageUrl: mandarinOrientalImages.privateResidence },
      { label: { es: "Baño residencia", en: "Residence bathroom" }, tone: "sage", imageUrl: mandarinOrientalImages.residenceBathroom },
    ],
  },
  {
    slug: "midtown-park",
    city: "miami",
    title: "MIDTOWN PARK",
    location: { es: "Midtown Miami", en: "Midtown Miami" },
    eyebrow: { es: "Lifestyle premium", en: "Premium lifestyle" },
    priceLabel: { es: "Desde $XXXK", en: "From $XXXK" },
    deliveryLabel: { es: "Entrega 20XX", en: "Delivery 20XX" },
    rentalLabel: { es: "Residencial / inversión", en: "Residential / investment" },
    unitsLabel: { es: "1–4 habitaciones", en: "1–4 bedrooms" },
    shortDescription: {
      es: "Entre Wynwood, Design District y Edgewater, con marca, ubicación y experiencia premium.",
      en: "Between Wynwood, Design District, and Edgewater with brand, location, and premium experience.",
    },
    strategicSummary: {
      es: "Para compradores que quieren una dirección reconocible y una experiencia urbana sofisticada.",
      en: "For buyers who want a recognizable address and a sophisticated urban experience.",
    },
    cardCta: { es: "Conoce Midtown Park", en: "Meet Midtown Park" },
    imageHint: { es: "Fachada urbana", en: "Urban facade" },
    goal: "primary-home",
    rentalType: "long-term",
    budgetRange: "1m-2m",
    gallery: baseGallery,
  },
  {
    slug: "the-william",
    city: "miami",
    title: "THE WILLIAM RESIDENCES",
    location: { es: "North Miami Beach", en: "North Miami Beach" },
    eyebrow: { es: "Entrada temprana NMB", en: "Early NMB entry" },
    priceLabel: { es: "Desde $380,000", en: "From $380,000" },
    deliveryLabel: { es: "Entrega 2029", en: "Delivery 2029" },
    rentalLabel: { es: "Mínimo 90 días", en: "90-day minimum" },
    unitsLabel: { es: "Studios – 3 habitaciones", en: "Studios – 3 bedrooms" },
    shortDescription: {
      es: "Una entrada estratégica para posicionarte temprano en North Miami Beach.",
      en: "A strategic entry point to position early in North Miami Beach.",
    },
    strategicSummary: {
      es: "The William Residences es una torre refinada de 26 pisos y 374 residencias en North Miami Beach, cerca de playas, tiendas, restaurantes, aeropuertos, centros de negocios y espacios culturales. Su ubicación conectada y renta mínima de 90 días lo posicionan como una alternativa para diversificar capital en una zona con proyección real.",
      en: "The William Residences is a refined 26-story tower with 374 residences in North Miami Beach, close to beaches, shopping, restaurants, airports, business centers, and cultural venues. Its connected location and 90-day minimum rental policy position it as an alternative for diversifying capital in an area with real growth potential.",
    },
    cardCta: { es: "Ver The William", en: "View The William" },
    imageHint: { es: "Fachada / lifestyle", en: "Facade / lifestyle" },
    imageUrl: theWilliamImages.hero,
    detailImageUrl: theWilliamImages.hero,
    goal: "investment",
    rentalType: "30-90-days",
    budgetRange: "under-500k",
    gallery: [
      { label: { es: "Fachada", en: "Facade" }, tone: "sand", imageUrl: theWilliamImages.hero },
      { label: { es: "Exterior", en: "Exterior" }, tone: "teal", imageUrl: theWilliamImages.exterior },
      { label: { es: "Interior", en: "Interior" }, tone: "sage", imageUrl: theWilliamImages.livingRoom },
      { label: { es: "Lobby", en: "Lobby" }, tone: "wine", imageUrl: theWilliamImages.lobby },
      { label: { es: "Piscina", en: "Pool" }, tone: "teal", imageUrl: theWilliamImages.pool },
      { label: { es: "Terraza", en: "Terrace" }, tone: "sand", imageUrl: theWilliamImages.terrace },
    ],
  },
  {
    slug: "cassia",
    city: "miami",
    title: "CASSIA",
    location: { es: "Coral Gables / South Miami", en: "Coral Gables / South Miami" },
    eyebrow: { es: "Perfil residencial sólido", en: "Strong residential profile" },
    priceLabel: { es: "Desde $XXXK", en: "From $XXXK" },
    deliveryLabel: { es: "Entrega 20XX", en: "Delivery 20XX" },
    rentalLabel: { es: "Renta estable", en: "Stable rental" },
    unitsLabel: { es: "1–3 habitaciones", en: "1–3 bedrooms" },
    shortDescription: {
      es: "Opción para comprador que busca ubicación sólida, perfil residencial y estrategia de largo plazo.",
      en: "Option for buyers seeking a solid location, residential profile, and long-term strategy.",
    },
    strategicSummary: {
      es: "Pensado para una tesis más conservadora: ubicación, estabilidad y demanda residencial.",
      en: "Built for a more conservative thesis: location, stability, and residential demand.",
    },
    cardCta: { es: "Explora Cassia", en: "Explore Cassia" },
    imageHint: { es: "Interior elegante", en: "Elegant interior" },
    goal: "long-term",
    rentalType: "long-term",
    budgetRange: "1m-2m",
    gallery: baseGallery,
  },
  {
    slug: "reunion-village",
    city: "orlando",
    title: "REUNION VILLAGE",
    location: { es: "Reunion / Kissimmee", en: "Reunion / Kissimmee" },
    eyebrow: { es: "Comunidad vacacional", en: "Vacation community" },
    priceLabel: { es: "Desde $XXXK", en: "From $XXXK" },
    deliveryLabel: { es: "Entrega 20XX", en: "Delivery 20XX" },
    rentalLabel: { es: "Short-term rental", en: "Short-term rental" },
    unitsLabel: { es: "Casas / townhomes", en: "Homes / townhomes" },
    shortDescription: {
      es: "Comunidad orientada a renta vacacional con posibilidad de administración profesional.",
      en: "Vacation-rental community with potential for professional management.",
    },
    strategicSummary: {
      es: "Para inversionistas que buscan exposición al mercado turístico de Orlando y una experiencia tipo resort.",
      en: "For investors seeking Orlando tourism exposure and a resort-style experience.",
    },
    cardCta: { es: "Ver Reunion", en: "View Reunion" },
    imageHint: { es: "Resort / comunidad", en: "Resort / community" },
    goal: "vacation-rental",
    rentalType: "short-term",
    budgetRange: "500k-1m",
    featured: true,
    gallery: baseGallery,
  },
  {
    slug: "storey-lake",
    city: "orlando",
    title: "STOREY LAKE",
    location: { es: "Kissimmee", en: "Kissimmee" },
    eyebrow: { es: "Cercanía a parques", en: "Near theme parks" },
    priceLabel: { es: "Desde $XXXK", en: "From $XXXK" },
    deliveryLabel: { es: "Entrega 20XX", en: "Delivery 20XX" },
    rentalLabel: { es: "Renta vacacional", en: "Vacation rental" },
    unitsLabel: { es: "Townhomes / casas", en: "Townhomes / homes" },
    shortDescription: {
      es: "Alta demanda por cercanía a parques temáticos y perfil familiar/turístico.",
      en: "High demand due to proximity to theme parks and a family/tourism profile.",
    },
    strategicSummary: {
      es: "Fácil de explicar a compradores internacionales por ubicación, uso y experiencia.",
      en: "Easy to explain to international buyers thanks to location, use case, and experience.",
    },
    cardCta: { es: "Explora Storey Lake", en: "Explore Storey Lake" },
    imageHint: { es: "Piscina / casa modelo", en: "Pool / model home" },
    goal: "vacation-rental",
    rentalType: "short-term",
    budgetRange: "500k-1m",
    gallery: baseGallery,
  },
  {
    slug: "windsor-cay",
    city: "orlando",
    title: "WINDSOR CAY",
    location: { es: "Área Orlando", en: "Orlando area" },
    eyebrow: { es: "Resort rental", en: "Resort rental" },
    priceLabel: { es: "Desde $XXXK", en: "From $XXXK" },
    deliveryLabel: { es: "Entrega 20XX", en: "Delivery 20XX" },
    rentalLabel: { es: "Renta corta", en: "Short-term rental" },
    unitsLabel: { es: "Casas familiares", en: "Family homes" },
    shortDescription: {
      es: "Perfil resort para inversionista que busca amenities fuertes y experiencia vacacional completa.",
      en: "Resort profile for investors seeking strong amenities and a complete vacation experience.",
    },
    strategicSummary: {
      es: "La tesis se apoya en amenities, escala de comunidad y demanda turística recurrente.",
      en: "The thesis is supported by amenities, community scale, and recurring tourism demand.",
    },
    cardCta: { es: "Ver Windsor", en: "View Windsor" },
    imageHint: { es: "Clubhouse / piscina", en: "Clubhouse / pool" },
    goal: "vacation-rental",
    rentalType: "short-term",
    budgetRange: "1m-2m",
    gallery: baseGallery,
  },
  {
    slug: "everbe",
    city: "orlando",
    title: "EVERBE",
    location: { es: "Orlando", en: "Orlando" },
    eyebrow: { es: "Alternativa local", en: "Local alternative" },
    priceLabel: { es: "Desde $XXXK", en: "From $XXXK" },
    deliveryLabel: { es: "Entrega 20XX", en: "Delivery 20XX" },
    rentalLabel: { es: "Vivienda / largo plazo", en: "Primary home / long-term" },
    unitsLabel: { es: "Casas modernas", en: "Modern homes" },
    shortDescription: {
      es: "Alternativa para comprador local o inversión de largo plazo, no necesariamente vacacional.",
      en: "Alternative for local buyers or long-term investment, not necessarily vacation-focused.",
    },
    strategicSummary: {
      es: "Ayuda a cubrir el perfil residente o comprador con estrategia más estable.",
      en: "Helps cover the resident buyer or a buyer with a more stable strategy.",
    },
    cardCta: { es: "Explora esta opción", en: "Explore this option" },
    imageHint: { es: "Comunidad familiar", en: "Family community" },
    goal: "primary-home",
    rentalType: "long-term",
    budgetRange: "under-500k",
    gallery: baseGallery,
  },
];

export function getLuxuryProjectBySlug(slug: string | undefined) {
  return luxuryPlaceholderProjects.find((project) => project.slug === slug) ?? null;
}

export function filterLuxuryProjects(projects: LuxuryProject[], filters: LuxuryProjectFilters) {
  return projects.filter((project) => {
    const matchesCity = filters.city === "all" || project.city === filters.city;
    const matchesGoal = filters.goal === "all" || project.goal === filters.goal;
    const matchesRental = filters.rentalType === "all" || project.rentalType === filters.rentalType;
    const matchesBudget = filters.budgetRange === "all" || project.budgetRange === filters.budgetRange;

    return matchesCity && matchesGoal && matchesRental && matchesBudget;
  });
}
