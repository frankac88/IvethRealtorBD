import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLeadMutation } from "@/features/leads/hooks";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/i18n/LanguageContext";
import { contactTranslations } from "@/i18n/translations/contact";

export type LeadInterest = "precon" | "miami" | "orlando" | "financing" | "other";

type FormField = "name" | "email" | "phone" | "country" | "interest";
type FormErrors = Partial<Record<FormField, string>>;
type InterestOption = { value: LeadInterest; label: { es: string; en: string } };

interface LeadCaptureFormContext {
  form: HTMLFormElement;
  baseMessage: string | null;
  selectedInterest: LeadInterest | "";
}

interface LeadCaptureFormProps {
  idPrefix?: string;
  title?: string;
  className?: string;
  submitLabel?: string;
  sendingLabel?: string;
  interestOptions?: InterestOption[];
  showInterestField?: boolean;
  defaultInterest?: LeadInterest;
  messageLabel?: string;
  messagePlaceholder?: string;
  showMessageField?: boolean;
  extraFields?: ReactNode;
  validateExtra?: () => string | null;
  getLeadInterest?: (context: LeadCaptureFormContext) => LeadInterest;
  getLeadMessage?: (context: LeadCaptureFormContext) => string | null;
  onSuccess?: (context: LeadCaptureFormContext) => void;
}

const VALID_INTERESTS = new Set<LeadInterest>(["precon", "miami", "orlando", "financing", "other"]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;
const NAME_REGEX = /^[\p{L}\s'.-]{2,100}$/u;
const COUNTRY_REGEX = /^[\p{L}\s'.-]{2,60}$/u;

const defaultInterestOptions: InterestOption[] = [
  { value: "precon", label: contactTranslations.interestOptions.precon },
  { value: "miami", label: contactTranslations.interestOptions.miami },
  { value: "orlando", label: contactTranslations.interestOptions.orlando },
  { value: "financing", label: contactTranslations.interestOptions.financing },
  { value: "other", label: contactTranslations.interestOptions.other },
];

const LeadCaptureForm = ({
  idPrefix = "contact",
  title,
  className = "space-y-6",
  submitLabel,
  sendingLabel,
  interestOptions = defaultInterestOptions,
  showInterestField = true,
  defaultInterest,
  messageLabel,
  messagePlaceholder,
  showMessageField = true,
  extraFields,
  validateExtra,
  getLeadInterest,
  getLeadMessage,
  onSuccess,
}: LeadCaptureFormProps) => {
  const { toast } = useToast();
  const [interest, setInterest] = useState<LeadInterest | "">(defaultInterest ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const createLeadMutation = useCreateLeadMutation();
  const t = useT();
  const c = contactTranslations;

  useEffect(() => {
    setInterest(defaultInterest ?? "");
  }, [defaultInterest]);

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
    const form = e.currentTarget;
    const formData = new FormData(form);
    const baseMessage = (formData.get("message") as string)?.trim() || null;
    const context: LeadCaptureFormContext = {
      form,
      baseMessage,
      selectedInterest: interest,
    };

    const leadInterest = getLeadInterest?.(context) ?? interest;
    const leadData = {
      name: (formData.get("name") as string).trim(),
      email: (formData.get("email") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      country: (formData.get("country") as string).trim(),
      interest: leadInterest,
      message: getLeadMessage?.(context) ?? baseMessage,
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

    const extraError = validateExtra?.();

    if (Object.keys(nextErrors).length > 0 || extraError) {
      setErrors(nextErrors);
      toast({
        title: "Error",
        description: Object.values(nextErrors)[0] ?? extraError,
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
      setInterest(defaultInterest ?? "");
      setStartedAt(Date.now());
      onSuccess?.(context);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo enviar el formulario.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {title && (
        <div>
          <h2 className="font-serif text-[2rem] leading-tight tracking-[-0.02em]">{title}</h2>
        </div>
      )}
      <div
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        <label htmlFor={`${idPrefix}-company`}>Company</label>
        <Input
          id={`${idPrefix}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${idPrefix}-name`} className="type-body-sm mb-2 block font-medium text-foreground">{t(c.name)} *</label>
          <Input
            id={`${idPrefix}-name`}
            name="name"
            placeholder={t(c.namePlaceholder)}
            required
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
            onChange={() => clearFieldError("name")}
          />
          {errors.name && <p id={`${idPrefix}-name-error`} className="type-body-sm mt-2 text-destructive">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-email`} className="type-body-sm mb-2 block font-medium text-foreground">{t(c.email)} *</label>
          <Input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            placeholder="tu@email.com..."
            required
            maxLength={255}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
            onChange={() => clearFieldError("email")}
          />
          {errors.email && <p id={`${idPrefix}-email-error`} className="type-body-sm mt-2 text-destructive">{errors.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${idPrefix}-phone`} className="type-body-sm mb-2 block font-medium text-foreground">{t(c.phone)} *</label>
          <Input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            placeholder="+1 234 567 890..."
            required
            maxLength={20}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${idPrefix}-phone-error` : undefined}
            onChange={() => clearFieldError("phone")}
          />
          {errors.phone && <p id={`${idPrefix}-phone-error`} className="type-body-sm mt-2 text-destructive">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-country`} className="type-body-sm mb-2 block font-medium text-foreground">{t(c.country)} *</label>
          <Input
            id={`${idPrefix}-country`}
            name="country"
            placeholder={t(c.countryPlaceholder)}
            required
            maxLength={60}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? `${idPrefix}-country-error` : undefined}
            onChange={() => clearFieldError("country")}
          />
          {errors.country && <p id={`${idPrefix}-country-error`} className="type-body-sm mt-2 text-destructive">{errors.country}</p>}
        </div>
      </div>
      {showInterestField && (
        <div>
          <label htmlFor={`${idPrefix}-interest`} className="type-body-sm mb-2 block font-medium text-foreground">{t(c.interest)} *</label>
          <Select
            value={interest}
            onValueChange={(value) => {
              setInterest(value as LeadInterest);
              clearFieldError("interest");
            }}
          >
            <SelectTrigger
              id={`${idPrefix}-interest`}
              aria-invalid={Boolean(errors.interest)}
              aria-describedby={errors.interest ? `${idPrefix}-interest-error` : undefined}
            >
              <SelectValue placeholder={t(c.interestPlaceholder)} />
            </SelectTrigger>
            <SelectContent>
              {interestOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{t(option.label)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.interest && <p id={`${idPrefix}-interest-error`} className="type-body-sm mt-2 text-destructive">{errors.interest}</p>}
        </div>
      )}
      {extraFields}
      {showMessageField && (
        <div>
          <label htmlFor={`${idPrefix}-message`} className="type-body-sm mb-2 block font-medium text-foreground">{messageLabel ?? t(c.message)}</label>
          <Textarea
            id={`${idPrefix}-message`}
            name="message"
            placeholder={messagePlaceholder ?? t(c.messagePlaceholder)}
            rows={5}
          />
        </div>
      )}
      <Button type="submit" variant="orquidea" size="lg" className="w-full" disabled={createLeadMutation.isPending}>
        {createLeadMutation.isPending ? (sendingLabel ?? t(c.sending)) : (submitLabel ?? t(c.send))}
      </Button>
    </form>
  );
};

export default LeadCaptureForm;
