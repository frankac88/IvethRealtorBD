import { useMemo, useState } from "react";
import { BadgeDollarSign, Building2, FileSearch, Landmark } from "lucide-react";

import guidesHeroMiami from "@/assets/guides-hero-miami.webp";
import AnimatedSection from "@/components/AnimatedSection";
import GuideCard from "@/components/guides/GuideCard";
import GuideLeadDialog, { type GuideLeadFormValues } from "@/components/guides/GuideLeadDialog";
import Layout from "@/components/Layout";
import { siteConfig } from "@/config/site";
import { useCreateLeadMutation } from "@/features/leads/hooks";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath } from "@/i18n/routes";
import { guidesTranslations } from "@/i18n/translations/guides";

const guideVisuals = {
  investor: {
    Icon: Landmark,
    cardClassName: "bg-[linear-gradient(180deg,#14384c_0%,#18384a_58%,#0f2f44_100%)]",
    iconClassName: undefined,
  },
  preconstruction: {
    Icon: Building2,
    cardClassName: "bg-[linear-gradient(180deg,#1f463d_0%,#20463d_54%,#173930_100%)]",
    iconClassName: undefined,
  },
  financing: {
    Icon: BadgeDollarSign,
    cardClassName: "bg-[linear-gradient(180deg,#e6e0d9_0%,#ddd5cb_55%,#d5ccc2_100%)] text-[#223340] border-black/5 [&_h3]:text-[#203140] [&_p]:text-[#384a56] [&_ul]:text-[#28404e]",
    iconClassName: "bg-white/40 text-[#30546a] border-[#d7b56b]/45",
  },
  buyer: {
    Icon: FileSearch,
    cardClassName: "bg-[linear-gradient(180deg,#2d2d2d_0%,#252525_55%,#1f1f1f_100%)]",
    iconClassName: undefined,
  },
} as const;

const guideOrder = ["investor", "preconstruction", "financing", "buyer"] as const;
type GuideKey = typeof guideOrder[number];

const GuidesPage = () => {
  const { language } = useLanguage();
  const t = useT();
  const g = guidesTranslations;
  const { toast } = useToast();
  const createLeadMutation = useCreateLeadMutation();
  const [activeGuideKey, setActiveGuideKey] = useState<GuideKey | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const activeGuide = activeGuideKey ? g.guides[activeGuideKey] : null;

  const consultationHref = useMemo(
    () => `${getLocalizedPath("contact", language)}#contact-form-view`,
    [language],
  );

  const openGuideDialog = (guideKey: GuideKey) => {
    setActiveGuideKey(guideKey);
    setIsSubmitted(false);
    setStartedAt(Date.now());
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);

    if (!open) {
      setIsSubmitted(false);
    }
  };

  const handleLeadSubmit = async (values: GuideLeadFormValues) => {
    if (!activeGuide) return;

    const guideTitle = t(activeGuide.title);

    try {
      await createLeadMutation.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.whatsapp || "",
        country: t(g.leadCountry),
        interest: `${t(g.leadInterestPrefix)}${guideTitle}`,
        message: `${t(g.leadMessagePrefix)}${guideTitle} | ${t(g.leadAutomationTag)}`,
        honeypot: "",
        startedAt,
      });

      setIsSubmitted(true);
    } catch (error) {
      const description = error instanceof Error ? error.message : t(g.form.fallbackErrorDescription);

      toast({
        title: t(g.form.errorTitle),
        description,
        variant: "destructive",
      });
    }
  };

  const getGuideWhatsAppHref = (guideKey: GuideKey) => {
    const guide = g.guides[guideKey];
    const message = t(guide.whatsappMessage);

    return `${siteConfig.whatsapp.href}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Layout>
      <section className="relative isolate overflow-hidden bg-[#f6efe7]">
        <div className="absolute inset-0">
          <img
            src={guidesHeroMiami}
            alt=""
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,242,234,0.92)_0%,rgba(248,242,234,0.78)_30%,rgba(248,242,234,0.94)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,176,104,0.24),transparent_24%),radial-gradient(circle_at_left_center,rgba(42,123,136,0.18),transparent_22%)]" />
        </div>

        <div className="container relative mx-auto px-4 py-20 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <AnimatedSection as="div">
              <h1 className="font-serif text-[2.8rem] leading-[0.95] tracking-[-0.04em] text-foreground md:text-[4rem] lg:text-[5rem]">
                {t(g.title)}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-foreground/78 md:text-lg">
                {t(g.subtitle)}
              </p>
            </AnimatedSection>

            <AnimatedSection as="div" delay={90} className="mt-10 max-w-3xl rounded-[32px] border border-white/75 bg-white/80 p-7 shadow-[0_24px_80px_rgba(79,61,44,0.08)] backdrop-blur-md md:p-8">
              <h2 className="font-serif text-[1.9rem] leading-[1.05] tracking-[-0.03em] text-foreground md:text-[2.4rem]">
                {t(g.helpTitle)}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                {t(g.helpBody)}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-[#f6efe7] py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {guideOrder.map((guideKey, index) => {
              const guide = g.guides[guideKey];
              const visual = guideVisuals[guideKey];

              return (
                <AnimatedSection as="div" key={guideKey} delay={index * 90}>
                  <GuideCard
                    title={t(guide.title)}
                    description={t(guide.description)}
                    bullets={guide.bullets[language]}
                    Icon={visual.Icon}
                    cardClassName={visual.cardClassName}
                    iconClassName={visual.iconClassName}
                    onDownload={() => openGuideDialog(guideKey)}
                    downloadLabel={t(g.downloadCta)}
                    whatsappLabel={t(g.whatsappCta)}
                    whatsappHref={getGuideWhatsAppHref(guideKey)}
                  />
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {activeGuide ? (
        <GuideLeadDialog
          open={isDialogOpen}
          onOpenChange={handleDialogChange}
          guideTitle={t(activeGuide.title)}
          guideDescription={t(activeGuide.description)}
          consultationHref={consultationHref}
          isSubmitting={createLeadMutation.isPending}
          isSubmitted={isSubmitted}
          onSubmit={handleLeadSubmit}
          texts={{
            modalTitle: t(g.form.modalTitle),
            modalDescription: t(g.form.modalDescription),
            nameLabel: t(g.form.nameLabel),
            emailLabel: t(g.form.emailLabel),
            whatsappLabel: t(g.form.whatsappLabel),
            submitLabel: t(g.form.submitLabel),
            submittingLabel: t(g.form.submittingLabel),
            privacyNote: t(g.form.privacyNote),
            successTitle: t(g.form.successTitle),
            successDescription: t(g.form.successDescription),
            consultationLabel: t(g.form.consultationLabel),
            closeLabel: t(g.form.closeLabel),
            errors: {
              nameRequired: t(g.form.errors.nameRequired),
              emailRequired: t(g.form.errors.emailRequired),
              emailInvalid: t(g.form.errors.emailInvalid),
              whatsappInvalid: t(g.form.errors.whatsappInvalid),
            },
          }}
        />
      ) : null}
    </Layout>
  );
};

export default GuidesPage;








