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
  it("does not render the secondary More information CTA in the detail form section", () => {
    render(
      <MemoryRouter initialEntries={["/proyectos/edge-house"]}>
        <LanguageProvider>
          <Routes>
            <Route path="/proyectos/:slug" element={<ProjectDetailPage />} />
          </Routes>
        </LanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByRole("link", { name: /más información/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /solicitar disponibilidad/i })).toBeInTheDocument();
  });
});
