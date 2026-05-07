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

  it("opens Iveth WhatsApp with an English floating-button source message on English routes", () => {
    window.history.pushState({}, "", "/contact");

    render(
      <MemoryRouter initialEntries={["/contact"]}>
        <LanguageProvider>
          <WhatsAppButton />
        </LanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /chat with iveth on whatsapp/i })).toHaveAttribute(
      "href",
      `https://wa.me/17868677180?text=${encodeURIComponent(
        "Hi Iveth, I am coming from the floating WhatsApp button and I would like to chat.",
      )}`,
    );
  });
});
