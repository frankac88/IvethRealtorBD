import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useT } from "@/i18n/LanguageContext";

const whatsappButtonTranslations = {
  label: { es: "Habla con Iveth", en: "Talk to Iveth" },
  ariaLabel: {
    es: "Habla con Iveth por WhatsApp",
    en: "Chat with Iveth on WhatsApp",
  },
  message: {
    es: "Hola Iveth, quiero conocer oportunidades para invertir en Miami. \u00bfPodemos conversar?",
    en: "Hi Iveth, I'd like to learn about investment opportunities in Miami. Can we chat?",
  },
} as const;

const WhatsAppButton = () => {
  const t = useT();
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(
    t(whatsappButtonTranslations.message),
  )}`;

  return (
    <div className="pointer-events-none fixed bottom-6 left-0 z-50 flex w-[100dvw] max-w-[100dvw] justify-end px-6">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-[hsl(var(--whatsapp-green))] px-5 py-3 text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        aria-label={t(whatsappButtonTranslations.ariaLabel)}
      >
        <MessageCircle size={22} />
        <span className="hidden text-sm font-medium sm:inline">{t(whatsappButtonTranslations.label)}</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
