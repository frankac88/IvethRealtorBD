import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, CheckCircle2, Compass, Home, MessageCircle, Palmtree, ShieldCheck, Sparkles } from "lucide-react";

import LeadCaptureForm, { type LeadInterest } from "@/components/LeadCaptureForm";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createWhatsAppHref } from "@/config/site";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import heroMiami from "@/assets/hero-miami.webp";
import investHeroFlorida from "@/assets/invest-hero-florida.webp";

type LocalizedText = { es: string; en: string };
type ZoneValue =
  | "davenport"
  | "kissimmee"
  | "clermont-four-corners"
  | "brickell"
  | "miami-beach"
  | "fort-lauderdale"
  | "unsure";
type ObjectiveValue = "short-rental" | "traditional-rental" | "appreciation" | "second-home" | "unsure";
type BudgetValue = "300-500" | "500-800" | "800-plus" | "evaluate";
type InvestmentFormField = "zone" | "objective" | "budget";
type InvestmentFormErrors = Partial<Record<InvestmentFormField, string>>;

interface MiamiZone {
  value: ZoneValue;
  title: LocalizedText;
  body: LocalizedText;
  accent: string;
  image: string;
  imageAlt: LocalizedText;
}

interface OrlandoZone {
  value: ZoneValue;
  title: LocalizedText;
  subtitle: LocalizedText;
  body: LocalizedText;
  highlights: LocalizedText[];
  microZones: LocalizedText;
  quote: LocalizedText;
  cta: LocalizedText;
  accent: string;
  image: string;
  imageAlt: LocalizedText;
  icon: typeof Home;
}

const copy = {
  eyebrow: { es: "Estrategia de inversión inmobiliaria", en: "Real estate investment strategy" },
  heroTitle: { es: "Invertir en Florida", en: "Invest in Florida" },
  heroText: {
    es: "Invertir en Florida requiere más que elegir una ciudad: requiere una estrategia clara desde el inicio. Te acompaño a entender las diferencias entre Miami y Orlando, y a tomar decisiones informadas antes de invertir.",
    en: "Investing in Florida requires more than choosing a city: it requires a clear strategy from the beginning. I help you understand the differences between Miami and Orlando so you can make informed decisions before investing.",
  },
  primaryCta: { es: "Agenda una asesoría personalizada", en: "Schedule a personalized consultation" },
  cardPrimaryCta: { es: "Solicitar asesoría", en: "Request advisory" },
  whatsappCta: { es: "Hablar por WhatsApp", en: "Talk on WhatsApp" },
  whatsappDirect: { es: "WhatsApp directo", en: "Direct WhatsApp" },
  miamiTitle: { es: "Miami: un mercado, múltiples estrategias", en: "Miami: one market, multiple strategies" },
  miamiText: {
    es: "Miami no es un solo mercado… son varios dentro de la misma ciudad. Cada zona tiene dinámicas distintas.",
    en: "Miami is not a single market… it is several markets within the same city. Each area has different dynamics.",
  },
  orlandoTitle: { es: "Orlando: inversión, turismo y flujo de caja", en: "Orlando: investment, tourism and cash flow" },
  orlandoIntro: {
    es: "Invertir en Orlando requiere entender que no todas las zonas funcionan igual. Algunas áreas están diseñadas para rentas cortas y turismo; otras pueden funcionar mejor para crecimiento, segunda vivienda o renta tradicional.",
    en: "Investing in Orlando requires understanding that not every area works the same. Some areas are designed for short-term rentals and tourism; others may work better for growth, a second home, or traditional rental.",
  },
  orlandoMain: {
    es: "Orlando es uno de los mercados más reconocidos para inversionistas que buscan ingresos a través de rentas, especialmente en zonas cercanas al corredor turístico. Pero el error más común es pensar que cualquier propiedad en Orlando funciona para renta corta.",
    en: "Orlando is one of the most recognized markets for investors seeking rental income, especially near the tourism corridor. The most common mistake is thinking that any property in Orlando works for short-term rental.",
  },
  orlandoComplement: {
    es: "Aquí la clave está en analizar ubicación, permisos, comunidad, amenidades, demanda y costos de operación.",
    en: "The key is analyzing location, permits, community rules, amenities, demand, and operating costs.",
  },
  formTitle: { es: "Asesoría personalizada", en: "Personalized consultation" },
  formDesc: {
    es: "Completa estos datos para evaluar ciudad, zona, presupuesto y estrategia antes de conversar.",
    en: "Complete these details to evaluate city, area, budget, and strategy before we talk.",
  },
  finalTitle: { es: "¿No sabes qué zona se ajusta mejor a tu perfil?", en: "Not sure which area best fits your profile?" },
  finalText: {
    es: "Cada inversionista tiene objetivos distintos. Antes de elegir una propiedad, es importante analizar ciudad, zona, regulación, presupuesto, tipo de renta y estrategia de salida.",
    en: "Every investor has different goals. Before choosing a property, it is important to analyze city, area, regulation, budget, rental type, and exit strategy.",
  },
  legal: {
    es: "Cada propiedad debe validar reglas de HOA, permisos de renta y regulaciones locales antes de invertir. La información presentada es orientativa y no representa una promesa de rentabilidad.",
    en: "Each property must validate HOA rules, rental permits, and local regulations before investing. The information presented is educational and does not represent a promise of returns.",
  },
  successDesc: {
    es: "Gracias. Te llevaremos a WhatsApp para continuar la conversación con Iveth.",
    en: "Thank you. We will take you to WhatsApp to continue the conversation with Iveth.",
  },
  sending: { es: "Enviando...", en: "Sending..." },
  submit: { es: "Enviar y continuar por WhatsApp", en: "Send and continue on WhatsApp" },
  required: { es: "Completa los campos requeridos.", en: "Complete the required fields." },
} as const;

