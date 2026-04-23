import { useMemo, useState } from "react";
import { BadgeDollarSign, Building2, FileSearch, Landmark } from "lucide-react";

import guideBuyerIa from "@/assets/guide-buyer-ia.webp";
import guideFinancingIa from "@/assets/guide-financing-ia.webp";
import guideInvestorIa from "@/assets/guide-investor-ia.webp";
import guidePreconstructionIa from "@/assets/guide-preconstruction-ia.webp";
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
    titleLead: {
      es: "Guía para",
      en: "Guide for",
    },
    displayTitle: {
      es: "Inversionistas\nInternacionales",
      en: "International\nInvestors",
    },
    cardClassName: "bg-[linear-gradient(180deg,#1A1F2E_0%,#171C29_58%,#141926_100%)]",
    iconClassName: "text-[#9B6B8A]",
    backgroundImage: guideInvestorIa,
    backgroundImageClassName: "bg-center opacity-42",
  },
  preconstruction: {
    Icon: Building2,
    titleLead: {
      es: "Guía de",
      en: "Guide to",
    },
    displayTitle: {
      es: "Preconstrucción\nen Florida",
      en: "Pre-Construction\nin Florida",
    },
    cardClassName: "bg-[linear-gradient(180deg,#2A7B88_0%,#256E79_54%,#205F69_100%)]",
    iconClassName: "text-[#F2EDE8]",
    backgroundImage: guidePreconstructionIa,
    backgroundImageClassName: "bg-center opacity-46",
  },
  financing: {
    Icon: BadgeDollarSign,
    titleLead: {
      es: "Guía de",
      en: "Guide to",
    },
    displayTitle: {
      es: "Financiamiento\nInteligente",
      en: "Smart\nFinancing",
    },
    isLight: true,
    cardClassName: "bg-[linear-gradient(180deg,#F2EDE8_0%,#ECE4DD_55%,#E4D8D2_100%)]",
    iconClassName: "text-[#2A7B88]",
    backgroundImage: guideFinancingIa,
    backgroundImageClassName: "bg-center opacity-34",
  },
  buyer: {
    Icon: FileSearch,
    titleLead: {
      es: "Guía del",
      en: "Guide for the",
    },
    displayTitle: {
      es: "Comprador\nEstratégico",
      en: "Strategic\nBuyer",
    },
    cardClassName: "bg-[linear-gradient(180deg,#1A1F2E_0%,#171C29_55%,#141926_100%)]",
    iconClassName: "text-[#9B6B8A]",
    backgroundImage: guideBuyerIa,
    backgroundImageClassName: "bg-center opacity-44",
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
      <section className="relative isolate overflow-hidden bg-[#F2EDE8]">
        <div className="absolute inset-0">
          <img
            src={guidesHeroMiami}
            alt=""
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,31,46,0.46)_0%,rgba(26,31,46,0.24)_20%,rgba(242,237,232,0.38)_58%,rgba(242,237,232,0.68)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,107,138,0.18),transparent_22%),radial-gradient(circle_at_left_center,rgba(42,123,136,0.12),transparent_24%)]" />
          <div className="absolute inset-y-0 left-0 w-[64%] bg-[linear-gradient(90deg,rgba(242,237,232,0.9)_0%,rgba(242,237,232,0.76)_38%,rgba(242,237,232,0.36)_72%,transparent_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(242,237,232,0)_0%,rgba(242,237,232,0.72)_100%)]" />
        </div>

        <div className="container relative mx-auto px-4 py-24 lg:px-8 lg:py-28">
          <div className="max-w-[820px]">
            <AnimatedSection as="div">
              <div className="inline-block rounded-[32px] border border-white/40 bg-[linear-gradient(180deg,rgba(242,237,232,0.64)_0%,rgba(242,237,232,0.4)_100%)] px-6 py-6 shadow-[0_24px_70px_rgba(26,31,46,0.12)] backdrop-blur-[4px] md:px-8 md:py-7">
                <div className="mb-5 h-px w-24 bg-[linear-gradient(90deg,rgba(155,107,138,0.95)_0%,rgba(155,107,138,0.18)_100%)]" />
                <h1 className="font-serif text-[2.45rem] leading-[0.96] tracking-[-0.04em] text-[#1A1F2E] md:text-[3.8rem] lg:text-[4.6rem]">
                  {t(g.title)}
                </h1>
                <p className="mt-6 max-w-[560px] text-[1.02rem] leading-[1.8] text-[#1A1F2E]/82 md:text-[1.1rem]">
                  {t(g.subtitle)}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection as="div" delay={90} className="mt-12 max-w-[760px] rounded-[34px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(242,237,232,0.58)_100%)] p-8 shadow-[0_30px_90px_rgba(26,31,46,0.12)] backdrop-blur-xl md:p-10">
              <div className="mb-5 h-px w-20 bg-[linear-gradient(90deg,rgba(155,107,138,0.9)_0%,rgba(155,107,138,0.18)_100%)]" />
              <h2 className="font-serif text-[1.95rem] leading-[1.02] tracking-[-0.035em] text-[#1A1F2E] md:text-[2.55rem]">
                {t(g.helpTitle)}
              </h2>
              <p className="mt-5 max-w-[58ch] text-[0.98rem] leading-8 text-[#1A1F2E]/76 md:text-[1.05rem]">
                {t(g.helpBody)}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-[#F2EDE8] py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto grid max-w-[1080px] gap-7 lg:grid-cols-2">
            {guideOrder.map((guideKey, index) => {
              const guide = g.guides[guideKey];
              const visual = guideVisuals[guideKey];
              const displayTitle = visual.displayTitle[language].split("\n").map((line, lineIndex, lines) => (
                <span key={`${guideKey}-line-${lineIndex}`}>
                  {line}
                  {lineIndex < lines.length - 1 ? <br /> : null}
                </span>
              ));

              return (
                <AnimatedSection as="div" key={guideKey} delay={index * 90}>
                  <GuideCard
                    titleLead={visual.titleLead[language]}
                    title={t(guide.title)}
                    displayTitle={displayTitle}
                    description={t(guide.description)}
                    bullets={guide.bullets[language]}
                    Icon={visual.Icon}
                    isLight={"isLight" in visual ? visual.isLight : false}
                    cardClassName={visual.cardClassName}
                    iconClassName={visual.iconClassName}
                    backgroundImage={"backgroundImage" in visual ? visual.backgroundImage : undefined}
                    backgroundImageClassName={
                      "backgroundImageClassName" in visual ? visual.backgroundImageClassName : undefined
                    }
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








