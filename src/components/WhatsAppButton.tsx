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
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[hsl(var(--whatsapp-green))] text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      aria-label={t(whatsappButtonTranslations.ariaLabel)}
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline text-sm font-medium">{t(whatsappButtonTranslations.label)}</span>
    </a>
  );
};

export default WhatsAppButton;
