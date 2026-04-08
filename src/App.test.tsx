import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

const mockUseAuthSession = vi.fn();

vi.mock("@/features/auth/hooks", () => ({
  useAuthSession: () => mockUseAuthSession(),
}));

vi.mock("./pages/Index.tsx", () => ({
  default: () => <div>Home route</div>,
}));

vi.mock("./pages/AboutPage.tsx", () => ({
  default: () => <div>About route</div>,
}));

vi.mock("./pages/TeamPage.tsx", () => ({
  default: () => <div>Team route</div>,
}));

vi.mock("./pages/ProjectsPage.tsx", () => ({
  default: () => <div>Projects route</div>,
}));

vi.mock("./pages/InvestPage.tsx", () => ({
  default: () => <div>Invest route</div>,
}));

vi.mock("./pages/FinancingPage.tsx", () => ({
  default: () => <div>Financing route</div>,
}));

vi.mock("./pages/TestimonialsPage.tsx", () => ({
  default: () => <div>Testimonials route</div>,
}));

vi.mock("./pages/ContactPage.tsx", () => ({
  default: () => <div>Contact route</div>,
}));

vi.mock("./pages/LoginPage.tsx", () => ({
  default: () => <div>Login route</div>,
}));

vi.mock("./pages/AdminPage.tsx", () => ({
  default: () => <div>Admin route</div>,
}));

vi.mock("./pages/NotFound.tsx", () => ({
  default: () => <div>NotFound route</div>,
}));

import App from "./App";

const setRoute = (route: string) => {
  window.history.pushState({}, "", route);
};

describe("App routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthSession.mockReturnValue({ data: null, isLoading: false });
    setRoute("/");
  });

  it("renders the home route", async () => {
    render(<App />);

    expect(await screen.findByText("Home route")).toBeInTheDocument();
  });

  it("renders a lazy public route", async () => {
    setRoute("/contacto");

    render(<App />);

    expect(await screen.findByText("Contact route")).toBeInTheDocument();
  });

  it("renders an english localized public route", async () => {
    setRoute("/contact");

    render(<App />);

    expect(await screen.findByText("Contact route")).toBeInTheDocument();
  });

  it("redirects unauthenticated users from /admin to /login", async () => {
    setRoute("/admin");

    render(<App />);

    expect(await screen.findByText("Login route")).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });
  });

  it("renders /admin for authenticated users", async () => {
    mockUseAuthSession.mockReturnValue({ data: { user: { id: "123" } }, isLoading: false });
    setRoute("/admin");

    render(<App />);

    expect(await screen.findByText("Admin route")).toBeInTheDocument();
  });

  it("renders not found for unknown routes", async () => {
    setRoute("/ruta-inexistente");

    render(<App />);

    expect(await screen.findByText("NotFound route")).toBeInTheDocument();
  });
});
