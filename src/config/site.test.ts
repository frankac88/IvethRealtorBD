import { describe, expect, it } from "vitest";

import { createWhatsAppHref, siteConfig } from "./site";

describe("siteConfig WhatsApp helpers", () => {
  it("creates Iveth WhatsApp links with an encoded Spanish source message", () => {
    const href = createWhatsAppHref("Hola Iveth, vengo desde el test CTA.");

    expect(href).toBe(
      `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent("Hola Iveth, vengo desde el test CTA.")}`,
    );
  });
});
