import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { LanguageProvider } from "@/i18n/LanguageContext";

import WhatsAppButton from "./WhatsAppButton";

describe("WhatsAppButton", () => {
  it("opens Iveth WhatsApp with a Spanish floating-button source message", () => {
    window.history.pushState({}, "", "/");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <LanguageProvider>
          <WhatsAppButton />
        </LanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /habla con iveth por whatsapp/i })).toHaveAttribute(
      "href",
      `https://wa.me/17868677180?text=${encodeURIComponent(
        "Hola Iveth, vengo desde el botón flotante de WhatsApp y quiero conversar.",
      )}`,
    );
  });

  it("opens Iveth WhatsApp with a Spanish floating-button source message on English routes", () => {
    // Note: The path must match a real route in src/i18n/routes.ts for LanguageProvider to pick it up.
    // /contact is the English path for routeKey "contact"
    window.history.pushState({}, "", "/contact");

    render(
      <MemoryRouter initialEntries={["/contact"]}>
        <LanguageProvider>
          <WhatsAppButton />
        </LanguageProvider>
      </MemoryRouter>,
    );

    // The aria-label is translated, so we look for the English version
    expect(screen.getByLabelText(/chat with iveth on whatsapp/i)).toHaveAttribute(
      "href",
      `https://wa.me/17868677180?text=${encodeURIComponent(
        "Hola Iveth, vengo desde el botón flotante de WhatsApp y quiero conversar.",
      )}`,
    );
  });
});
