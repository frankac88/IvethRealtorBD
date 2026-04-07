import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Language } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("es");

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
