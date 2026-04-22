import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLeadMutation } from "@/features/leads/hooks";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useT } from "@/i18n/LanguageContext";
import { contactTranslations } from "@/i18n/translations/contact";
import { useLocation } from "react-router-dom";

const VALID_INTERESTS = new Set(["precon", "miami", "orlando", "financing", "other"]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;
const NAME_REGEX = /^[\p{L}\s'.-]{2,100}$/u;
const COUNTRY_REGEX = /^[\p{L}\s'.-]{2,60}$/u;

type FormField = "name" | "email" | "phone" | "country" | "interest";
type FormErrors = Partial<Record<FormField, string>>;

const ContactPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [interest, setInterest] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const createLeadMutation = useCreateLeadMutation();
  const t = useT();
  const c = contactTranslations;

  useEffect(() => {
    if (location.hash !== "#contact-form-view") return;

    requestAnimationFrame(() => {
      const target = document.getElementById("contact-form-view");
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - 240;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }, [location.hash]);

  const clearFieldError = (field: FormField) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const leadData = {
      name: (formData.get("name") as string).trim(),
      email: (formData.get("email") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      country: (formData.get("country") as string).trim(),
      interest: interest.trim(),
      message: (formData.get("message") as string)?.trim() || null,
      honeypot: ((formData.get("company") as string) ?? "").trim(),
      startedAt,
    };

    const nextErrors: FormErrors = {};

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

    if (!leadData.interest || !VALID_INTERESTS.has(leadData.interest)) {
      nextErrors.interest = t(c.validation.interestRequired);
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
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

    setErrors({});

    try {
      await createLeadMutation.mutateAsync(leadData);
      toast({ title: t(c.toastTitle), description: t(c.toastDesc) });
      form.reset();
      setInterest("");
      setStartedAt(Date.now());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo enviar el formulario.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  return (
    <Layout>
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="type-caption mb-4">{t(c.label)}</p>
          <h1 className="type-h1 mb-4">{t(c.title)}</h1>
          <p className="type-body mx-auto max-w-xl">{t(c.subtitle)}</p>
        </div>
      </section>

      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div id="contact-form-view" className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto scroll-mt-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <h2 className="font-serif text-[2rem] leading-tight tracking-[-0.02em]">{t(c.formTitle)}</h2>
              </div>
              <div
                className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0 pointer-events-none"
                aria-hidden="true"
              >
                <label htmlFor="contact-company">Company</label>
                <Input
                  id="contact-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="type-body-sm mb-2 block font-medium text-foreground">{t(c.name)} *</label>
                  <Input
                    id="contact-name"
                    name="name"
                    placeholder={t(c.namePlaceholder)}
                    required
                    maxLength={100}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    onChange={() => clearFieldError("name")}
                  />
                  {errors.name && <p id="contact-name-error" className="type-body-sm mt-2 text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="type-body-sm mb-2 block font-medium text-foreground">{t(c.email)} *</label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com..."
                    required
                    maxLength={255}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    onChange={() => clearFieldError("email")}
                  />
                  {errors.email && <p id="contact-email-error" className="type-body-sm mt-2 text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="type-body-sm mb-2 block font-medium text-foreground">{t(c.phone)} *</label>
                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 234 567 890..."
                    required
                    maxLength={20}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                    onChange={() => clearFieldError("phone")}
                  />
                  {errors.phone && <p id="contact-phone-error" className="type-body-sm mt-2 text-destructive">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="contact-country" className="type-body-sm mb-2 block font-medium text-foreground">{t(c.country)} *</label>
                  <Input
                    id="contact-country"
                    name="country"
                    placeholder={t(c.countryPlaceholder)}
                    required
                    maxLength={60}
                    aria-invalid={Boolean(errors.country)}
                    aria-describedby={errors.country ? "contact-country-error" : undefined}
                    onChange={() => clearFieldError("country")}
                  />
                  {errors.country && <p id="contact-country-error" className="type-body-sm mt-2 text-destructive">{errors.country}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="contact-interest" className="type-body-sm mb-2 block font-medium text-foreground">{t(c.interest)} *</label>
                <Select
                  value={interest}
                  onValueChange={(value) => {
                    setInterest(value);
                    clearFieldError("interest");
                  }}
                >
                  <SelectTrigger
                    id="contact-interest"
                    aria-invalid={Boolean(errors.interest)}
                    aria-describedby={errors.interest ? "contact-interest-error" : undefined}
                  >
                    <SelectValue placeholder={t(c.interestPlaceholder)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="precon">{t(c.interestOptions.precon)}</SelectItem>
                    <SelectItem value="miami">{t(c.interestOptions.miami)}</SelectItem>
                    <SelectItem value="orlando">{t(c.interestOptions.orlando)}</SelectItem>
                    <SelectItem value="financing">{t(c.interestOptions.financing)}</SelectItem>
                    <SelectItem value="other">{t(c.interestOptions.other)}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.interest && <p id="contact-interest-error" className="type-body-sm mt-2 text-destructive">{errors.interest}</p>}
              </div>
              <div>
                <label htmlFor="contact-message" className="type-body-sm mb-2 block font-medium text-foreground">{t(c.message)}</label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder={t(c.messagePlaceholder)}
                  rows={5}
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={createLeadMutation.isPending}>
                {createLeadMutation.isPending ? t(c.sending) : t(c.send)}
              </Button>
            </form>

            <div className="space-y-10">
              <div>
                <h2 className="mb-10 font-serif text-[2rem] leading-tight tracking-[-0.02em]">{t(c.infoTitle)}</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-primary shadow-sm">
                      <Mail size={18} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="type-body-sm leading-none tracking-[0.01em] text-muted-foreground">Email</p>
                      <a href={`mailto:${siteConfig.contact.email}`} className="type-body mt-2 block leading-snug text-foreground transition-colors hover:text-primary">
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-primary shadow-sm">
                      <Phone size={18} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="type-body-sm leading-none tracking-[0.01em] text-muted-foreground">Phone</p>
                      <a href={`tel:${siteConfig.contact.phoneHref}`} className="type-body mt-2 block leading-snug text-foreground transition-colors hover:text-primary">
                        {siteConfig.contact.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-primary shadow-sm">
                      <MapPin size={18} />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="type-body-sm leading-none tracking-[0.01em] text-muted-foreground">{t(c.locationLabel)}</p>
                      <p className="type-body mt-2 leading-snug text-foreground">
                        {siteConfig.contact.locationFull}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsLocationOpen((prev) => !prev)}
                        aria-expanded={isLocationOpen}
                        aria-controls="contact-location-map"
                        className="type-body-sm mt-3 inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                      >
                        {isLocationOpen ? t(c.locationToggleHide) : t(c.locationToggleShow)}
                      </button>

                      {isLocationOpen && (
                        <div id="contact-location-map" className="mt-5 overflow-hidden rounded-[24px] border border-border/60 bg-background shadow-[0_12px_40px_-24px_rgba(26,31,46,0.2)]">
                          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                            <a
                              href={siteConfig.contact.locationMapsHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="type-body-sm inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary/80"
                            >
                              {t(c.locationMapOpen)}
                              <ExternalLink size={14} />
                            </a>
                          </div>
                          <iframe
                            title={siteConfig.contact.locationFull}
                            src={siteConfig.contact.locationEmbedSrc}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="h-[300px] w-full border-0"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] bg-card/80 p-8 ring-1 ring-border/50">
                <h3 className="type-h3 mb-3 text-primary">{t(c.whatsappTitle)}</h3>
                <p className="type-body-sm mb-4 text-muted-foreground">{t(c.whatsappDesc)}</p>
                <Button variant="whatsapp" asChild>
                  <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">{t(c.whatsappButton)}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default ContactPage;






