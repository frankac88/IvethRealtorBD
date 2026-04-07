import { fireEvent, render, screen } from "@testing-library/react";

import { LanguageProvider, useLanguage, useT } from "./LanguageContext";

const LANGUAGE_STORAGE_KEY = "miami-lux-advisor:language";

const TestConsumer = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = useT();

  return (
    <div>
      <span data-testid="language-value">{language}</span>
      <span data-testid="translated-value">{t({ es: "Hola", en: "Hello" })}</span>
      <button type="button" onClick={toggleLanguage}>
        Toggle
      </button>
    </div>
  );
};

describe("LanguageContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("restores saved language from localStorage", () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");

    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("language-value")).toHaveTextContent("en");
    expect(screen.getByTestId("translated-value")).toHaveTextContent("Hello");
  });

  it("persists language changes to localStorage", () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));

    expect(screen.getByTestId("language-value")).toHaveTextContent("en");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
  });
});