const miamiZones: MiamiZone[] = [
  {
    value: "brickell",
    title: { es: "Brickell", en: "Brickell" },
    body: {
      es: "Centro financiero con alta valorización y demanda internacional. No todos los proyectos generan el mismo resultado.",
      en: "Financial center with strong appreciation potential and international demand. Not every project produces the same outcome.",
    },
    accent: "from-primary/90 via-primary/70 to-accent/70",
    image: "https://images.unsplash.com/photo-1748380868276-6faae7e27b94?auto=format&fit=crop&w=1400&q=80",
    imageAlt: { es: "Vista frente al agua de Brickell Key y el panorama urbano de Miami", en: "Waterfront view of Brickell Key and the Miami skyline" },
  },
  {
    value: "miami-beach",
    title: { es: "Miami Beach", en: "Miami Beach" },
    body: {
      es: "Zona turística con propiedades frente al mar y regulaciones específicas. La elección del edificio es clave.",
      en: "Tourism-driven area featuring prime oceanfront properties and specific local regulations. Careful building selection is key.",
    },
    accent: "from-accent/85 via-wine/70 to-primary/70",
    image: "https://images.unsplash.com/photo-1718644526868-76adfc840dbc?auto=format&fit=crop&w=1400&q=80",
    imageAlt: { es: "Arquitectura de Miami Beach con palmeras", en: "Miami Beach architecture with palm trees" },
  },
  {
    value: "fort-lauderdale",
    title: { es: "Fort Lauderdale", en: "Fort Lauderdale" },
    body: {
      es: "Alternativa estratégica con buen balance entre precio y ubicación. No todas las zonas tienen el mismo potencial.",
      en: "Strategic alternative with a strong balance between price and location. Not every area has the same potential.",
    },
    accent: "from-green-light/90 via-primary/70 to-gold-light/80",
    image: "https://images.unsplash.com/photo-1766373165231-8807829cd12b?auto=format&fit=crop&w=1400&q=80",
    imageAlt: { es: "Canales y panorama urbano del centro de Fort Lauderdale", en: "Downtown Fort Lauderdale canals and skyline" },
  },
];

