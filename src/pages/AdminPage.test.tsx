import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import AdminPage from "./AdminPage";

const mockNavigate = vi.fn();
const mockRefetch = vi.fn();
const mockLogoutMutateAsync = vi.fn();
const mockUseLeadsQuery = vi.fn();
const mockUseLogoutMutation = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/features/leads/hooks", () => ({
  useLeadsQuery: () => mockUseLeadsQuery(),
}));

vi.mock("@/features/auth/hooks", () => ({
  useLogoutMutation: () => mockUseLogoutMutation(),
}));

describe("AdminPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRefetch.mockResolvedValue(undefined);
    mockLogoutMutateAsync.mockResolvedValue(undefined);
    mockUseLogoutMutation.mockReturnValue({
      mutateAsync: mockLogoutMutateAsync,
      isPending: false,
    });
  });

  it("renders leads table when data exists", () => {
    mockUseLeadsQuery.mockReturnValue({
      data: [
        {
          id: "1",
          name: "Jane Doe",
          email: "jane@test.com",
          phone: "+593999999999",
          country: "Ecuador",
          interest: "precon",
          message: "Quiero invertir",
          created_at: "2026-04-07T12:00:00.000Z",
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: mockRefetch,
    });

    render(<AdminPage />);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@test.com")).toBeInTheDocument();
    expect(screen.getByText("Ecuador")).toBeInTheDocument();
    expect(screen.getByText("Preconstrucción")).toBeInTheDocument();
    expect(screen.getByText(/1 lead recibido/i)).toBeInTheDocument();
  });

  it("renders empty state when there are no leads", () => {
    mockUseLeadsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: mockRefetch,
    });

    render(<AdminPage />);

    expect(screen.getByText(/aún no hay leads registrados/i)).toBeInTheDocument();
  });

  it("calls refetch when refresh button is clicked", async () => {
    mockUseLeadsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: mockRefetch,
    });

    render(<AdminPage />);

    fireEvent.click(screen.getByRole("button", { name: /actualizar/i }));

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  it("logs out and redirects to login", async () => {
    mockUseLeadsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: mockRefetch,
    });

    render(<AdminPage />);

    fireEvent.click(screen.getByRole("button", { name: /salir/i }));

    await waitFor(() => {
      expect(mockLogoutMutateAsync).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
