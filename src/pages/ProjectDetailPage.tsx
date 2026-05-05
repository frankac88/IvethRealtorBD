import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarClock, Home, KeyRound, MapPin, MessageCircle } from "lucide-react";

import AnimatedSection from "@/components/AnimatedSection";
import Layout from "@/components/Layout";
import { ProjectGalleryCarousel } from "@/components/projects/ProjectGalleryCarousel";
import { ProjectImagePlaceholder } from "@/components/projects/ProjectImagePlaceholder";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getLuxuryProjectBySlug } from "@/features/projects/luxuryPlaceholderCatalog";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";

const labels = {
  back: { es: "Volver a proyectos", en: "Back to projects" },
  heroEyebrow: { es: "Project concierge", en: "Project concierge" },
  question: {
    es: "¿Buscas invertir en una zona con alta demanda y una tesis clara?",
    en: "Are you looking to invest in an area with high demand and a clear thesis?",
  },
  summary: { es: "Resumen estratégico", en: "Strategic summary" },
  keyData: { es: "Datos clave", en: "Key data" },
  price: { es: "Precio desde", en: "Price from" },
  delivery: { es: "Entrega", en: "Delivery" },
  rental: { es: "Renta", en: "Rental" },
  units: { es: "Unidades", en: "Units" },
  formTitle: { es: "Recibe precios y disponibilidad", en: "Receive pricing and availability" },
  formBody: {
    es: "Los datos reales se compartirán después de confirmar tu perfil, presupuesto y objetivo.",
    en: "Real data will be shared after confirming your profile, budget, and goal.",
  },
  name: { es: "Nombre", en: "Name" },
  email: { es: "Email", en: "Email" },
  phone: { es: "Teléfono", en: "Phone" },
  country: { es: "País", en: "Country" },
  submit: { es: "Solicitar disponibilidad", en: "Request availability" },
  whatsapp: { es: "Más información", en: "More information" },
  notFoundTitle: { es: "Proyecto no disponible", en: "Project unavailable" },
  notFoundBody: {
    es: "Esta oportunidad aún no está publicada. Vuelve a la selección principal.",
    en: "This opportunity is not published yet. Return to the main selection.",
  },
} as const;

const keyDataIcons = [Home, CalendarClock, MessageCircle, KeyRound] as const;

const WhatsappChatIcon = ({ size = 16, tone = "green" }: { size?: number; tone?: "green" | "white" }) => (
  <MessageCircle
    size={size}
    className={tone === "white"
      ? "fill-none text-white"
      : "fill-none text-[hsl(var(--whatsapp-green))] transition-colors duration-300 group-hover:text-white"}
  />
);

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const project = getLuxuryProjectBySlug(slug);
  const t = useT();
  const { language } = useLanguage();
  const projectsPath = getLocalizedPath("projects", language);
  const contactPath = `${getLocalizedPath("contact", language)}#contact-form-view`;

  const whatsappHref = project 
    ? `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(
        t({
          es: `Hola Iveth, quiero recibir información sobre el proyecto ${project.title}.`,
          en: `Hi Iveth, I would like to receive information about the project ${project.title}.`,
        })
      )}`
    : "";

  if (!project) {
    return (
      <Layout>
        <section className="bg-background py-24">
          <div className="container mx-auto px-4 text-center lg:px-8">
            <h1 className="type-h1 text-wine">{t(labels.notFoundTitle)}</h1>
            <p className="type-body mx-auto mt-4 max-w-2xl">{t(labels.notFoundBody)}</p>
            <Button asChild className="mt-7 bg-primary text-primary-foreground hover:bg-green-light">
              <Link to={projectsPath}>{t(labels.back)}</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const keyData = [
    { label: labels.price, value: project.priceLabel },
    { label: labels.delivery, value: project.deliveryLabel },
    { label: labels.rental, value: project.rentalLabel },
    { label: labels.units, value: project.unitsLabel },
  ];

  return (
    <Layout>
      <section className="relative overflow-hidden bg-background py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(138,85,121,0.13),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(42,123,137,0.13),transparent_30%)]" />
        <div className="container relative mx-auto px-4 lg:px-8">
          <Link
            to={projectsPath}
            className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-wine transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t(labels.back)}
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-stretch">
            <AnimatedSection as="div" className="h-full">
              <ProjectImagePlaceholder
                label={t(project.imageHint)}
                tone="teal"
                imageUrl={project.detailImageUrl ?? project.imageUrl}
                className="h-full min-h-[22rem] md:min-h-[31rem]"
              />
            </AnimatedSection>

            <AnimatedSection
              as="aside"
              delay={120}
              className="h-full border border-gold/30 bg-card/95 p-6 shadow-[0_24px_70px_rgba(26,31,46,0.12)] md:p-8"
            >
              <p className="type-caption text-primary">{t(labels.heroEyebrow)}</p>
              <h1 className="mt-4 font-serif text-[2.65rem] leading-[0.95] tracking-[-0.05em] text-wine md:text-[4rem]">
                {project.title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {t(project.location)}
              </p>
              <p className="mt-5 text-lg leading-8 text-foreground/78">{t(labels.question)}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {keyData.map((item, index) => {
                  const Icon = keyDataIcons[index];
                  return (
                    <div key={t(item.label)} className="border border-border/80 bg-background/70 p-4">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-foreground/50">
                        {t(item.label)}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">{t(item.value)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-l-2 border-gold pl-5">
                <p className="type-caption text-wine">{t(labels.summary)}</p>
                <p className="mt-3 text-[0.98rem] leading-7 text-foreground/75">
                  {t(project.strategicSummary)}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <ProjectGalleryCarousel project={project} />
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
          <AnimatedSection as="div">
            <p className="type-caption text-primary">{t(labels.formTitle)}</p>
            <h2 className="type-h2 mt-3 text-wine">{project.title}</h2>
            <p className="type-body mt-4 max-w-xl">{t(labels.formBody)}</p>
            <Button variant="outline" className="group mt-7" asChild>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <WhatsappChatIcon />
                {t(labels.whatsapp)}
              </a>
            </Button>
          </AnimatedSection>

          <AnimatedSection
            as="form"
            delay={120}
            onSubmit={(event) => event.preventDefault()}
            className="border border-gold/30 bg-card/95 p-5 shadow-[0_24px_70px_rgba(26,31,46,0.10)] md:p-7"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[labels.name, labels.email, labels.phone, labels.country].map((label) => (
                <label key={t(label)} className="block">
                  <span className="mb-2 block text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-foreground/55">
                    {t(label)}
                  </span>
                  <input
                    className="h-12 w-full border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    type={label === labels.email ? "email" : "text"}
                  />
                </label>
              ))}
            </div>
            <Button type="submit" className="mt-5 w-full bg-primary text-primary-foreground hover:bg-green-light">
              {t(labels.submit)}
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetailPage;
