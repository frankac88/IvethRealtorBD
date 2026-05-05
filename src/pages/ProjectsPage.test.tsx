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
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    scrollIntoView.mockClear();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
  });

  it("renders the flagship private-selection experience with integrated filters", () => {
    renderProjectsPage();

    expect(screen.getByRole("heading", {
      name: /oportunidades que no se eligen por catálogo/i,
    })).toBeInTheDocument();
    expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/objetivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de renta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/presupuesto/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^miami\b/i })).toBeInTheDocument();
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

  it("promotes a selected Miami compact card into the featured project view", () => {
    renderProjectsPage();

    expect(screen.getByTestId("featured-project-miami")).toHaveTextContent(/edge house/i);
    expect(screen.getByRole("button", { name: /seleccionar bloom/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /seleccionar bloom/i }));

    expect(screen.getByTestId("featured-project-miami")).toHaveTextContent(/bloom/i);
    expect(screen.getByRole("button", { name: /seleccionar edge house/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver si bloom es para ti/i })).toHaveAttribute(
      "href",
      "/proyectos/bloom-north-miami",
    );
  });

  it("restores a selected project from the project query param", () => {
    renderProjectsPage("/proyectos?project=bloom-north-miami");

    expect(screen.getByTestId("featured-project-miami")).toHaveTextContent(/bloom/i);
    expect(screen.getByRole("button", { name: /seleccionar edge house/i })).toBeInTheDocument();
  });

  it("falls back to the first visible project when the selected project is filtered out", () => {
    renderProjectsPage("/proyectos?project=bloom-north-miami&goal=primary-home");

    expect(screen.getByTestId("featured-project-miami")).toHaveTextContent(/midtown park/i);
    expect(screen.queryByText(/bloom/i)).not.toBeInTheDocument();
  });

  it("keeps Miami and Orlando featured selections independent in the same page", () => {
    renderProjectsPage();

    fireEvent.click(screen.getByRole("button", { name: /seleccionar bloom/i }));
    fireEvent.click(screen.getByRole("button", { name: /seleccionar storey lake/i }));

    expect(screen.getByTestId("featured-project-miami")).toHaveTextContent(/bloom/i);
    expect(screen.getByTestId("featured-project-orlando")).toHaveTextContent(/storey lake/i);
  });

  it("scrolls to the featured project view after selecting a compact card", () => {
    renderProjectsPage();

    fireEvent.click(screen.getByRole("button", { name: /seleccionar bloom/i }));

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  });

  it("opens project WhatsApp CTAs directly with a project-page source message", () => {
    renderProjectsPage();

    const expectedHref = `https://wa.me/17868677180?text=${encodeURIComponent(
      "Hola Iveth, vengo desde la página de proyectos y quiero ayuda para elegir una oportunidad.",
    )}`;

    expect(screen.getAllByRole("link", { name: /^whatsapp$/i })[0]).toHaveAttribute("href", expectedHref);
  });

  it("moves the removed detail More information WhatsApp action to the featured Solicitar info CTA", () => {
    renderProjectsPage();

    const expectedHref = `https://wa.me/17868677180?text=${encodeURIComponent(
      "Hola Iveth, vengo desde el detalle del proyecto EDGE HOUSE y quiero recibir precios y disponibilidad.",
    )}`;

    expect(screen.getAllByRole("link", { name: /solicitar info/i })[0]).toHaveAttribute("href", expectedHref);
  });
});
