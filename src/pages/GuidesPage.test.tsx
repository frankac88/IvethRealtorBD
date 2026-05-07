import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { LanguageProvider } from "@/i18n/LanguageContext";

import GuidesPage from "./GuidesPage";

const mockMutateAsync = vi.fn();
const mockToast = vi.fn();
const mockLocationAssign = vi.fn();
const mockFetch = vi.fn();
const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

vi.mock("@/components/Layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/AnimatedSection", () => ({
  __esModule: true,
  default: ({
    children,
    as: Tag = "section",
    ...props
  }: {
    children: React.ReactNode;
    as?: "section" | "div" | "article";
  }) => <Tag {...props}>{children}</Tag>,
}));

vi.mock("@/features/leads/hooks", () => ({
  useCreateLeadMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const renderGuidesPage = () => {
  render(
    <MemoryRouter future={ROUTER_FUTURE_FLAGS}>
      <LanguageProvider>
        <GuidesPage />
      </LanguageProvider>
    </MemoryRouter>,
  );
};

describe("GuidesPage", () => {
  const originalLocation = window.location;
  const originalFetch = window.fetch;

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...originalLocation,
        assign: mockLocationAssign,
      },
    });
    Object.defineProperty(window, "fetch", {
      configurable: true,
      value: mockFetch,
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    Object.defineProperty(window, "fetch", {
      configurable: true,
      value: originalFetch,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

      if (url.includes("/availability")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            guides: {
              investor: true,
              preconstruction: false,
              financing: false,
              buyer: false,
            },
          }),
        });
      }

      if (init?.method === "HEAD") {
        return Promise.resolve({ ok: true });
      }

      return Promise.resolve({ ok: true });
    });
  });

  it("renders the exact Spanish conversion copy and redesigned editorial guide cards without inline images", () => {
    renderGuidesPage();

    expect(
      screen.getByRole("heading", { name: "GUÍAS ESTRATÉGICAS PARA INVERTIR EN FLORIDA" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Recursos prácticos para compradores e inversionistas internacionales que buscan invertir con seguridad y estrategia.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cómo te ayudan estas guías" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Te orientan para invertir con mayor claridad, evitar errores costosos y tomar decisiones más seguras en compra, financiamiento y preconstrucción.",
      ),
    ).toBeInTheDocument();

    expect(screen.getAllByText(/^Guía/)).not.toHaveLength(0);
    expect(screen.getByRole("heading", { name: "Inversionistas Internacionales" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Preconstrucción en Florida" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Financiamiento Inteligente" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Comprador Estratégico" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Descargar Guía" })).toHaveLength(4);
    expect(screen.getAllByRole("link", { name: "WhatsApp Directo" })).toHaveLength(4);
    expect(document.querySelectorAll("article img")).toHaveLength(0);
    expect(screen.getByText("LLC o título personal")).toBeInTheDocument();
    expect(screen.getByText("Reservas y depósitos")).toBeInTheDocument();
    expect(screen.getByText("Down payment real")).toBeInTheDocument();
    expect(screen.getByText("HOA e insurance")).toBeInTheDocument();
  });

  it("captures a lead from the selected guide and redirects to the temporary download link", async () => {
    const guideDownloadUrl = "https://iveth-guias-download.iveth-guias.workers.dev/download?guide=investor";
    mockMutateAsync.mockResolvedValueOnce({ guideDownloadUrl });
    renderGuidesPage();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/availability"),
        expect.objectContaining({ method: "GET", cache: "no-store" }),
      );
    });

    fireEvent.click(screen.getAllByRole("button", { name: "Descargar Guía" })[0]);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@test.com" },
    });
    fireEvent.change(screen.getByLabelText("WhatsApp (opcional)"), {
      target: { value: "+17865550123" },
    });

    const dialog = screen.getByRole("dialog");
    fireEvent.submit(within(dialog).getByRole("button", { name: "Descargar Guía" }).closest("form")!);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: "Jane Doe",
        email: "jane@test.com",
        phone: "+17865550123",
        country: "Guías Florida",
        interest: "Guía · INVERSIONISTAS INTERNACIONALES",
        message: expect.stringContaining("INVERSIONISTAS INTERNACIONALES"),
        honeypot: "",
        startedAt: expect.any(Number),
        guideKey: "investor",
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "Tu guía está lista",
      description: "La descarga comenzará automáticamente en unos segundos.",
    });
    expect(mockLocationAssign).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(mockLocationAssign).toHaveBeenCalledWith(guideDownloadUrl);
    }, { timeout: 1500 });
  });

  it("shows a coming soon message and does not open the form when the guide is not available", async () => {
    renderGuidesPage();

    fireEvent.click(screen.getAllByRole("button", { name: "Descargar Guía" })[1]);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Información",
        description: "Esta guía aún no está disponible. La subiremos pronto.",
        variant: "info",
      });
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("shows the same message when availability cannot be confirmed", async () => {
    mockFetch.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

      if (url.includes("/availability")) {
        return Promise.reject(new Error("network error"));
      }

      if (init?.method === "HEAD") {
        return Promise.resolve({ ok: true });
      }

      return Promise.resolve({ ok: true });
    });

    renderGuidesPage();

    fireEvent.click(screen.getAllByRole("button", { name: "Descargar Guía" })[0]);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Información",
        description: "Esta guía aún no está disponible. La subiremos pronto.",
        variant: "info",
      });
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("shows a fallback modal when the automatic download cannot be validated", async () => {
    const guideDownloadUrl = "https://iveth-guias-download.iveth-guias.workers.dev/download?guide=investor";
    mockMutateAsync.mockResolvedValueOnce({ guideDownloadUrl });
    mockFetch.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

      if (url.includes("/availability")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            guides: {
              investor: true,
              preconstruction: false,
              financing: false,
              buyer: false,
            },
          }),
        });
      }

      if (init?.method === "HEAD") {
        return Promise.resolve({ ok: false });
      }

      return Promise.resolve({ ok: true });
    });
    renderGuidesPage();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/availability"),
        expect.objectContaining({ method: "GET", cache: "no-store" }),
      );
    });

    fireEvent.click(screen.getAllByRole("button", { name: "Descargar Guía" })[0]);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@test.com" } });

    const dialog = screen.getByRole("dialog");
    fireEvent.submit(within(dialog).getByRole("button", { name: "Descargar Guía" }).closest("form")!);

    expect(await screen.findByText("No pudimos iniciar la descarga automáticamente")).toBeInTheDocument();
    expect(screen.getByText("Si la descarga no inicia automáticamente, usa este botón.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Descargar guía" })).toHaveAttribute("href", guideDownloadUrl);
    expect(mockLocationAssign).not.toHaveBeenCalled();
  });

  it("uses a guide-specific WhatsApp message", () => {
    renderGuidesPage();

    const whatsappLinks = screen.getAllByRole("link", { name: "WhatsApp Directo" });

    expect(whatsappLinks[0]).toHaveAttribute(
      "href",
      expect.stringContaining(
        encodeURIComponent(
          "Hola Iveth, vengo desde la guía INVERSIONISTAS INTERNACIONALES y quiero recibir orientación.",
        ),
      ),
    );
    expect(whatsappLinks[0]).toHaveAttribute("href", expect.stringContaining("wa.me/17868677180"));
  });
});
