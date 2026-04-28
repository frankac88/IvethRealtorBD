import { siteConfig } from "@/config/site";
import { useT } from "@/i18n/LanguageContext";
import whatsappFloatingButton from "@/assets/whatsapp-floating.webp";

const whatsappButtonTranslations = {
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
    <div className="pointer-events-none fixed bottom-8 left-0 z-50 flex w-[100dvw] max-w-[100dvw] justify-end px-8 sm:bottom-10 sm:px-10">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-luxury-float pointer-events-auto relative block h-14 w-14 rounded-full transition-transform duration-300 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--gold))]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        aria-label={t(whatsappButtonTranslations.ariaLabel)}
      >
        <span className="relative z-10 block h-full w-full overflow-hidden rounded-full border border-white">
          <img
            src={whatsappFloatingButton}
            alt=""
            className="h-full w-full scale-[1.62] rounded-full object-cover brightness-[1.42] contrast-[0.92] saturate-[1.22] drop-shadow-[0_18px_24px_rgba(26,31,46,0.28)]"
          />
        </span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
