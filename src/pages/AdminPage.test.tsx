import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";

import AdminPage from "./AdminPage";

const mockNavigate = vi.fn();
const mockRefetch = vi.fn();
const mockLogoutMutateAsync = vi.fn();
const mockUseLeadsQuery = vi.fn();
const mockUseLogoutMutation = vi.fn();
const mockRefetchProjects = vi.fn();
const mockUseAdminProjectsQuery = vi.fn();
const mockUpdateProjectMutateAsync = vi.fn();

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

vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TabsContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: ReactNode }) => (
    <button type="button" role="tab">
      {children}
    </button>
  ),
}));

vi.mock("@/features/projects/hooks", () => ({
  useAdminProjectsQuery: () => mockUseAdminProjectsQuery(),
  useCreateProjectMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateProjectMutation: () => ({
    mutateAsync: mockUpdateProjectMutateAsync,
    isPending: false,
  }),
  useDeleteProjectMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

describe("AdminPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLeadsQuery.mockReset();
    mockUseAdminProjectsQuery.mockReset();
    mockUpdateProjectMutateAsync.mockResolvedValue(undefined);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    mockRefetch.mockResolvedValue(undefined);
    mockRefetchProjects.mockResolvedValue(undefined);
    mockLogoutMutateAsync.mockResolvedValue(undefined);
    mockUseLogoutMutation.mockReturnValue({
      mutateAsync: mockLogoutMutateAsync,
      isPending: false,
    });
    mockUseAdminProjectsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: mockRefetchProjects,
      error: null,
    });
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  });

  const openLeadsTab = () => {
    fireEvent.click(screen.getByRole("tab", { name: /leads/i }));
  };

  it("renders leads table when data exists", async () => {
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
    openLeadsTab();

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@test.com")).toBeInTheDocument();
    expect(screen.getByText("Ecuador")).toBeInTheDocument();
    expect(screen.getByText("Preconstrucción")).toBeInTheDocument();
    expect(screen.getByText(/1 lead recibido/i)).toBeInTheDocument();
  });

  it("renders empty state when there are no leads", async () => {
    mockUseLeadsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: mockRefetch,
    });

    render(<AdminPage />);
    openLeadsTab();

    expect(await screen.findByText(/no hay leads registrados/i)).toBeInTheDocument();
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

  it("submits edited secondary photo tags when updating a project", async () => {
    mockUseLeadsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: mockRefetch,
    });
    mockUseAdminProjectsQuery.mockReturnValue({
      data: [
        {
          id: "project-1",
          title: "EDGE HOUSE",
          city: "miami",
          priceFrom: 540000,
          badge: { es: "Preconstrucción", en: "Pre-construction" },
          location: { es: "Edgewater, Miami", en: "Edgewater, Miami" },
          residences: { es: "Studios – 3 habitaciones", en: "Studios – 3 bedrooms" },
          baths: { es: "—", en: "—" },
          type: { es: "Airbnb permitido", en: "Airbnb allowed" },
          delivery: { es: "Entrega 2030", en: "Delivery 2030" },
          idealFor: { es: "Inversión urbana premium", en: "Premium urban investment" },
          parking: null,
          hook: { es: "Descripción corta", en: "Short description" },
          filterLocation: { es: "Edgewater, Miami", en: "Edgewater, Miami" },
          filterType: { es: "Airbnb permitido", en: "Airbnb allowed" },
          filterStrategy: { es: "Inversión urbana premium", en: "Premium urban investment" },
          imageUrl: "https://example.com/hero.webp",
          imagePath: "projects/hero.webp",
          galleryImages: [
            {
              url: "https://example.com/gallery.webp",
              path: "projects/gallery.webp",
              labelEs: "Foto 1",
              labelEn: "Photo 1",
            },
          ],
          sortOrder: 10,
          isPublished: true,
          isFeatured: true,
          createdAt: "2026-04-07T12:00:00.000Z",
          updatedAt: "2026-04-07T12:00:00.000Z",
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: mockRefetchProjects,
      error: null,
    });

    render(<AdminPage />);

    fireEvent.click(screen.getByRole("button", { name: /editar/i }));
    fireEvent.change(screen.getByLabelText(/tag es/i), { target: { value: "Fachada" } });
    fireEvent.change(screen.getByLabelText(/tag en/i), { target: { value: "Facade" } });
    fireEvent.click(screen.getByRole("button", { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(mockUpdateProjectMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: "project-1",
          payload: expect.objectContaining({
            galleryImages: [
              {
                url: "https://example.com/gallery.webp",
                path: "projects/gallery.webp",
                labelEs: "Fachada",
                labelEn: "Facade",
              },
            ],
          }),
        }),
      );
    });
  });
});
