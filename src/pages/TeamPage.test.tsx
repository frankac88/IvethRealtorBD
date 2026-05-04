import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { LanguageProvider } from "@/i18n/LanguageContext";

import TeamPage from "./TeamPage";

const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;
const LANGUAGE_STORAGE_KEY = "miami-lux-advisor:language";

const renderTeamPage = (language: "es" | "en" = "es") => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

  render(
    <MemoryRouter future={ROUTER_FUTURE_FLAGS}>
      <LanguageProvider>
        <TeamPage />
      </LanguageProvider>
    </MemoryRouter>,
  );
};

describe("TeamPage", () => {
  it("renders Ricardo with a real profile image instead of initials", () => {
    renderTeamPage();

    expect(screen.getByRole("img", { name: /ricardo suarez/i })).toBeInTheDocument();
    expect(screen.queryByText("RS")).not.toBeInTheDocument();
  });

  it("renders the updated Ricardo description", () => {
    renderTeamPage();

    expect(screen.getByText(/Como Mortgage Loan Officer, NMLS 1958473, Ricardo ayuda a residentes e inversionistas internacionales en la Florida/i)).toBeInTheDocument();
    expect(screen.getByText(/opciones hipotecarias estratégicas adaptadas a cada perfil financiero\./i)).toBeInTheDocument();
  });

  it("renders the updated Ricardo description in English", () => {
    renderTeamPage("en");

    expect(screen.getByText(/As a Mortgage Loan Officer, NMLS 1958473, Ricardo helps residents and international investors in Florida/i)).toBeInTheDocument();
    expect(screen.getByText(/strategic mortgage options tailored to each financial profile\./i)).toBeInTheDocument();
  });

  it("renders both team members inside aligned profile cards", () => {
    renderTeamPage();

    expect(document.querySelectorAll('[data-testid="team-profile-card"]')).toHaveLength(2);
  });

  it("renders team member descriptions justified", () => {
    renderTeamPage();

    const ivethDescription = screen.getByText(/Asesora a inversionistas internacionales en la adquisición de propiedades estratégicas en Florida/i);
    const ricardoDescription = screen.getByText(/Como Mortgage Loan Officer, NMLS 1958473, Ricardo ayuda a residentes e inversionistas internacionales en la Florida/i);

    expect(ivethDescription).toHaveClass("text-justify");
    expect(ricardoDescription).toHaveClass("text-justify");
  });

  it("renders team member descriptions with hyphenation enabled", () => {
    renderTeamPage();

    const ivethDescription = screen.getByText(/Asesora a inversionistas internacionales en la adquisición de propiedades estratégicas en Florida/i);
    const ricardoDescription = screen.getByText(/Como Mortgage Loan Officer, NMLS 1958473, Ricardo ayuda a residentes e inversionistas internacionales en la Florida/i);

    expect(ivethDescription).toHaveStyle({ hyphens: "auto" });
    expect(ricardoDescription).toHaveStyle({ hyphens: "auto" });
  });

  it("sets the current language on team member descriptions for proper hyphenation", () => {
    renderTeamPage();

    const ricardoDescription = screen.getByText(/Como Mortgage Loan Officer, NMLS 1958473, Ricardo ayuda a residentes e inversionistas internacionales en la Florida/i);
    expect(ricardoDescription).toHaveAttribute("lang", "es");
  });

  it("renders the updated Iveth description in Spanish", () => {
    renderTeamPage();

    expect(screen.getByText(/Asesora a inversionistas internacionales en la adquisición de propiedades estratégicas en Florida/i)).toBeInTheDocument();
    expect(screen.getByText(/con enfoque en crecimiento patrimonial, diversificación y oportunidades de alta proyección en Miami y Orlando\./i)).toBeInTheDocument();
  });

  it("renders the updated Iveth description in English", () => {
    renderTeamPage("en");

    expect(screen.getByText(/Advises international investors on acquiring strategic properties in Florida/i)).toBeInTheDocument();
    expect(screen.getByText(/with a focus on wealth growth, diversification, and high-potential opportunities in Miami and Orlando\./i)).toBeInTheDocument();
  });

  it("renders the updated CTA labels in Spanish", () => {
    renderTeamPage();

    expect(screen.getByRole("link", { name: /solicitar asesoría/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /precalificar ahora/i })).toBeInTheDocument();
  });

  it("renders the updated CTA labels in English", () => {
    renderTeamPage("en");

    expect(screen.getByRole("link", { name: /request advice/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /prequalify now/i })).toBeInTheDocument();
  });
});
