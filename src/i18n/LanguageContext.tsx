import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type Language } from "./translations/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LANGUAGE_STORAGE_KEY = "miami-lux-advisor:language";

const isLanguage = (value: string | null): value is Language => value === "es" || value === "en";

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "es";
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isLanguage(storedLanguage) ? storedLanguage : "es";
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "es" ? "en" : "es"));
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

/** Helper: pick the right translation for the current language */
export const useT = () => {
  const { language } = useLanguage();
  return <T,>(obj: { es: T; en: T }): T => obj[language];
};
