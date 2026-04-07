import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

const WhatsAppButton = () => {
  return (
    <a
      href={siteConfig.whatsapp.hrefWithMessage}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-light text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
