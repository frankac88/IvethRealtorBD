import { Link } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { getLocalizedPath, type LocalizedRouteKey } from "@/i18n/routes";
import { footerTranslations } from "@/i18n/translations/footer";

const Footer = () => {
  const { language } = useLanguage();
  const t = useT();
  const ft = footerTranslations;

  const links = [
    { label: t(ft.navLinks.home), routeKey: "home" as LocalizedRouteKey },
    { label: t(ft.navLinks.about), routeKey: "about" as LocalizedRouteKey },
    { label: t(ft.navLinks.projects), routeKey: "projects" as LocalizedRouteKey },
    { label: t(ft.navLinks.invest), routeKey: "invest" as LocalizedRouteKey },
    { label: t(ft.navLinks.financing), routeKey: "financing" as LocalizedRouteKey },
    { label: t(ft.navLinks.guides), routeKey: "guides" as LocalizedRouteKey },
    { label: t(ft.navLinks.contact), routeKey: "contact" as LocalizedRouteKey },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-serif text-2xl uppercase">{siteConfig.brand.name}</h3>
            <p className="mb-6 text-xs uppercase tracking-[0.2em] text-primary-foreground/60">
              {t(ft.subtitle)}
            </p>
            <p className="text-sm leading-relaxed text-primary-foreground/70">{t(ft.description)}</p>
          </div>

          <div>
            <h4 className="mb-4 font-serif text-lg">{t(ft.navigation)}</h4>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.routeKey}
                  to={getLocalizedPath(link.routeKey, language)}
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-serif text-lg">{t(ft.contact)}</h4>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="transition-colors hover:text-primary-foreground"
              >
                {siteConfig.contact.email}
              </a>
              <a
                href={`tel:${siteConfig.contact.phoneHref}`}
                className="transition-colors hover:text-primary-foreground"
              >
                {siteConfig.contact.phoneDisplay}
              </a>
              <p>{siteConfig.contact.location}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-xs text-primary-foreground/40">
            {"\u00a9"} {new Date().getFullYear()} Iveth Coll {"\u2014"} International Real Estate Advisor. {t(ft.rights)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
