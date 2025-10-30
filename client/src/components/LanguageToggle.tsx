import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: "en" as const, name: "English", flag: "🇺🇸" },
  { code: "ko" as const, name: "한국어", flag: "🇰🇷" },
];

export default function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: "en" | "ko") => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl glass border border-white/20 hover:bg-white/10 flex items-center justify-center transition-all"
        title={`Current: ${currentLanguage.name}`}
      >
        <span className="text-xl">{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-40 glass border border-white/20 bg-black/90 backdrop-blur-xl rounded-xl shadow-xl z-50 py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-2 text-left text-white hover:bg-primary/20 transition-colors text-sm flex items-center gap-2 ${
                  language === lang.code ? "bg-primary/10" : ""
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

