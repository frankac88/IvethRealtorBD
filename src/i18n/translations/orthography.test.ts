import { guidesTranslations } from "./guides";
import { investTranslations } from "./invest";

describe("Spanish orthography in key site copy", () => {
  it("keeps the recent Guides copy with proper accent marks", () => {
    expect(guidesTranslations.title.es).toBe("GUÍAS ESTRATÉGICAS PARA INVERTIR EN FLORIDA");
    expect(guidesTranslations.subtitle.es).toContain("prácticos");
    expect(guidesTranslations.helpTitle.es).toBe("Cómo te ayudan estas guías");
    expect(guidesTranslations.helpBody.es).toContain("más seguras");
    expect(guidesTranslations.helpBody.es).toContain("preconstrucción");
    expect(guidesTranslations.guides.investor.bullets.es[0]).toBe("LLC o título personal");
    expect(guidesTranslations.guides.preconstruction.title.es).toBe("PRECONSTRUCCIÓN EN FLORIDA");
    expect(guidesTranslations.guides.preconstruction.bullets.es[0]).toBe("Reservas y depósitos");
    expect(guidesTranslations.guides.preconstruction.bullets.es[2]).toBe("Oportunidades estratégicas");
    expect(guidesTranslations.guides.buyer.title.es).toBe("COMPRADOR ESTRATÉGICO");
  });

  it("keeps accent marks in the Invest tax section", () => {
    expect(investTranslations.sections.tax.content.es).toContain("Públicos");
  });
});
