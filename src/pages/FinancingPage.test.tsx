import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { LanguageProvider } from "@/i18n/LanguageContext";

import FinancingPage from "./FinancingPage";

const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;
const LANGUAGE_STORAGE_KEY = "miami-lux-advisor:language";

const renderFinancingPage = (language: "es" | "en" = "es") => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

  render(
    <MemoryRouter future={ROUTER_FUTURE_FLAGS}>
      <LanguageProvider>
        <FinancingPage />
      </LanguageProvider>
    </MemoryRouter>,
  );
};

describe("FinancingPage", () => {
  it("renders the updated financing subtitle", () => {
    renderFinancingPage();

    expect(screen.getByText(/Opciones hipotecarias para residentes e inversionistas extranjeros\./i)).toBeInTheDocument();
    expect(screen.getByText(/Te ayudamos a estructurar una compra clara, viable y estrategica\./i)).toBeInTheDocument();
  });

  it("renders the updated financing subtitle in English", () => {
    renderFinancingPage("en");

    expect(screen.getByText(/Mortgage options for residents and foreign investors\./i)).toBeInTheDocument();
    expect(screen.getByText(/We help you structure a clear, viable, and strategic purchase\./i)).toBeInTheDocument();
  });
});
