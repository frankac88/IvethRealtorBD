import { useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarClock, Home, KeyRound, MapPin, MessageCircle } from "lucide-react";

import AnimatedSection from "@/components/AnimatedSection";
import Layout from "@/components/Layout";
import { ProjectGalleryCarousel } from "@/components/projects/ProjectGalleryCarousel";
import { ProjectImagePlaceholder } from "@/components/projects/ProjectImagePlaceholder";
import { Button } from "@/components/ui/button";
import { useCreateLeadMutation } from "@/features/leads/hooks";
import { luxuryPlaceholderProjects } from "@/features/projects/luxuryPlaceholderCatalog";
import { projectItemsToLuxuryProjects } from "@/features/projects/luxuryProjectAdapter";
import { usePublishedProjectsQuery } from "@/features/projects/hooks";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { contactTranslations } from "@/i18n/translations/contact";

const labels = {
  back: { es: "Volver a proyectos", en: "Back to projects" },
  heroEyebrow: { es: "Project concierge", en: "Project concierge" },
  question: {
    es: "¿Buscas invertir en una zona con alta demanda y una tesis clara?",
    en: "Are you looking to invest in an area with high demand and a clear thesis?",
  },
  summary: { es: "Visión y potencial", en: "Vision and potential" },
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
  notFoundTitle: { es: "Proyecto no disponible", en: "Project unavailable" },
  notFoundBody: {
    es: "Esta oportunidad aún no está publicada. Vuelve a la selección principal.",
    en: "This opportunity is not published yet. Return to the main selection.",
  },
} as const;

