import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { LanguageProvider } from "@/i18n/LanguageContext";

import ProjectsPage from "./ProjectsPage";

vi.mock("@/components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock("@/components/AnimatedSection", () => ({
  default: ({
    children,
    as: Component = "div",
    ...props
  }: {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
  }) => <Component {...props}>{children}</Component>,
}));

vi.mock("@/features/projects/hooks", () => ({
  usePublishedProjectsQuery: () => ({ data: [], isLoading: false, error: null }),
}));

const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

const renderProjectsPage = (route = "/proyectos") => {
  render(
    <MemoryRouter initialEntries={[route]} future={ROUTER_FUTURE_FLAGS}>
      <LanguageProvider>
        <ProjectsPage />
      </LanguageProvider>
    </MemoryRouter>,
  );
};

describe("ProjectsPage flagship redesign", () => {
  it("renders the flagship private-selection experience with integrated filters", () => {
    renderProjectsPage();

    expect(screen.getByRole("heading", {
      name: /oportunidades que no se eligen por catálogo/i,
    })).toBeInTheDocument();
    expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/objetivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de renta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/presupuesto/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /miami/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /orlando/i })).toBeInTheDocument();
    expect(screen.getByText(/no todos los proyectos merecen tu atención/i)).toBeInTheDocument();
  });

  it("filters projects by city and keeps a luxury empty state", () => {
    renderProjectsPage();

    fireEvent.change(screen.getByLabelText(/ciudad/i), {
      target: { value: "orlando" },
    });

    expect(screen.queryByRole("heading", { name: /edge house/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /reunion village/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/presupuesto/i), {
      target: { value: "2m-plus" },
    });

    expect(screen.getByText(/no encontramos una coincidencia exacta/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /limpiar filtros/i })).toBeInTheDocument();
  });
});
