import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brandAssets } from "@/config/brandAssets";
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
  { key: "guides" as const, routeKey: "guides" as LocalizedRouteKey },
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
    <nav className="fixed top-0 left-0 z-50 w-[100dvw] max-w-[100dvw] border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-40 items-center justify-between gap-2 md:h-44 xl:grid xl:grid-cols-[280px_minmax(0,1fr)_auto] xl:items-center xl:gap-8 2xl:grid-cols-[380px_minmax(0,1fr)_auto] 2xl:items-center 2xl:gap-10">
          <Link
            to={getLocalizedPath("home", language)}
            className="group relative flex h-full w-[148px] shrink-0 items-center overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5 min-[380px]:w-[168px] sm:w-[190px] md:w-[260px] xl:w-[220px] 2xl:w-[340px]"
            aria-label="Home"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-1/2 h-10 -translate-y-1/2 rounded-full bg-primary/10 opacity-0 blur-xl transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
            />
            <img
              src={brandAssets.headerLogo}
              alt="Iveth Coll"
              className="relative block h-[72%] max-h-full w-auto max-w-full origin-left object-left object-contain transition duration-300 ease-out xl:-translate-x-10 xl:scale-[1.3] 2xl:-translate-x-6 2xl:scale-[1.7] group-hover:drop-shadow-[0_10px_18px_rgba(42,123,136,0.22)] group-focus-visible:drop-shadow-[0_10px_18px_rgba(42,123,136,0.22)] xl:group-hover:scale-[1.34] xl:group-focus-visible:scale-[1.34] 2xl:group-hover:scale-[1.74] 2xl:group-focus-visible:scale-[1.74]"
            />
          </Link>

          <div
            className={`hidden min-w-0 items-center justify-end xl:flex xl:translate-x-10 xl:pl-8 ${
              language === "es" ? "2xl:translate-x-44 2xl:pl-32" : "2xl:translate-x-44 2xl:pl-32"
            }`}
          >
            <div className="flex min-w-0 items-center justify-end gap-1 xl:gap-1 2xl:gap-3">
              {navLinks.map((link) => {
                const href = getLocalizedPath(link.routeKey, language);

                return (
                  <Link
                    key={link.routeKey}
                    to={href}
                    className={`type-nav whitespace-nowrap rounded-full px-1.5 py-1.5 text-[0.76rem] transition-colors hover:bg-primary/6 hover:text-primary focus-visible:bg-primary/6 focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background 2xl:px-2.5 2xl:text-[0.8rem] ${
                      activeRouteKey === link.routeKey
                        ? "bg-primary/20 font-semibold text-primary shadow-[0_6px_16px_rgba(42,123,136,0.18)]"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t(navTranslations[link.key])}
                  </Link>
                );
              })}
            </div>
          </div>

          <div
            className={`hidden shrink-0 items-center gap-2 xl:flex xl:ml-8 xl:translate-x-10 ${
              language === "es"
                ? "2xl:ml-4 2xl:translate-x-40 2xl:gap-1"
                : "2xl:ml-4 2xl:translate-x-40 2xl:gap-1"
            }`}
          >
            <button
              onClick={handleToggleLanguage}
              className="type-nav flex w-[4.25rem] shrink-0 items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background 2xl:w-[4.5rem]"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              {language.toUpperCase()}
            </button>
            <Button
              size="sm"
              variant="hero"
              className="w-[9.25rem] shrink-0 justify-center px-3 text-[0.76rem] tracking-[0.08em] 2xl:w-[10.25rem] 2xl:px-5 2xl:text-[0.8rem]"
              asChild
            >
              <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">
                {t(navTranslations.cta)}
              </a>
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 xl:hidden">
            <button
              onClick={handleToggleLanguage}
              className="flex items-center gap-1 text-xs tracking-wider uppercase text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              <span className="hidden min-[360px]:inline">{language.toUpperCase()}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isOpen ? "bg-primary/10 text-primary" : "bg-transparent"
              }`}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              <span className="relative block h-6 w-6">
                <Menu
                  size={24}
                  className={`absolute inset-0 transition-all duration-300 ease-out ${
                    isOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
                  }`}
                />
                <X
                  size={24}
                  className={`absolute inset-0 transition-all duration-300 ease-out ${
                    isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={`overflow-hidden transition-[max-height,opacity,padding] duration-300 ease-out xl:hidden ${
            isOpen ? "max-h-[800px] pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"
          }`}
          aria-hidden={!isOpen}
        >
          <div
            className={`flex flex-col gap-3 border-t border-border/60 pt-4 transition-transform duration-300 ease-out ${
              isOpen ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.routeKey}
                to={getLocalizedPath(link.routeKey, language)}
                onClick={() => setIsOpen(false)}
                className={`rounded-full px-3 py-2 text-sm tracking-widest uppercase transition-all hover:bg-primary/6 hover:text-primary ${
                  activeRouteKey === link.routeKey
                    ? "bg-primary/20 font-semibold text-primary shadow-[0_6px_16px_rgba(42,123,136,0.18)]"
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
      </div>
    </nav>
  );
};

export default Navbar;
