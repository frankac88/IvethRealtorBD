import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useT } from "@/i18n/LanguageContext";
import { contactTranslations } from "@/i18n/translations/contact";
import { useLocation } from "react-router-dom";

const ContactPage = () => {
  const location = useLocation();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const t = useT();
  const c = contactTranslations;

  useEffect(() => {
    if (location.hash !== "#contact-form-view") return;

    requestAnimationFrame(() => {
      const target = document.getElementById("contact-form-view");
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - 240;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }, [location.hash]);

  return (
    <Layout>
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="type-caption mb-4">{t(c.label)}</p>
          <h1 className="type-h1 mb-4">{t(c.title)}</h1>
          <p className="type-body mx-auto max-w-xl">{t(c.subtitle)}</p>
        </div>
      </section>

      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div id="contact-form-view" className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto scroll-mt-8">
            <LeadCaptureForm idPrefix="contact" title={t(c.formTitle)} />

            <div className="space-y-10">
              <div>
                <h2 className="mb-10 font-serif text-[2rem] leading-tight tracking-[-0.02em]">{t(c.infoTitle)}</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-primary shadow-sm">
                      <Mail size={18} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="type-body-sm leading-none tracking-[0.01em] text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="type-body mt-2 block break-all leading-snug text-foreground transition-colors hover:text-primary"
                      >
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-primary shadow-sm">
                      <Phone size={18} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="type-body-sm leading-none tracking-[0.01em] text-muted-foreground">Phone</p>
                      <a href={`tel:${siteConfig.contact.phoneHref}`} className="type-body mt-2 block leading-snug text-foreground transition-colors hover:text-primary">
                        {siteConfig.contact.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-primary shadow-sm">
                      <MapPin size={18} />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="type-body-sm leading-none tracking-[0.01em] text-muted-foreground">{t(c.locationLabel)}</p>
                      <p className="type-body mt-2 leading-snug text-foreground">
                        {siteConfig.contact.locationFull}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsLocationOpen((prev) => !prev)}
                        aria-expanded={isLocationOpen}
                        aria-controls="contact-location-map"
                        className="type-body-sm mt-3 inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                      >
                        {isLocationOpen ? t(c.locationToggleHide) : t(c.locationToggleShow)}
                      </button>

                      {isLocationOpen && (
                        <div id="contact-location-map" className="mt-5 overflow-hidden rounded-[24px] border border-border/60 bg-background shadow-[0_12px_40px_-24px_rgba(26,31,46,0.2)]">
                          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                            <a
                              href={siteConfig.contact.locationMapsHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="type-body-sm inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary/80"
                            >
                              {t(c.locationMapOpen)}
                              <ExternalLink size={14} />
                            </a>
                          </div>
                          <iframe
                            title={siteConfig.contact.locationFull}
                            src={siteConfig.contact.locationEmbedSrc}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="h-[300px] w-full border-0"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] bg-card/80 p-8 ring-1 ring-border/50">
                <h3 className="type-h3 mb-3 text-primary">{t(c.whatsappTitle)}</h3>
                <p className="type-body-sm mb-4 text-muted-foreground">{t(c.whatsappDesc)}</p>
                <Button variant="whatsapp" asChild>
                  <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">{t(c.whatsappButton)}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default ContactPage;






