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
        <div className="flex h-40 items-center justify-between gap-2 md:h-44 min-[1280px]:grid min-[1280px]:grid-cols-[240px_minmax(0,1fr)_auto] min-[1280px]:items-center min-[1280px]:gap-5 min-[1440px]:grid-cols-[280px_minmax(0,1fr)_auto] min-[1440px]:gap-8 2xl:grid-cols-[380px_minmax(0,1fr)_auto] 2xl:items-center 2xl:gap-10">
          <Link
            to={getLocalizedPath("home", language)}
            className="group relative flex h-full w-[148px] shrink-0 items-center overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5 min-[380px]:w-[168px] sm:w-[190px] md:w-[260px] min-[1280px]:w-[200px] min-[1440px]:w-[220px] 2xl:w-[340px]"
            aria-label="Home"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-0 blur-2xl transition-all duration-500 ease-out group-hover:h-24 group-hover:w-[92%] group-hover:opacity-100 group-hover:blur-3xl group-focus-visible:h-24 group-focus-visible:w-[92%] group-focus-visible:opacity-100 group-focus-visible:blur-3xl"
            />
            <img
              src={brandAssets.headerLogo}
              alt="Iveth Coll"
              className="relative block h-[72%] max-h-full w-auto max-w-full origin-left object-left object-contain saturate-[1.02] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] min-[1280px]:-translate-x-6 min-[1280px]:scale-[1.18] min-[1440px]:-translate-x-10 min-[1440px]:scale-[1.3] 2xl:-translate-x-6 2xl:scale-[1.7] group-hover:-translate-y-1 group-hover:rotate-[-1.5deg] group-hover:brightness-110 group-hover:saturate-[1.15] group-hover:drop-shadow-[0_18px_30px_rgba(42,123,136,0.30)] group-focus-visible:-translate-y-1 group-focus-visible:rotate-[-1.5deg] group-focus-visible:brightness-110 group-focus-visible:saturate-[1.15] group-focus-visible:drop-shadow-[0_18px_30px_rgba(42,123,136,0.30)] min-[1280px]:group-hover:scale-[1.24] min-[1280px]:group-focus-visible:scale-[1.24] min-[1440px]:group-hover:scale-[1.38] min-[1440px]:group-focus-visible:scale-[1.38] 2xl:group-hover:scale-[1.8] 2xl:group-focus-visible:scale-[1.8]"
            />
          </Link>

          <div
            className={`hidden min-w-0 items-center justify-end min-[1280px]:flex min-[1280px]:pl-6 min-[1440px]:translate-x-10 min-[1440px]:pl-8 ${
              language === "es" ? "2xl:translate-x-44 2xl:pl-32" : "2xl:translate-x-44 2xl:pl-32"
            }`}
          >
            <div className="flex min-w-0 items-center justify-end gap-1.5 min-[1440px]:gap-2 2xl:gap-3">
              {navLinks.map((link) => {
                const href = getLocalizedPath(link.routeKey, language);

                return (
                  <Link
                    key={link.routeKey}
                    to={href}
                    className={`type-nav whitespace-nowrap rounded-full px-1.5 py-1.5 text-[0.7rem] transition-colors hover:bg-primary/6 hover:text-primary focus-visible:bg-primary/6 focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[1440px]:px-1.5 min-[1440px]:text-[0.76rem] 2xl:px-2.5 2xl:text-[0.8rem] ${
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
            className={`hidden shrink-0 items-center gap-1.5 min-[1280px]:flex min-[1280px]:ml-4 min-[1440px]:ml-8 min-[1440px]:translate-x-10 ${
              language === "es"
                ? "2xl:ml-4 2xl:translate-x-40 2xl:gap-1"
                : "2xl:ml-4 2xl:translate-x-40 2xl:gap-1"
            }`}
          >
            <button
              onClick={handleToggleLanguage}
              className="type-nav flex w-14 shrink-0 items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[1440px]:w-[4.25rem] 2xl:w-[4.5rem]"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              {language.toUpperCase()}
            </button>
            <Button
              size="sm"
              variant="hero"
              className="w-[8.5rem] shrink-0 justify-center px-2.5 text-[0.72rem] tracking-[0.08em] min-[1440px]:w-[9.25rem] min-[1440px]:px-3 min-[1440px]:text-[0.76rem] 2xl:w-[10.25rem] 2xl:px-5 2xl:text-[0.8rem]"
              asChild
            >
              <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">
                {t(navTranslations.cta)}
              </a>
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 min-[1280px]:hidden">
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
          className={`overflow-hidden transition-[max-height,opacity,padding] duration-300 ease-out min-[1280px]:hidden ${
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
