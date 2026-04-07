import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import ContactPage from "./ContactPage";
import { LanguageProvider } from "@/i18n/LanguageContext";

const mockToast = vi.fn();
const mockMutateAsync = vi.fn();
const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

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

describe("ContactPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits lead data and shows success toast", async () => {
    mockMutateAsync.mockResolvedValueOnce({});

    render(
      <MemoryRouter future={ROUTER_FUTURE_FLAGS}>
        <LanguageProvider>
          <ContactPage />
        </LanguageProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/tu nombre/i), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByPlaceholderText("tu@email.com"), { target: { value: "jane@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/\+1 234 567 890/i), { target: { value: "+593999999999" } });

    const countryInput = screen.getAllByPlaceholderText(/país/i)[0];
    fireEvent.change(countryInput, { target: { value: "Ecuador" } });

    fireEvent.change(screen.getByPlaceholderText(/cuéntanos/i), { target: { value: "Quiero invertir." } });
    fireEvent.submit(screen.getByRole("button", { name: /enviar/i }).closest("form")!);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: "Jane Doe",
        email: "jane@test.com",
        phone: "+593999999999",
        country: "Ecuador",
        interest: null,
        message: "Quiero invertir.",
      });
    });

    expect(mockToast).toHaveBeenCalled();
  });

  it("shows error toast when submit fails", async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error("Insert failed"));

    render(
      <MemoryRouter future={ROUTER_FUTURE_FLAGS}>
        <LanguageProvider>
          <ContactPage />
        </LanguageProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/tu nombre/i), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByPlaceholderText("tu@email.com"), { target: { value: "jane@test.com" } });
    fireEvent.submit(screen.getByRole("button", { name: /enviar/i }).closest("form")!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Insert failed",
        variant: "destructive",
      });
    });
  });
});
