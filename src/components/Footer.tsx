import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

import equalHousingLogo from "@/assets/equal-housing-logo-light.png";
import realtorLogo from "@/assets/realtor-logo-light.png";
import { brandAssets } from "@/config/brandAssets";
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

  const socialLinks = [
    { label: "Facebook", href: siteConfig.social.facebook, icon: Facebook },
    { label: "Instagram", href: siteConfig.social.instagram, icon: Instagram },
    { label: "YouTube", href: siteConfig.social.youtube, icon: Youtube },
    { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <div className="group inline-block">
              <img
                src={brandAssets.footerLogo}
                alt="Iveth Coll logo"
                className="mb-6 h-auto w-[150px] object-contain transition duration-300 ease-out group-hover:scale-[1.04] group-hover:drop-shadow-[0_10px_18px_rgba(255,255,255,0.18)] group-focus-within:scale-[1.04] group-focus-within:drop-shadow-[0_10px_18px_rgba(255,255,255,0.18)] md:w-[205px]"
              />
            </div>
            <p className="type-body-sm mb-6 text-primary-foreground">
              {t(ft.subtitle)}
            </p>
            <p className="type-body-sm text-primary-foreground">{t(ft.description)}</p>
          </div>

          <div>
            <h4 className="type-body-sm mb-4 font-medium text-primary-foreground">{t(ft.navigation)}</h4>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.routeKey}
                  to={getLocalizedPath(link.routeKey, language)}
                  className="type-body-sm text-primary-foreground transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="type-body-sm mb-4 font-medium text-primary-foreground">{t(ft.contact)}</h4>
            <div className="flex flex-col gap-3 text-primary-foreground">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="self-start break-all transition-colors hover:text-primary-foreground"
              >
                {siteConfig.contact.email}
              </a>
              <a
                href={`tel:${siteConfig.contact.phoneHref}`}
                className="self-start transition-colors hover:text-primary-foreground"
              >
                {siteConfig.contact.phoneDisplay}
              </a>
              <p>{siteConfig.contact.location}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                {socialLinks.map((socialLink) => {
                  const Icon = socialLink.icon;

                  return (
                    <a
                      key={socialLink.label}
                      href={socialLink.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={socialLink.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/22 bg-primary-foreground/[0.03] text-primary-foreground/92 shadow-[0_10px_24px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[hsl(var(--accent))]/55 hover:bg-[hsl(var(--accent))]/10 hover:text-[hsl(var(--gold-light))] hover:shadow-[0_14px_32px_rgba(0,0,0,0.3)]"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8">
          <div className="mb-5 flex flex-wrap items-center justify-center gap-5">
            <img
              src={realtorLogo}
              alt="National Association of REALTORS logo"
              className="h-9 w-auto object-contain opacity-95 drop-shadow-[0_1px_4px_rgba(247,244,239,0.18)] md:h-10"
              loading="lazy"
            />
            <img
              src={equalHousingLogo}
              alt="Equal Housing Opportunity logo"
              className="h-9 w-auto object-contain opacity-95 drop-shadow-[0_1px_4px_rgba(247,244,239,0.18)] md:h-10"
              loading="lazy"
            />
          </div>
          <p className="mb-3 text-center text-xs uppercase tracking-[0.12em] text-primary-foreground/70 md:tracking-[0.22em]">
            National Association of REALTORS® · Equal Housing Opportunity
          </p>
          <p className="type-body-sm mx-auto text-center text-primary-foreground">
            {"\u00a9"} {new Date().getFullYear()} Iveth Coll {"\u2014"} International Real Estate Advisor. {t(ft.rights)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
