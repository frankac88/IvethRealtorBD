import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

import ProtectedRoute from "./ProtectedRoute";

const mockUseAuthSession = vi.fn();
const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

vi.mock("@/features/auth/hooks", () => ({
  useAuthSession: () => mockUseAuthSession(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state while session is being resolved", () => {
    mockUseAuthSession.mockReturnValue({ data: null, isLoading: true });

    render(
      <MemoryRouter initialEntries={["/admin"]} future={ROUTER_FUTURE_FLAGS}>
        <Routes>
          <Route
            path="/admin"
            element={(
              <ProtectedRoute>
                <div>Admin content</div>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument();
  });

  it("redirects unauthenticated users to login", () => {
    mockUseAuthSession.mockReturnValue({ data: null, isLoading: false });

    render(
      <MemoryRouter initialEntries={["/admin"]} future={ROUTER_FUTURE_FLAGS}>
        <Routes>
          <Route
            path="/admin"
            element={(
              <ProtectedRoute>
                <div>Admin content</div>
              </ProtectedRoute>
            )}
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    mockUseAuthSession.mockReturnValue({ data: { user: { id: "123" } }, isLoading: false });

    render(
      <MemoryRouter initialEntries={["/admin"]} future={ROUTER_FUTURE_FLAGS}>
        <Routes>
          <Route
            path="/admin"
            element={(
              <ProtectedRoute>
                <div>Admin content</div>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Admin content")).toBeInTheDocument();
  });
});
