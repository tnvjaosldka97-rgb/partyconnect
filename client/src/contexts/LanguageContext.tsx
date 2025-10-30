import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import enTranslations from "@/locales/en.json";
import koTranslations from "@/locales/ko.json";
import jaTranslations from "@/locales/ja.json";
import zhCNTranslations from "@/locales/zh-CN.json";
import zhTWTranslations from "@/locales/zh-TW.json";
import esTranslations from "@/locales/es.json";
import frTranslations from "@/locales/fr.json";
import deTranslations from "@/locales/de.json";
import viTranslations from "@/locales/vi.json";
import thTranslations from "@/locales/th.json";

type Language = "en" | "ko" | "ja" | "zh-CN" | "zh-TW" | "es" | "fr" | "de" | "vi" | "th";

type Translations = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, any> = {
  en: enTranslations,
  ko: koTranslations,
  ja: jaTranslations,
  "zh-CN": zhCNTranslations,
  "zh-TW": zhTWTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  vi: viTranslations,
  th: thTranslations,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get saved language from localStorage or default to English
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem("language", language);
    
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Translation function with nested key support
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
          }
        }
        break;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

