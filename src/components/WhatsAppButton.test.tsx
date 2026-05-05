import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LanguageProvider } from "@/i18n/LanguageContext";

import WhatsAppButton from "./WhatsAppButton";

describe("WhatsAppButton", () => {
  it("opens Iveth WhatsApp with a Spanish floating-button source message", () => {
    render(
      <LanguageProvider>
        <WhatsAppButton />
      </LanguageProvider>,
    );

    expect(screen.getByRole("link", { name: /habla con iveth por whatsapp/i })).toHaveAttribute(
      "href",
      `https://wa.me/17868677180?text=${encodeURIComponent(
        "Hola Iveth, vengo desde el botón flotante de WhatsApp y quiero conversar.",
      )}`,
    );
  });
});
