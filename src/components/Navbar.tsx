import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import headerLogo from "@/assets/logo-header-iveth-coll.png";
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-26 items-center justify-between overflow-hidden md:h-32">
          <Link
            to={getLocalizedPath("home", language)}
            className="flex h-full w-[120px] items-center overflow-visible md:w-[120px]"
            aria-label="Home"
          >
            <img
              src={headerLogo}
              alt="Iveth Coll"
              className="block w-full origin-left scale-[1.55] object-contain md:scale-[1.9]"
            />
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              const href = getLocalizedPath(link.routeKey, language);

              return (
                <Link
                  key={link.routeKey}
                  to={href}
                  className={`text-xs tracking-widest uppercase transition-colors hover:text-primary ${
                    activeRouteKey === link.routeKey
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {t(navTranslations[link.key])}
                </Link>
              );
            })}
            <button
              onClick={handleToggleLanguage}
              className="ml-1 flex items-center gap-1 text-xs tracking-wider uppercase text-muted-foreground transition-colors hover:text-primary"
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

          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={handleToggleLanguage}
              className="flex items-center gap-1 text-xs tracking-wider uppercase text-muted-foreground transition-colors hover:text-primary"
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

        {isOpen && (
          <div className="animate-fade-in pb-6 lg:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.routeKey}
                  to={getLocalizedPath(link.routeKey, language)}
                  onClick={() => setIsOpen(false)}
                  className={`py-2 text-sm tracking-widest uppercase transition-colors hover:text-primary ${
                    activeRouteKey === link.routeKey
                      ? "font-semibold text-primary"
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
