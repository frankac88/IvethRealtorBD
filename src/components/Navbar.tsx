import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import logoIvethColl from "@/assets/logo-iveth-coll.png";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { navTranslations } from "@/i18n/translations/nav";

const navLinks = [
  { key: "home" as const, href: "/" },
  { key: "about" as const, href: "/sobre-iveth" },
  { key: "team" as const, href: "/equipo" },
  { key: "projects" as const, href: "/proyectos" },
  { key: "invest" as const, href: "/invertir-en-florida" },
  { key: "financing" as const, href: "/financiamiento" },
  { key: "testimonials" as const, href: "/testimonios" },
  { key: "contact" as const, href: "/contacto" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const t = useT();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 overflow-visible">
          <Link to="/" className="flex items-center h-full">
            <img
              src={logoIvethColl}
              alt="Iveth Coll - International Real Estate Advisor"
              className="h-28 w-auto max-h-20 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-xs tracking-widest uppercase transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {t(navTranslations[link.key])}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-xs tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors ml-1"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              {language === "es" ? "EN" : "ES"}
            </button>
            <Button size="sm" variant="hero" className="ml-2" asChild>
              <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">
                {t(navTranslations.cta)}
              </a>
            </Button>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-xs tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              {language === "es" ? "EN" : "ES"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden pb-6 animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm tracking-widest uppercase py-2 transition-colors hover:text-primary ${
                    location.pathname === link.href
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {t(navTranslations[link.key])}
                </Link>
              ))}
              <Button variant="hero" className="mt-2" asChild>
                <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">
                  {t(navTranslations.ctaMobile)}
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
