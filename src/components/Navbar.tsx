import { useEffect, useState } from "react";
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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

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
        <div className="flex h-40 items-center justify-between gap-2 md:h-44 lg:grid lg:grid-cols-[240px_minmax(0,1fr)_auto] lg:items-center lg:gap-2 min-[1180px]:grid-cols-[260px_minmax(0,1fr)_auto] min-[1280px]:grid-cols-[280px_minmax(0,1fr)_auto] min-[1280px]:gap-4 min-[1440px]:grid-cols-[300px_minmax(0,1fr)_auto] min-[1440px]:gap-6 min-[1600px]:grid-cols-[380px_minmax(0,1fr)_auto] min-[1600px]:gap-8">
          <Link
            to={getLocalizedPath("home", language)}
            className="group relative flex h-full w-[148px] shrink-0 items-center overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5 min-[380px]:w-[168px] sm:w-[190px] md:w-[260px] lg:w-[240px] min-[1180px]:w-[260px] min-[1280px]:w-[280px] min-[1440px]:w-[300px] min-[1600px]:w-[380px]"
            aria-label="Home"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-500 ease-out"
            />
            <img
              src={brandAssets.headerLogo}
              alt="Iveth Coll"
              className="relative block h-48 max-h-none w-auto max-w-none -translate-x-8 object-contain object-center saturate-[1.02] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] min-[1080px]:h-60 min-[1080px]:-translate-x-12 group-hover:-translate-y-1 group-hover:rotate-[-1.5deg] group-hover:brightness-110 group-hover:saturate-[1.15] group-hover:drop-shadow-[0_18px_30px_rgba(42,123,136,0.30)] group-focus-visible:-translate-y-1 group-focus-visible:rotate-[-1.5deg] group-focus-visible:brightness-110 group-focus-visible:saturate-[1.15] group-focus-visible:drop-shadow-[0_18px_30px_rgba(42,123,136,0.30)]"
            />
          </Link>

          <div
            className={`hidden min-w-0 items-center justify-end lg:flex lg:pl-1 min-[1280px]:pl-4 min-[1440px]:pl-6 min-[1600px]:translate-x-32 ${
              language === "es" ? "min-[1600px]:pl-8" : "min-[1600px]:pl-8"
            }`}
          >
            <div className="flex min-w-0 items-center justify-end gap-2.5 min-[1180px]:gap-3 min-[1280px]:gap-2.5 min-[1440px]:gap-3 min-[1600px]:gap-3">
              {navLinks.map((link) => {
                const href = getLocalizedPath(link.routeKey, language);

                return (
                  <Link
                    key={link.routeKey}
                    to={href}
                    className={`type-nav whitespace-nowrap rounded-full px-1 py-1.5 text-[0.58rem] tracking-[0.08em] transition-colors hover:bg-primary/6 hover:text-primary focus-visible:bg-primary/6 focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[1180px]:text-[0.62rem] min-[1280px]:px-1.5 min-[1280px]:text-[0.7rem] min-[1440px]:text-[0.76rem] min-[1600px]:px-2.5 min-[1600px]:text-[0.8rem] ${
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
            className={`hidden shrink-0 items-center gap-1.5 lg:flex lg:ml-1 min-[1280px]:ml-3 min-[1440px]:ml-5 min-[1600px]:translate-x-32 ${
              language === "es"
                ? "min-[1600px]:ml-4 min-[1600px]:gap-1"
                : "min-[1600px]:ml-4 min-[1600px]:gap-1"
            }`}
          >
            <button
              onClick={handleToggleLanguage}
              className="type-nav flex w-11 shrink-0 items-center justify-center gap-1 text-[0.62rem] text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[1180px]:w-12 min-[1280px]:w-14 min-[1280px]:text-[0.7rem] min-[1440px]:w-[4.25rem] min-[1600px]:w-[4.5rem]"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              {language.toUpperCase()}
            </button>
            <Button
              size="sm"
              variant="hero"
              className="w-[6.5rem] shrink-0 justify-center px-2 text-[0.6rem] tracking-[0.06em] min-[1180px]:w-[7.25rem] min-[1180px]:text-[0.66rem] min-[1280px]:w-[8.25rem] min-[1280px]:text-[0.72rem] min-[1440px]:w-[9.25rem] min-[1440px]:px-3 min-[1440px]:text-[0.76rem] min-[1600px]:w-[10.25rem] min-[1600px]:px-5 min-[1600px]:text-[0.8rem]"
              asChild
            >
              <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">
                {t(navTranslations.cta)}
              </a>
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
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
          className={`overflow-hidden transition-[max-height,opacity,padding] duration-300 ease-out lg:hidden ${
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
