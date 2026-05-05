import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "@/i18n/LanguageContext";

import Navbar from "./Navbar";

const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

describe("Navbar", () => {
  it("routes desktop and mobile consult CTAs to the contact form", () => {
    vi.stubGlobal("scrollTo", vi.fn());

    const { container } = render(
      <MemoryRouter future={ROUTER_FUTURE_FLAGS}>
        <LanguageProvider>
          <Navbar />
        </LanguageProvider>
      </MemoryRouter>,
    );

    const whatsappLinks = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]'));
    const consultLinks = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href="/contacto#contact-form-view"]'));

    expect(whatsappLinks).toHaveLength(0);
    expect(consultLinks).toHaveLength(2);
  });
});
