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

    expect(screen.getByText(/Especialista en financiamiento hipotecario para residentes e inversionistas internacionales en la Florida\./i)).toBeInTheDocument();
    expect(screen.getByText(/Opciones estratégicas adaptadas a cada perfil financiero\./i)).toBeInTheDocument();
  });

  it("renders the updated Ricardo description in English", () => {
    renderTeamPage("en");

    expect(screen.getByText(/Mortgage specialist for residents and international investors in Florida\./i)).toBeInTheDocument();
    expect(screen.getByText(/Strategic options tailored to each financial profile\./i)).toBeInTheDocument();
  });

  it("renders both team members inside aligned profile cards", () => {
    renderTeamPage();

    expect(document.querySelectorAll('[data-testid="team-profile-card"]')).toHaveLength(2);
  });

  it("renders team member descriptions justified", () => {
    renderTeamPage();

    const ivethDescription = screen.getByText(/Especialista en inversiones inmobiliarias para clientes internacionales\./i);
    const ricardoDescription = screen.getByText(/Especialista en financiamiento hipotecario para residentes e inversionistas internacionales en la Florida\./i);

    expect(ivethDescription).toHaveClass("text-justify");
    expect(ricardoDescription).toHaveClass("text-justify");
  });

  it("renders team member descriptions with hyphenation enabled", () => {
    renderTeamPage();

    const ivethDescription = screen.getByText(/Especialista en inversiones inmobiliarias para clientes internacionales\./i);
    const ricardoDescription = screen.getByText(/Especialista en financiamiento hipotecario para residentes e inversionistas internacionales en la Florida\./i);

    expect(ivethDescription).toHaveStyle({ hyphens: "auto" });
    expect(ricardoDescription).toHaveStyle({ hyphens: "auto" });
  });
});
