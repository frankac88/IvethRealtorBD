import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "@/i18n/LanguageContext";

import ProjectDetailPage from "./ProjectDetailPage";

const leadMutation = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  isPending: false,
}));

const toast = vi.hoisted(() => vi.fn());

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

vi.mock("@/features/leads/hooks", () => ({
  useCreateLeadMutation: () => leadMutation,
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast }),
}));

const renderProjectDetail = (path = "/proyectos/edge-house") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <Routes>
          <Route path="/proyectos/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>,
  );

const fillAvailabilityForm = () => {
  fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: "Ana Perez" } });
  fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "ana@example.com" } });
  fireEvent.change(screen.getByLabelText(/^teléfono$/i), { target: { value: "+593999999999" } });
  fireEvent.change(screen.getByLabelText(/^país$/i), { target: { value: "Ecuador" } });
};

describe("ProjectDetailPage", () => {
  beforeEach(() => {
    leadMutation.mutateAsync.mockReset();
    leadMutation.mutateAsync.mockResolvedValue({ success: true });
    leadMutation.isPending = false;
    toast.mockReset();
  });

  it("does not render the secondary More information CTA in the detail form section", () => {
    renderProjectDetail();

    expect(screen.queryByRole("link", { name: /más información/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /solicitar disponibilidad/i })).toBeInTheDocument();
  });

  it("submits Miami project availability through the lead flow with the project title in the message", async () => {
    renderProjectDetail("/proyectos/edge-house");
    fillAvailabilityForm();

    fireEvent.click(screen.getByRole("button", { name: /solicitar disponibilidad/i }));

    await waitFor(() => expect(leadMutation.mutateAsync).toHaveBeenCalledTimes(1));
    expect(leadMutation.mutateAsync).toHaveBeenCalledWith({
      name: "Ana Perez",
      email: "ana@example.com",
      phone: "+593999999999",
      country: "Ecuador",
      interest: "miami",
      message: "Solicitud de disponibilidad para el proyecto: EDGE HOUSE",
      honeypot: "",
      startedAt: expect.any(Number),
    });
  });

  it("submits Orlando project availability with Orlando investment interest", async () => {
    renderProjectDetail("/proyectos/reunion-village");
    fillAvailabilityForm();

    fireEvent.click(screen.getByRole("button", { name: /solicitar disponibilidad/i }));

    await waitFor(() => expect(leadMutation.mutateAsync).toHaveBeenCalledTimes(1));
    expect(leadMutation.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        interest: "orlando",
        message: "Solicitud de disponibilidad para el proyecto: REUNION VILLAGE",
      }),
    );
  });

  it("shows validation and does not submit when required fields are missing", async () => {
    renderProjectDetail();

    fireEvent.click(screen.getByRole("button", { name: /solicitar disponibilidad/i }));

    expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(leadMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it("shows the sending label while the availability request is pending", () => {
    leadMutation.isPending = true;
    renderProjectDetail();

    expect(screen.getByRole("button", { name: /enviando/i })).toBeDisabled();
  });
});