const keyDataIcons = [Home, CalendarClock, MessageCircle, KeyRound] as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;
const NAME_REGEX = /^[\p{L}\s'.-]{2,100}$/u;
const COUNTRY_REGEX = /^[\p{L}\s'.-]{2,60}$/u;

type AvailabilityField = "name" | "email" | "phone" | "country";
type AvailabilityFormErrors = Partial<Record<AvailabilityField, string>>;

const availabilityFields: {
  name: AvailabilityField;
  label: typeof labels.name | typeof labels.email | typeof labels.phone | typeof labels.country;
  type: "text" | "email" | "tel";
  maxLength: number;
}[] = [
  { name: "name", label: labels.name, type: "text", maxLength: 100 },
  { name: "email", label: labels.email, type: "email", maxLength: 255 },
  { name: "phone", label: labels.phone, type: "tel", maxLength: 20 },
  { name: "country", label: labels.country, type: "text", maxLength: 60 },
];

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { data: publishedProjects = [], isLoading: isLoadingProjects } = usePublishedProjectsQuery();
  const catalogProjects = useMemo(() => {
    const supabaseProjects = projectItemsToLuxuryProjects(publishedProjects);
    return supabaseProjects.length > 0 ? supabaseProjects : luxuryPlaceholderProjects;
  }, [publishedProjects]);
  const project = catalogProjects.find((item) => item.slug === slug) ?? null;
  const t = useT();
  const { language } = useLanguage();
  const { toast } = useToast();
  const createLeadMutation = useCreateLeadMutation();
  const [availabilityErrors, setAvailabilityErrors] = useState<AvailabilityFormErrors>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const projectsPath = getLocalizedPath("projects", language);
  const c = contactTranslations;

  const clearAvailabilityError = (field: AvailabilityField) => {
    setAvailabilityErrors((prev) => {
      if (!prev[field]) return prev;

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  if (!project && isLoadingProjects) {
    return (
      <Layout>
        <section className="bg-background py-24">
          <div className="container mx-auto px-4 text-center lg:px-8">
            <p className="type-caption text-primary">{t({ es: "Cargando proyecto", en: "Loading project" })}</p>
          </div>
        </section>
      </Layout>
    );
  }

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

  const handleAvailabilitySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const leadData = {
      name: (formData.get("name") as string).trim(),
      email: (formData.get("email") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      country: (formData.get("country") as string).trim(),
      interest: project.city,
      message: `Solicitud de disponibilidad para el proyecto: ${project.title}`,
      honeypot: ((formData.get("company") as string) ?? "").trim(),
      startedAt,
    };
    const nextErrors: AvailabilityFormErrors = {};

    if (!leadData.name) {
      nextErrors.name = t(c.validation.nameRequired);
    } else if (!NAME_REGEX.test(leadData.name)) {
      nextErrors.name = t(c.validation.nameInvalid);
    }

    if (!leadData.email) {
      nextErrors.email = t(c.validation.emailRequired);
    } else if (!EMAIL_REGEX.test(leadData.email)) {
      nextErrors.email = t(c.validation.emailInvalid);
    }

    if (!leadData.phone) {
      nextErrors.phone = t(c.validation.phoneRequired);
    } else if (!PHONE_REGEX.test(leadData.phone)) {
      nextErrors.phone = t(c.validation.phoneInvalid);
    }

    if (!leadData.country) {
      nextErrors.country = t(c.validation.countryRequired);
    } else if (!COUNTRY_REGEX.test(leadData.country)) {
      nextErrors.country = t(c.validation.countryInvalid);
    }

    if (Object.keys(nextErrors).length > 0) {
      setAvailabilityErrors(nextErrors);
      toast({
        title: "Error",
        description: Object.values(nextErrors)[0],
        variant: "destructive",
      });

      setTimeout(() => {
        const firstInvalidField = form.querySelector('[aria-invalid="true"]');
        if (firstInvalidField instanceof HTMLElement) {
          firstInvalidField.focus();
        }
      }, 0);

      return;
    }

    setAvailabilityErrors({});

    try {
      await createLeadMutation.mutateAsync(leadData);
      toast({ title: t(c.toastTitle), description: t(c.toastDesc) });
      form.reset();
      setStartedAt(Date.now());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo enviar el formulario.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

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
                interactive
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

      <section className="relative overflow-hidden bg-background py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(138,85,121,0.11),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(42,123,137,0.10),transparent_28%)]" />
        <div className="absolute inset-x-0 top-8 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

        <div className="container relative mx-auto grid gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
          <AnimatedSection as="div" className="relative">
            <div className="relative border-l border-gold/45 pl-6">
              <p className="type-caption text-primary">{t(labels.formTitle)}</p>
              <h2 className="mt-4 font-serif text-[2.55rem] font-semibold leading-[0.94] tracking-[-0.055em] text-wine md:text-[3.75rem]">
                {project.title}
              </h2>
              <p className="type-body mt-5 max-w-xl text-foreground/72">{t(labels.formBody)}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection
            as="form"
            delay={120}
            onSubmit={handleAvailabilitySubmit}
            className="relative overflow-hidden rounded-[1.75rem] border border-gold/30 bg-card/80 p-5 shadow-[0_28px_90px_rgba(26,31,46,0.12)] backdrop-blur md:p-7"
            noValidate
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
            <div className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-wine/10 blur-3xl" />
            <div
              className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0 pointer-events-none"
              aria-hidden="true"
            >
              <label htmlFor="project-availability-company">Company</label>
              <input
                id="project-availability-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <div className="relative grid gap-4 sm:grid-cols-2">
              {availabilityFields.map((field) => (
                <label key={field.name} className="block" htmlFor={`project-availability-${field.name}`}>
                  <span className="mb-2 block text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-foreground/55">
                    {t(field.label)}
                  </span>
                  <input
                    id={`project-availability-${field.name}`}
                    name={field.name}
                    className="h-12 w-full rounded-sm border border-border/90 bg-background/70 px-3 text-sm outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/15"
                    type={field.type}
                    required
                    maxLength={field.maxLength}
                    aria-invalid={Boolean(availabilityErrors[field.name])}
                    aria-describedby={
                      availabilityErrors[field.name] ? `project-availability-${field.name}-error` : undefined
                    }
                    onChange={() => clearAvailabilityError(field.name)}
                  />
                  {availabilityErrors[field.name] ? (
                    <p
                      id={`project-availability-${field.name}-error`}
                      className="mt-2 text-sm leading-6 text-destructive"
                    >
                      {availabilityErrors[field.name]}
                    </p>
                  ) : null}
                </label>
              ))}
            </div>
            <Button
              type="submit"
              className="relative mt-5 h-12 w-full rounded-full bg-primary text-primary-foreground shadow-[0_16px_36px_rgba(42,123,137,0.22)] hover:bg-green-light"
              disabled={createLeadMutation.isPending}
            >
              {createLeadMutation.isPending ? t(c.sending) : t(labels.submit)}
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetailPage;
