import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "@/i18n/LanguageContext";

vi.mock("@/components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/features/leads/hooks", () => ({
  useCreateLeadMutation: () => ({
    isPending: false,
    mutateAsync: vi.fn().mockResolvedValue(null),
  }),
}));

import InvestPage from "./InvestPage";

const renderInvestPage = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LanguageProvider>
          <InvestPage />
        </LanguageProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("InvestPage", () => {
  it("renders one H1 and the required investment market sections", () => {
    renderInvestPage();

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Invertir en Florida" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Miami: un mercado, múltiples estrategias" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Orlando: inversión, turismo y flujo de caja" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Davenport" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Kissimmee" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Clermont / Four Corners" })).toBeInTheDocument();
  });

  it("renders Orlando tags on each Orlando zone image", () => {
    renderInvestPage();

    expect(screen.getAllByText(/^Orlando$/)).toHaveLength(3);
  });
});