const sharedOrlandoQuote = {
  es: "La oportunidad no está solo en comprar cerca de los parques; está en elegir la comunidad correcta, con reglas claras y una estrategia de renta viable.",
  en: "The opportunity is not only buying near the parks; it is choosing the right community, with clear rules and a viable rental strategy.",
};

const orlandoZones: OrlandoZone[] = [
  {
    value: "davenport",
    title: { es: "Davenport", en: "Davenport" },
    subtitle: {
      es: "Complejos turísticos, nuevas comunidades y atractivo para renta vacacional",
      en: "Resorts, new communities, and vacation rental appeal",
    },
    body: {
      es: "Davenport se ha convertido en una de las zonas más buscadas por inversionistas que quieren entrar al mercado vacacional con propiedades tipo complejo turístico, casas con piscina y comunidades preparadas para recibir familias y grupos.",
      en: "Davenport has become one of the most sought-after areas for investors entering the vacation market with resort-style properties, pool homes, and communities prepared to host families and groups.",
    },
    highlights: [
      { es: "Puede ofrecer precios de entrada más competitivos que zonas más cercanas a Disney.", en: "It may offer more competitive entry prices than areas closer to Disney." },
      { es: "Fuerte presencia de comunidades diseñadas para rentas cortas.", en: "Strong presence of communities designed for short-term rentals." },
      { es: "Ideal para analizar flujo de caja, ocupación, amenidades y administración profesional.", en: "Ideal for analyzing cash flow, occupancy, amenities, and professional management." },
      { es: "No todas las comunidades tienen el mismo potencial ni las mismas reglas.", en: "Not all communities have the same potential or rules." },
    ],
    microZones: { es: "ChampionsGate, Solterra Resort, Providence y áreas cercanas a la I-4.", en: "ChampionsGate, Solterra Resort, Providence, and areas near I-4." },
    quote: sharedOrlandoQuote,
    cta: { es: "Evalúa si Davenport es la opción correcta para ti", en: "Evaluate whether Davenport is right for you" },
    accent: "from-primary/90 via-primary/70 to-accent/70",
    image: "https://images.unsplash.com/photo-1659455857065-956ea7297f66?auto=format&fit=crop&w=1200&q=80",
    imageAlt: { es: "Piscina tipo resort en Orlando", en: "Resort-style pool in Orlando" },
    icon: Home,
  },
  {
    value: "kissimmee",
    title: { es: "Kissimmee", en: "Kissimmee" },
    subtitle: {
      es: "Cercanía a parques, demanda turística y comunidades vacacionales",
      en: "Park proximity, tourism demand, and vacation communities",
    },
    body: {
      es: "Kissimmee es una de las zonas más conocidas para inversión en propiedades vacacionales cerca de Disney. Su fortaleza está en la demanda turística, la infraestructura de servicios y la variedad de comunidades orientadas a visitantes.",
      en: "Kissimmee is one of the best-known areas for vacation property investment near Disney. Its strength is tourism demand, service infrastructure, and the variety of visitor-oriented communities.",
    },
    highlights: [
      { es: "Alta demanda por cercanía a parques y atracciones.", en: "High demand due to proximity to parks and attractions." },
      { es: "Inventario amplio de casas vacacionales y casas adosadas.", en: "Broad inventory of vacation homes and townhomes." },
      { es: "Buen encaje para inversionistas que buscan renta corta.", en: "Strong fit for investors seeking short-term rental." },
      { es: "La diferencia está en elegir bien la comunidad, el HOA y las restricciones.", en: "The difference is choosing the right community, HOA, and restrictions." },
    ],
    microZones: { es: "Storey Lake, Windsor at Westside, Windsor Hills, Reunion y zonas de Osceola County.", en: "Storey Lake, Windsor at Westside, Windsor Hills, Reunion, and Osceola County areas." },
    quote: sharedOrlandoQuote,
    cta: { es: "Descubre si Kissimmee encaja en tu estrategia", en: "Discover whether Kissimmee fits your strategy" },
    accent: "from-accent/85 via-wine/70 to-primary/70",
    image: "https://images.unsplash.com/photo-1707505175638-81b09e30cac8?auto=format&fit=crop&w=1200&q=80",
    imageAlt: { es: "Lago con palmeras en el área de Orlando", en: "Lake with palm trees in the Orlando area" },
    icon: Palmtree,
  },
  {
    value: "clermont-four-corners",
    title: { es: "Clermont / Four Corners", en: "Clermont / Four Corners" },
    subtitle: {
      es: "Crecimiento, estilo de vida y oportunidades selectivas",
      en: "Growth, lifestyle, and selective opportunities",
    },
    body: {
      es: "Clermont y el área de Four Corners pueden ser una alternativa interesante para inversionistas que buscan una combinación entre crecimiento, estilo de vida, accesibilidad y oportunidades según la regulación específica de cada zona.",
      en: "Clermont and the Four Corners area can be an interesting alternative for investors seeking a mix of growth, lifestyle, accessibility, and opportunities according to each area's regulations.",
    },
    highlights: [
      { es: "Puede funcionar para inversionistas que buscan algo más allá del turismo tradicional.", en: "It may work for investors seeking something beyond traditional tourism." },
      { es: "Buena conexión con corredores del área central de Florida.", en: "Good connection with Central Florida corridors." },
      { es: "Interesante para segunda vivienda, renta tradicional o estrategias mixtas según ubicación.", en: "Interesting for a second home, traditional rental, or mixed strategies depending on location." },
      { es: "Es obligatorio validar permisos, HOA y reglas antes de comprar.", en: "It is mandatory to validate permits, HOA, and rules before buying." },
    ],
    microZones: { es: "Four Corners, áreas cercanas al corredor de Disney, Clermont y comunidades con permisos claros.", en: "Four Corners, areas near the Disney corridor, Clermont, and communities with clear permits." },
    quote: sharedOrlandoQuote,
    cta: { es: "Explora si esta zona se ajusta a tu perfil", en: "Explore whether this area fits your profile" },
    accent: "from-green-light/90 via-primary/70 to-gold-light/80",
    image: "https://images.unsplash.com/photo-1647579350413-a6ada4e480ed?auto=format&fit=crop&w=1200&q=80",
    imageAlt: { es: "Casa residencial en Florida Central", en: "Residential home in Central Florida" },
    icon: Compass,
  },
];

