import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: "en" as const, name: "English", flag: "🇺🇸" },
  { code: "ko" as const, name: "한국어", flag: "🇰🇷" },
  { code: "ja" as const, name: "日本語", flag: "🇯🇵" },
  { code: "zh-CN" as const, name: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW" as const, name: "繁體中文", flag: "🇹🇼" },
  { code: "es" as const, name: "Español", flag: "🇪🇸" },
  { code: "fr" as const, name: "Français", flag: "🇫🇷" },
  { code: "de" as const, name: "Deutsch", flag: "🇩🇪" },
  { code: "vi" as const, name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th" as const, name: "ไทย", flag: "🇹🇭" },
];

type LanguageCode = typeof languages[number]["code"];

export default function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: LanguageCode) => {
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
          <div className="absolute right-0 mt-2 w-48 glass border border-white/20 bg-black/90 backdrop-blur-xl rounded-xl shadow-xl z-50 py-2 max-h-96 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-2.5 text-left text-white hover:bg-primary/20 transition-colors text-sm flex items-center gap-3 ${
                  language === lang.code ? "bg-primary/10" : ""
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1">{lang.name}</span>
                {language === lang.code && (
                  <span className="text-primary font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

