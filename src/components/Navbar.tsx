import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import logoIvethColl from "@/assets/logo-iveth-cropped.png";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import {
  getAlternateLocalizedPath,
  getLocalizedPath,
  getRouteKeyForPath,
  type LocalizedRouteKey,
} from "@/i18n/routes";
import { navTranslations } from "@/i18n/translations/nav";

const navLinks = [
  { key: "home" as const, routeKey: "home" as LocalizedRouteKey },
  { key: "about" as const, routeKey: "about" as LocalizedRouteKey },
  { key: "team" as const, routeKey: "team" as LocalizedRouteKey },
  { key: "projects" as const, routeKey: "projects" as LocalizedRouteKey },
  { key: "invest" as const, routeKey: "invest" as LocalizedRouteKey },
  { key: "financing" as const, routeKey: "financing" as LocalizedRouteKey },
  { key: "testimonials" as const, routeKey: "testimonials" as LocalizedRouteKey },
  { key: "contact" as const, routeKey: "contact" as LocalizedRouteKey },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = useT();
  const activeRouteKey = getRouteKeyForPath(location.pathname);

  const handleToggleLanguage = () => {
    const nextLanguage = language === "es" ? "en" : "es";
    const nextPath = getAlternateLocalizedPath(location.pathname, nextLanguage) ?? location.pathname;

    setLanguage(nextLanguage);
    setIsOpen(false);
    navigate({ pathname: nextPath, search: location.search, hash: location.hash });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-32 md:h-36 overflow-visible">
          <Link
            to={getLocalizedPath("home", language)}
            className="flex items-center h-full"
          >
            <img
              src={logoIvethColl}
              alt="Iveth Coll - International Real Estate Advisor"
              className="block h-[96px] md:h-[108px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const href = getLocalizedPath(link.routeKey, language);

              return (
                <Link
                  key={link.routeKey}
                  to={href}
                  className={`text-xs tracking-widest uppercase transition-colors hover:text-primary ${
                    activeRouteKey === link.routeKey
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {t(navTranslations[link.key])}
                </Link>
              );
            })}
            <button
              onClick={handleToggleLanguage}
              className="flex items-center gap-1 text-xs tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors ml-1"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              {language.toUpperCase()}
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
              onClick={handleToggleLanguage}
              className="flex items-center gap-1 text-xs tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              {language.toUpperCase()}
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
                  key={link.routeKey}
                  to={getLocalizedPath(link.routeKey, language)}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm tracking-widest uppercase py-2 transition-colors hover:text-primary ${
                    activeRouteKey === link.routeKey
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
