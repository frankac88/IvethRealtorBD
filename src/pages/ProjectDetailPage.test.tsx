import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "@/i18n/LanguageContext";

import ProjectDetailPage from "./ProjectDetailPage";

vi.mock("@/components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/AnimatedSection", () => ({
  default: ({ children, as: Component = "div", ...props }: { children: React.ReactNode; as?: React.ElementType }) => (
    <Component {...props}>{children}</Component>
  ),
}));

vi.mock("@/components/projects/ProjectGalleryCarousel", () => ({
  ProjectGalleryCarousel: () => <div />,
}));

describe("ProjectDetailPage", () => {
  it("uses a project-specific Spanish WhatsApp message", () => {
    render(
      <MemoryRouter initialEntries={["/proyectos/edge-house"]}>
        <LanguageProvider>
          <Routes>
            <Route path="/proyectos/:slug" element={<ProjectDetailPage />} />
          </Routes>
        </LanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /más información/i })).toHaveAttribute(
      "href",
      `https://wa.me/17868677180?text=${encodeURIComponent(
        "Hola Iveth, vengo desde el detalle del proyecto EDGE HOUSE y quiero recibir precios y disponibilidad.",
      )}`,
    );
  });
});
