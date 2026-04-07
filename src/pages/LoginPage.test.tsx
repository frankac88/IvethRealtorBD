import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import LoginPage from "./LoginPage";

const mockNavigate = vi.fn();
const mockToast = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/features/auth/hooks", () => ({
  useLoginMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("navigates to admin after successful login", async () => {
    mockMutateAsync.mockResolvedValueOnce({});

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "admin@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "secret123" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: "admin@test.com",
        password: "secret123",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  it("shows toast when login fails", async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error("Credenciales inválidas"));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "admin@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "bad-pass" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Credenciales inválidas",
        variant: "destructive",
      });
    });
  });
});
