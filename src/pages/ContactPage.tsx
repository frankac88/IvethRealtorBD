import { useState } from "react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLeadMutation } from "@/features/leads/hooks";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useT } from "@/i18n/LanguageContext";
import { contactTranslations } from "@/i18n/translations/contact";

const ContactPage = () => {
  const { toast } = useToast();
  const [interest, setInterest] = useState("");
  const createLeadMutation = useCreateLeadMutation();
  const t = useT();
  const c = contactTranslations;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const leadData = {
      name: (formData.get("name") as string).trim(),
      email: (formData.get("email") as string).trim(),
      phone: (formData.get("phone") as string)?.trim() || null,
      country: (formData.get("country") as string)?.trim() || null,
      interest: interest || null,
      message: (formData.get("message") as string)?.trim() || null,
    };

    try {
      await createLeadMutation.mutateAsync(leadData);
      toast({ title: t(c.toastTitle), description: t(c.toastDesc) });
      form.reset();
      setInterest("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo enviar el formulario.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  return (
    <Layout>
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t(c.label)}</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t(c.title)}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t(c.subtitle)}</p>
        </div>
      </section>

      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t(c.name)}</label>
                  <Input name="name" placeholder={t(c.namePlaceholder)} required maxLength={100} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t(c.email)}</label>
                  <Input name="email" type="email" placeholder="tu@email.com" required maxLength={255} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t(c.phone)}</label>
                  <Input name="phone" type="tel" placeholder="+1 234 567 890" maxLength={20} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t(c.country)}</label>
                  <Input name="country" placeholder={t(c.countryPlaceholder)} maxLength={60} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t(c.interest)}</label>
                <Select value={interest} onValueChange={setInterest}>
                  <SelectTrigger><SelectValue placeholder={t(c.interestPlaceholder)} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="precon">{t(c.interestOptions.precon)}</SelectItem>
                    <SelectItem value="miami">{t(c.interestOptions.miami)}</SelectItem>
                    <SelectItem value="orlando">{t(c.interestOptions.orlando)}</SelectItem>
                    <SelectItem value="financing">{t(c.interestOptions.financing)}</SelectItem>
                    <SelectItem value="other">{t(c.interestOptions.other)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t(c.message)}</label>
                <Textarea name="message" placeholder={t(c.messagePlaceholder)} rows={5} maxLength={1000} />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={createLeadMutation.isPending}>
                {createLeadMutation.isPending ? t(c.sending) : t(c.send)}
              </Button>
            </form>

            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl mb-6">{t(c.infoTitle)}</h2>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, text: siteConfig.contact.locationFull },
                    { icon: Phone, text: siteConfig.contact.phoneDisplay },
                    { icon: Mail, text: siteConfig.contact.email },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <item.icon size={18} className="text-primary" />
                      <span className="text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-muted p-8 rounded-sm">
                <h3 className="font-serif text-lg mb-3">{t(c.whatsappTitle)}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t(c.whatsappDesc)}</p>
                <Button variant="default" asChild>
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
