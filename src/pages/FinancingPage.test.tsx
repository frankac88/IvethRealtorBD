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
    expect(screen.getByText(/Te ayudamos a estructurar una compra clara, viable y estratégica\./i)).toBeInTheDocument();
  });

  it("renders the updated financing card items in Spanish", () => {
    renderFinancingPage();

    expect(screen.getByText(/Préstamos sin verificación de ingresos/i)).toBeInTheDocument();
    expect(screen.getByText(/Programas competitivos según perfil financiero/i)).toBeInTheDocument();
    expect(screen.getByText(/Cuota inicial desde 3\.0%/i)).toBeInTheDocument();
    expect(screen.getByText(/Opciones según necesidad y objetivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Atención personalizada en español/i)).toBeInTheDocument();
  });

  it("renders financing card items with a separate bullet for proper hanging indent", () => {
    renderFinancingPage("en");

    const bullet = screen.getAllByText("•")[0];
    const listItem = bullet.closest("li");

    expect(listItem).toHaveClass("flex");
    expect(listItem).toHaveClass("items-start");
    expect(listItem).toHaveClass("gap-3");
  });

  it("renders the updated financing subtitle in English", () => {
    renderFinancingPage("en");

    expect(screen.getByText(/Mortgage options for residents and foreign investors\./i)).toBeInTheDocument();
    expect(screen.getByText(/We help you structure a clear, viable, and strategic purchase\./i)).toBeInTheDocument();
  });

  it("renders the updated financing card items in English", () => {
    renderFinancingPage("en");

    expect(screen.getByText(/No-income-verification loans/i)).toBeInTheDocument();
    expect(screen.getByText(/Competitive programs based on financial profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Down payment from 3\.0%/i)).toBeInTheDocument();
    expect(screen.getByText(/Options based on needs and goals/i)).toBeInTheDocument();
  });

  it("renders the updated financing process steps in Spanish", () => {
    renderFinancingPage();

    expect(screen.getByText(/Evaluación inicial personalizada\./i)).toBeInTheDocument();
    expect(screen.getByText(/Preaprobación y evaluación financiera/i)).toBeInTheDocument();
    expect(screen.getByText(/Selección del programa ideal/i)).toBeInTheDocument();
    expect(screen.getByText(/Solicitud formal del préstamo/i)).toBeInTheDocument();
    expect(screen.getByText(/Revisión y aprobación crediticia/i)).toBeInTheDocument();
    expect(screen.getByText(/Cierre y entrega final\./i)).toBeInTheDocument();
  });

  it("renders the updated financing process steps in English", () => {
    renderFinancingPage("en");

    expect(screen.getByText(/Personalized initial assessment\./i)).toBeInTheDocument();
    expect(screen.getByText(/Pre-approval and financial assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Selection of the ideal program/i)).toBeInTheDocument();
    expect(screen.getByText(/Formal loan application/i)).toBeInTheDocument();
    expect(screen.getByText(/Credit review and approval/i)).toBeInTheDocument();
    expect(screen.getByText(/Closing and final delivery\./i)).toBeInTheDocument();
  });
});