const zoneOptions: Array<{ value: ZoneValue; label: LocalizedText }> = [
  { value: "davenport", label: { es: "Davenport", en: "Davenport" } },
  { value: "kissimmee", label: { es: "Kissimmee", en: "Kissimmee" } },
  { value: "clermont-four-corners", label: { es: "Clermont / Four Corners", en: "Clermont / Four Corners" } },
  { value: "brickell", label: { es: "Brickell", en: "Brickell" } },
  { value: "miami-beach", label: { es: "Miami Beach", en: "Miami Beach" } },
  { value: "fort-lauderdale", label: { es: "Fort Lauderdale", en: "Fort Lauderdale" } },
  { value: "unsure", label: { es: "No estoy seguro", en: "Not sure" } },
];

const objectiveOptions: Array<{ value: ObjectiveValue; label: LocalizedText }> = [
  { value: "short-rental", label: { es: "Renta corta", en: "Short-term rental" } },
  { value: "traditional-rental", label: { es: "Renta tradicional", en: "Traditional rental" } },
  { value: "appreciation", label: { es: "Valorización", en: "Appreciation" } },
  { value: "second-home", label: { es: "Segunda vivienda", en: "Second home" } },
  { value: "unsure", label: { es: "No estoy seguro", en: "Not sure" } },
];

const budgetOptions: Array<{ value: BudgetValue; label: LocalizedText }> = [
  { value: "300-500", label: { es: "$300K - $500K", en: "$300K - $500K" } },
  { value: "500-800", label: { es: "$500K - $800K", en: "$500K - $800K" } },
  { value: "800-plus", label: { es: "$800K+", en: "$800K+" } },
  { value: "evaluate", label: { es: "Deseo evaluarlo", en: "I want to evaluate it" } },
];

