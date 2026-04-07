import { Link } from "react-router-dom";
import { siteConfig } from "@/config/site";
import { useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const Footer = () => {
  const t = useT();
  const ft = translations.footer;

  const links = [
    { label: t(ft.navLinks.home), href: "/" },
    { label: t(ft.navLinks.about), href: "/sobre-iveth" },
    { label: t(ft.navLinks.projects), href: "/proyectos" },
    { label: t(ft.navLinks.invest), href: "/invertir-en-florida" },
    { label: t(ft.navLinks.financing), href: "/financiamiento" },
    { label: t(ft.navLinks.contact), href: "/contacto" },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-serif mb-2 uppercase">{siteConfig.brand.name}</h3>
            <p className="text-xs tracking-[0.2em] text-primary-foreground/60 uppercase mb-6">
              {t(ft.subtitle)}
            </p>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              {t(ft.description)}
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">{t(ft.navigation)}</h4>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">{t(ft.contact)}</h4>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-primary-foreground transition-colors">
                {siteConfig.contact.email}
              </a>
              <a href={`tel:${siteConfig.contact.phoneHref}`} className="hover:text-primary-foreground transition-colors">
                {siteConfig.contact.phoneDisplay}
              </a>
              <p>{siteConfig.contact.location}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Iveth Coll — International Real Estate Advisor. {t(ft.rights)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
