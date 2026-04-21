import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface GuideLeadFormValues {
  name: string;
  email: string;
  whatsapp: string;
}

interface GuideLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guideTitle: string;
  guideDescription: string;
  consultationHref: string;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onSubmit: (values: GuideLeadFormValues) => Promise<void>;
  texts: {
    modalTitle: string;
    modalDescription: string;
    nameLabel: string;
    emailLabel: string;
    whatsappLabel: string;
    submitLabel: string;
    submittingLabel: string;
    privacyNote: string;
    successTitle: string;
    successDescription: string;
    consultationLabel: string;
    closeLabel: string;
    errors: {
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      whatsappInvalid: string;
    };
  };
}

type GuideLeadFormErrors = Partial<Record<keyof GuideLeadFormValues, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_REGEX = /^[+()\d\s-]{7,}$/;

const GuideLeadDialog = ({
  open,
  onOpenChange,
  guideTitle,
  guideDescription,
  consultationHref,
  isSubmitting,
  isSubmitted,
  onSubmit,
  texts,
}: GuideLeadDialogProps) => {
  const [values, setValues] = useState<GuideLeadFormValues>({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [errors, setErrors] = useState<GuideLeadFormErrors>({});

  useEffect(() => {
    if (!open) return;

    setValues({
      name: "",
      email: "",
      whatsapp: "",
    });
    setErrors({});
  }, [guideTitle, open]);

  const validate = useMemo(
    () => (nextValues: GuideLeadFormValues) => {
      const nextErrors: GuideLeadFormErrors = {};

      if (!nextValues.name.trim()) {
        nextErrors.name = texts.errors.nameRequired;
      }

      if (!nextValues.email.trim()) {
        nextErrors.email = texts.errors.emailRequired;
      } else if (!EMAIL_REGEX.test(nextValues.email.trim())) {
        nextErrors.email = texts.errors.emailInvalid;
      }

      if (nextValues.whatsapp.trim() && !WHATSAPP_REGEX.test(nextValues.whatsapp.trim())) {
        nextErrors.whatsapp = texts.errors.whatsappInvalid;
      }

      return nextErrors;
    },
    [texts.errors.emailInvalid, texts.errors.emailRequired, texts.errors.nameRequired, texts.errors.whatsappInvalid],
  );

  const handleValueChange = (field: keyof GuideLeadFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      whatsapp: values.whatsapp.trim(),
    };

    const nextErrors = validate(nextValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit(nextValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-white/70 bg-[#f8f2ea] p-0 text-foreground shadow-[0_30px_90px_rgba(79,61,44,0.18)] sm:max-w-xl">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,rgba(212,176,104,0.4),transparent_58%),radial-gradient(circle_at_top_right,rgba(42,123,136,0.24),transparent_40%)]" />
          <div className="relative p-6 sm:p-8">
            {isSubmitted ? (
              <div className="space-y-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-7 w-7" />
                </div>

                <DialogHeader className="text-left">
                  <DialogTitle className="font-serif text-3xl tracking-[-0.03em]">
                    {texts.successTitle}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-6 text-muted-foreground">
                    {texts.successDescription} <span className="font-medium text-foreground">{guideTitle}</span>.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="hero" size="lg" asChild className="w-full sm:flex-1">
                    <Link to={consultationHref} onClick={() => onOpenChange(false)}>
                      {texts.consultationLabel}
                    </Link>
                  </Button>
                  <Button type="button" variant="outline" size="lg" className="w-full sm:flex-1" onClick={() => onOpenChange(false)}>
                    {texts.closeLabel}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <DialogHeader className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent">
                    {guideTitle}
                  </p>
                  <DialogTitle className="font-serif text-3xl leading-tight tracking-[-0.03em]">
                    {texts.modalTitle}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-6 text-muted-foreground">
                    {texts.modalDescription}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 rounded-[24px] border border-white/70 bg-white/80 p-4">
                  <p className="text-sm font-medium text-foreground">{guideTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{guideDescription}</p>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="guide-name">{texts.nameLabel}</Label>
                    <Input
                      id="guide-name"
                      value={values.name}
                      onChange={(event) => handleValueChange("name", event.target.value)}
                      className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
                    />
                    {errors.name ? (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guide-email">{texts.emailLabel}</Label>
                    <Input
                      id="guide-email"
                      type="email"
                      value={values.email}
                      onChange={(event) => handleValueChange("email", event.target.value)}
                      className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
                    />
                    {errors.email ? (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guide-whatsapp">{texts.whatsappLabel}</Label>
                    <Input
                      id="guide-whatsapp"
                      value={values.whatsapp}
                      onChange={(event) => handleValueChange("whatsapp", event.target.value)}
                      className={cn(errors.whatsapp && "border-destructive focus-visible:ring-destructive")}
                    />
                    {errors.whatsapp ? (
                      <p className="text-sm text-destructive">{errors.whatsapp}</p>
                    ) : null}
                  </div>

                  <p className="text-xs leading-5 text-muted-foreground">
                    {texts.privacyNote}
                  </p>

                  <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? texts.submittingLabel : texts.submitLabel}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuideLeadDialog;