const getOptionLabel = <T extends string>(options: Array<{ value: T; label: LocalizedText | string }>, value: T, language: "es" | "en") => {
  const option = options.find((item) => item.value === value);
  if (!option) return value;
  return typeof option.label === "string" ? option.label : option.label[language];
};

const isOrlandoZone = (zone: ZoneValue | "") =>
  zone === "davenport" || zone === "kissimmee" || zone === "clermont-four-corners";

const WhatsappChatIcon = ({ size = 16, tone = "green" }: { size?: number; tone?: "green" | "white" }) => (
  <MessageCircle
    size={size}
    className={tone === "white"
      ? "fill-none text-white"
      : "fill-none text-[hsl(var(--whatsapp-green))] transition-colors duration-300 group-hover:text-white"}
  />
);

const InvestPage = () => {
  const t = useT();
  const { language } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [zone, setZone] = useState<ZoneValue | "">("");
  const [objective, setObjective] = useState<ObjectiveValue | "">("");
  const [budget, setBudget] = useState<BudgetValue | "">("");
  const [investmentErrors, setInvestmentErrors] = useState<InvestmentFormErrors>({});

  const whatsappHref = createWhatsAppHref(
    "Hola Iveth, vengo desde la página Invertir en Florida y quiero asesoría de inversión.",
  );

  useEffect(() => {
    document.title = "Invertir en Florida | Inversión inmobiliaria en Miami y Orlando";

    const description =
      "Descubre cómo invertir estratégicamente en Florida. Compara oportunidades en Miami, Orlando, Brickell, Miami Beach, Fort Lauderdale, Davenport, Kissimmee y Clermont con asesoría personalizada.";
    const keywords =
      "invertir en Florida, invertir en Miami, invertir en Orlando, realtor en Miami, inversión inmobiliaria en Florida, propiedades de inversión en Orlando, rentas cortas Orlando, preconstrucción Miami, asesoría inmobiliaria Florida";

    const setMeta = (name: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
  }, []);

  const labels = useMemo(
    () => ({
      zone: language === "es" ? "Zona de interés" : "Area of interest",
      objective: language === "es" ? "Objetivo" : "Goal",
      budget: language === "es" ? "Rango aproximado de inversión" : "Approximate investment range",
    }),
    [language],
  );

  const openForm = (selectedZone?: ZoneValue) => {
    if (selectedZone) {
      setZone(selectedZone);
      setInvestmentErrors((prev) => {
        const next = { ...prev };
        delete next.zone;
        return next;
      });
    }
    setIsFormOpen(true);
  };

  const clearInvestmentError = (field: InvestmentFormField) => {
    setInvestmentErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateInvestmentFields = () => {
    const nextErrors: InvestmentFormErrors = {};

    if (!zone) nextErrors.zone = t(copy.required);
    if (!objective) nextErrors.objective = t(copy.required);
    if (!budget) nextErrors.budget = t(copy.required);

    setInvestmentErrors(nextErrors);
    return Object.values(nextErrors)[0] ?? null;
  };

  const getInvestmentInterest = (): LeadInterest => {
    if (isOrlandoZone(zone)) return "orlando";
    if (zone === "unsure") return "other";
    return "miami";
  };

  const getInvestmentMessage = (baseMessage: string | null) => {
    const zoneLabel = getOptionLabel(zoneOptions, zone, language);
    const objectiveLabel = getOptionLabel(objectiveOptions, objective, language);
    const budgetLabel = getOptionLabel(budgetOptions, budget, language);
    const details = `Formulario Invertir en Florida | Zona: ${zoneLabel} | Objetivo: ${objectiveLabel} | Rango: ${budgetLabel}`;

    return baseMessage ? `${details} | Mensaje: ${baseMessage}` : details;
  };

  const handleInvestmentSuccess = () => {
    const zoneLabel = getOptionLabel(zoneOptions, zone, "es");
    const objectiveLabel = getOptionLabel(objectiveOptions, objective, "es");
    const budgetLabel = getOptionLabel(budgetOptions, budget, "es");
    const formWhatsappMessage =
      `Hola Iveth, completé el formulario de Invertir en Florida. Zona: ${zoneLabel}. Objetivo: ${objectiveLabel}. Presupuesto: ${budgetLabel}.`;

    setObjective("");
    setBudget("");
    setInvestmentErrors({});
    window.setTimeout(() => {
      window.location.href = createWhatsAppHref(formWhatsappMessage);
    }, 900);
  };

  return (
    <Layout>
      <section className="relative isolate overflow-hidden bg-background">
        <img
          src={investHeroFlorida}
          alt={t({
            es: "Panorama urbano y frente al agua inmobiliario de Florida",
            en: "Florida real estate skyline and waterfront",
          })}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 8%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/48 to-background/24" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="container relative mx-auto grid min-h-[72svh] items-end px-4 py-16 lg:px-8 lg:py-20">
          <div className="min-w-0 max-w-3xl pb-6 text-white">
            <p className="mb-4 inline-flex max-w-full rounded-full border border-white/30 bg-white/10 px-4 py-2 text-center text-[0.68rem] font-medium uppercase leading-relaxed tracking-[0.18em] backdrop-blur sm:text-[0.72rem] sm:tracking-[0.24em]">
              {t(copy.eyebrow)}
            </p>
            <h1 className="type-h1 mb-6 text-white">{t(copy.heroTitle)}</h1>
            <p className="type-body mb-8 max-w-full text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:max-w-2xl">{t(copy.heroText)}</p>
            <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row">
              <Button variant="hero" size="lg" className="h-auto min-h-12 w-full whitespace-normal px-5 py-3 text-center text-sm leading-snug sm:w-auto sm:px-10 sm:text-base" asChild>
                <Link to={`${getLocalizedPath("contact", language)}#contact-form-view`}>
                  {t(copy.primaryCta)}
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" className="group h-auto min-h-12 w-full whitespace-normal px-5 py-3 text-center text-sm leading-snug sm:w-auto sm:px-10 sm:text-base" asChild>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <WhatsappChatIcon size={18} tone="white" />
                  {t(copy.whatsappCta)}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <article className="mx-auto mb-12 max-w-6xl overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-[0_18px_60px_-42px_rgba(26,31,46,0.45)]">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-7 md:p-9 lg:p-10">
                <p className="type-caption mb-4">{t({ es: "Estrategia Miami", en: "Miami strategy" })}</p>
                <h2 className="type-h2 mb-5 text-foreground">{t(copy.miamiTitle)}</h2>
                <p className="type-body max-w-2xl">{t(copy.miamiText)}</p>
              </div>
              <div className="relative min-h-[260px] overflow-hidden bg-gradient-to-br from-primary/90 via-primary/70 to-accent/70 lg:min-h-full">
                <img
                  src={heroMiami}
                  alt={t({ es: "Panorama urbano de Miami", en: "Miami skyline" })}
                  className="absolute inset-0 h-full w-full object-cover opacity-82 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/20 via-transparent to-primary/30" />
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(135deg,rgba(255,255,255,.45)_0_1px,transparent_1px_18px)]" />
                <div className="absolute bottom-5 left-5 rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur">
                  Miami
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-6 lg:grid-cols-3">
            {miamiZones.map((zoneItem) => (
              <article key={zoneItem.value} className="group overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-[0_18px_60px_-42px_rgba(26,31,46,0.45)]">
                <div className={`relative h-44 bg-gradient-to-br ${zoneItem.accent}`}>
                  <img
                    src={zoneItem.image}
                    alt={t(zoneItem.imageAlt)}
                    className="absolute inset-0 h-full w-full object-cover opacity-78 mix-blend-overlay transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/16 via-transparent to-primary/30" />
                  <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(135deg,rgba(255,255,255,.45)_0_1px,transparent_1px_18px)]" />
                  <div className="absolute bottom-5 left-5 rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur">
                    Miami
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="mb-3 font-serif text-3xl font-medium tracking-[-0.03em]">{t(zoneItem.title)}</h3>
                  <p className="type-body-sm mb-6">{t(zoneItem.body)}</p>
                  <div className="flex flex-row gap-2">
                    <Button
                      type="button"
                      variant="hero"
                      className="h-auto min-h-11 flex-1 whitespace-normal px-3 py-2 text-center text-[0.72rem] leading-tight tracking-[0.04em] min-[380px]:text-[0.78rem]"
                      onClick={() => openForm(zoneItem.value)}
                    >
                      {t(copy.cardPrimaryCta)}
                    </Button>
                    <Button
                      variant="outline"
                      className="group h-auto min-h-11 flex-1 whitespace-normal px-3 py-2 text-center text-[0.72rem] leading-tight min-[380px]:text-[0.78rem]"
                      asChild
                    >
                      <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                        <WhatsappChatIcon />
                        {t(copy.whatsappDirect)}
                      </a>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/60 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto mb-12 grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="type-caption mb-4">{t({ es: "Estrategia Orlando", en: "Orlando strategy" })}</p>
              <h2 className="type-h2 mb-5">{t(copy.orlandoTitle)}</h2>
              <p className="type-body mb-5">{t(copy.orlandoMain)}</p>
              <p className="type-body-sm text-foreground/80">{t(copy.orlandoComplement)}</p>
            </div>
            <div className="rounded-[32px] border border-border/70 bg-background/90 p-7 shadow-[0_24px_80px_-58px_rgba(26,31,46,0.45)]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BarChart3 size={22} />
              </div>
              <p className="type-body">{t(copy.orlandoIntro)}</p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button variant="hero" asChild>
                  <Link to={`${getLocalizedPath("contact", language)}#contact-form-view`}>
                    {t(copy.primaryCta)}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-7">
            {orlandoZones.map((zoneItem) => {
              const Icon = zoneItem.icon;

              return (
                <article key={zoneItem.value} className="group grid overflow-hidden rounded-[32px] border border-border/70 bg-background shadow-[0_20px_80px_-58px_rgba(26,31,46,0.45)] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
                  <div className="relative min-w-0 bg-gradient-to-br from-primary/12 via-gold-light/70 to-background p-8">
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-background text-primary shadow-sm ring-1 ring-border/80">
                      <Icon size={24} />
                    </div>
                    <p className="type-caption mb-3">{t({ es: "Mercado de Orlando", en: "Orlando market" })}</p>
                    <h3 className="mb-4 font-serif text-4xl font-medium tracking-[-0.035em]">{t(zoneItem.title)}</h3>
                    <p className="type-body-sm text-foreground/78">{t(zoneItem.subtitle)}</p>
                    <div className={`relative mt-8 h-56 overflow-hidden rounded-[24px] border border-white/50 bg-gradient-to-br ${zoneItem.accent} shadow-[0_18px_50px_-34px_rgba(26,31,46,0.55)]`}>
                      <img
                        src={zoneItem.image}
                        alt={t(zoneItem.imageAlt)}
                        className="absolute inset-0 h-full w-full object-cover opacity-78 mix-blend-overlay transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-foreground/16 via-transparent to-primary/30" />
                      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(135deg,rgba(255,255,255,.45)_0_1px,transparent_1px_18px)]" />
                      <div className="absolute bottom-5 left-5 rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur">
                        Orlando
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 p-7 lg:p-9">
                    <p className="type-body-sm mb-6 text-foreground/82">{t(zoneItem.body)}</p>
                    <div className="mb-6 grid gap-3 sm:grid-cols-2">
                      {zoneItem.highlights.map((highlight) => (
                        <div key={t(highlight)} className="flex gap-3 rounded-2xl bg-muted/60 p-4">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <p className="text-sm leading-6 text-muted-foreground">{t(highlight)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mb-6 rounded-2xl border border-border/80 bg-card/70 p-5">
                      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">Micro-zonas / comunidades</p>
                      <p className="type-body-sm text-foreground/80">{t(zoneItem.microZones)}</p>
                    </div>
                    <blockquote className="mb-7 border-l-2 border-primary pl-5 font-serif text-xl leading-relaxed text-foreground">
                      {t(zoneItem.quote)}
                    </blockquote>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button type="button" variant="hero" onClick={() => openForm(zoneItem.value)}>
                        {t(zoneItem.cta)}
                      </Button>
                      <Button variant="outline" className="group" asChild>
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                          <WhatsappChatIcon />
                          {t(copy.whatsappDirect)}
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-[36px] border border-border/70 bg-card p-8 text-center shadow-[0_24px_90px_-60px_rgba(26,31,46,0.55)] md:p-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck size={24} />
            </div>
            <h2 className="type-h2 mb-5">{t(copy.finalTitle)}</h2>
            <p className="type-body mx-auto mb-8 max-w-2xl">{t(copy.finalText)}</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="hero" size="lg" asChild>
                <Link to={`${getLocalizedPath("contact", language)}#contact-form-view`}>
                  {t(copy.primaryCta)}
                </Link>
              </Button>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-6 text-muted-foreground">{t(copy.legal)}</p>
        </div>
      </section>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[92svh] overflow-y-auto border-border/80 bg-background sm:max-w-2xl">
          <DialogHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles size={20} />
            </div>
            <DialogTitle className="font-serif text-3xl tracking-[-0.03em]">{t(copy.formTitle)}</DialogTitle>
            <DialogDescription className="type-body-sm">{t(copy.formDesc)}</DialogDescription>
          </DialogHeader>

          <LeadCaptureForm
            idPrefix="invest"
            className="mt-2 space-y-5"
            showInterestField={false}
            showMessageField={false}
            defaultInterest="other"
            submitLabel={t(copy.submit)}
            sendingLabel={t(copy.sending)}
            validateExtra={validateInvestmentFields}
            getLeadInterest={getInvestmentInterest}
            getLeadMessage={({ baseMessage }) => getInvestmentMessage(baseMessage)}
            onSuccess={handleInvestmentSuccess}
            extraFields={(
              <>
                <div>
                  <label htmlFor="invest-zone" className="type-body-sm mb-2 block font-medium text-foreground">
                    {labels.zone} *
                  </label>
                  <Select value={zone} onValueChange={(value) => { setZone(value as ZoneValue); clearInvestmentError("zone"); }}>
                    <SelectTrigger id="invest-zone" aria-invalid={Boolean(investmentErrors.zone)}>
                      <SelectValue placeholder={labels.zone} />
                    </SelectTrigger>
                    <SelectContent>
                      {zoneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {investmentErrors.zone && <p className="mt-2 text-sm text-destructive">{investmentErrors.zone}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="invest-objective" className="type-body-sm mb-2 block font-medium text-foreground">
                      {labels.objective} *
                    </label>
                    <Select value={objective} onValueChange={(value) => { setObjective(value as ObjectiveValue); clearInvestmentError("objective"); }}>
                      <SelectTrigger id="invest-objective" aria-invalid={Boolean(investmentErrors.objective)}>
                        <SelectValue placeholder={labels.objective} />
                      </SelectTrigger>
                      <SelectContent>
                        {objectiveOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(option.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {investmentErrors.objective && <p className="mt-2 text-sm text-destructive">{investmentErrors.objective}</p>}
                  </div>
                  <div>
                    <label htmlFor="invest-budget" className="type-body-sm mb-2 block font-medium text-foreground">
                      {labels.budget} *
                    </label>
                    <Select value={budget} onValueChange={(value) => { setBudget(value as BudgetValue); clearInvestmentError("budget"); }}>
                      <SelectTrigger id="invest-budget" aria-invalid={Boolean(investmentErrors.budget)}>
                        <SelectValue placeholder={labels.budget} />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(option.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {investmentErrors.budget && <p className="mt-2 text-sm text-destructive">{investmentErrors.budget}</p>}
                  </div>
                </div>
              </>
            )}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default InvestPage;
