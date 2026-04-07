import { useState } from "react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLeadMutation } from "@/features/leads/hooks";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useT } from "@/i18n/LanguageContext";
import { contactTranslations } from "@/i18n/translations/contact";

const VALID_INTERESTS = new Set(["precon", "miami", "orlando", "financing", "other"]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;
const NAME_REGEX = /^[\p{L}\s'.-]{2,100}$/u;
const COUNTRY_REGEX = /^[\p{L}\s'.-]{2,60}$/u;

type FormField = "name" | "email" | "phone" | "country" | "interest";
type FormErrors = Partial<Record<FormField, string>>;

const ContactPage = () => {
  const { toast } = useToast();
  const [interest, setInterest] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const createLeadMutation = useCreateLeadMutation();
  const t = useT();
  const c = contactTranslations;

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
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(c.label)}</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t(c.title)}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t(c.subtitle)}</p>
        </div>
      </section>

      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                  <label htmlFor="contact-name" className="text-sm font-medium mb-2 block">{t(c.name)} *</label>
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
                  {errors.name && <p id="contact-name-error" className="mt-2 text-sm text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-sm font-medium mb-2 block">{t(c.email)} *</label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    maxLength={255}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    onChange={() => clearFieldError("email")}
                  />
                  {errors.email && <p id="contact-email-error" className="mt-2 text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="text-sm font-medium mb-2 block">{t(c.phone)} *</label>
                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 234 567 890"
                    required
                    maxLength={20}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                    onChange={() => clearFieldError("phone")}
                  />
                  {errors.phone && <p id="contact-phone-error" className="mt-2 text-sm text-destructive">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="contact-country" className="text-sm font-medium mb-2 block">{t(c.country)} *</label>
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
                  {errors.country && <p id="contact-country-error" className="mt-2 text-sm text-destructive">{errors.country}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="contact-interest" className="text-sm font-medium mb-2 block">{t(c.interest)} *</label>
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
                {errors.interest && <p id="contact-interest-error" className="mt-2 text-sm text-destructive">{errors.interest}</p>}
              </div>
              <div>
                <label htmlFor="contact-message" className="text-sm font-medium mb-2 block">{t(c.message)}</label>
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

            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl mb-6">{t(c.infoTitle)}</h2>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, text: siteConfig.contact.locationFull },
                    { icon: Phone, text: siteConfig.contact.phoneDisplay },
                    { icon: Mail, text: siteConfig.contact.email },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <item.icon size={18} className="text-primary" />
                      <span className="text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-muted p-8 rounded-sm">
                <h3 className="font-serif text-lg mb-3">{t(c.whatsappTitle)}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t(c.whatsappDesc)}</p>
                <Button variant="default" asChild>
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
