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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-32 items-center justify-between md:h-40">
          <Link
            to={getLocalizedPath("home", language)}
            className="group relative flex h-full w-[220px] shrink-0 items-center overflow-visible transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5 md:w-[260px] xl:w-[290px]"
            aria-label="Home"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-1/2 h-10 -translate-y-1/2 rounded-full bg-primary/10 opacity-0 blur-xl transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
            />
            <img
              src={brandAssets.headerLogo}
              alt="Iveth Coll"
              className="relative block h-auto w-full -translate-x-[2.75rem] object-contain transition duration-300 ease-out group-hover:-translate-x-[2.75rem] group-hover:scale-[1.04] group-hover:drop-shadow-[0_10px_18px_rgba(42,123,136,0.22)] group-focus-visible:-translate-x-[2.75rem] group-focus-visible:scale-[1.04] group-focus-visible:drop-shadow-[0_10px_18px_rgba(42,123,136,0.22)] md:-translate-x-[3.25rem] md:group-hover:-translate-x-[3.25rem] md:group-focus-visible:-translate-x-[3.25rem]"
            />
          </Link>

          <div className="hidden flex-1 items-center justify-end lg:flex">
            <div className="flex items-center gap-2 xl:gap-3">
              {navLinks.map((link) => {
                const href = getLocalizedPath(link.routeKey, language);

                return (
                  <Link
                    key={link.routeKey}
                    to={href}
                    className={`type-nav whitespace-nowrap rounded-full px-2 py-1.5 transition-colors hover:bg-primary/6 hover:text-primary focus-visible:bg-primary/6 focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background xl:px-2.5 ${
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

            <div className="ml-10 flex items-center gap-3 xl:ml-12 xl:gap-4">
              <button
                onClick={handleToggleLanguage}
                className="type-nav flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Toggle language"
              >
                <Globe size={14} />
                {language.toUpperCase()}
              </button>
              <Button size="sm" variant="hero" className="px-4 text-[0.8rem] tracking-[0.08em] xl:px-5" asChild>
                <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">
                  {t(navTranslations.cta)}
                </a>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={handleToggleLanguage}
              className="flex items-center gap-1 text-xs tracking-wider uppercase text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;





