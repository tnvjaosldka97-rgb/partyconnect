import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const languages = [
  { code: "", name: "English" },
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
  { code: "zh-CN", name: "中文(简体)" },
  { code: "zh-TW", name: "中文(繁體)" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
];

export default function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load Google Translate script
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }

    // Initialize function
    window.googleTranslateElementInit = () => {
      try {
        if (!document.getElementById("google_translate_element")) {
          const div = document.createElement("div");
          div.id = "google_translate_element";
          document.body.appendChild(div);
        }

        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ko,es,fr,de,ja,zh-CN,zh-TW,pt,ru,ar",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );

        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize Google Translate:", error);
      }
    };

    return () => {
      // Cleanup
      const script = document.getElementById("google-translate-script");
      if (script) script.remove();
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    setIsOpen(false);

    // Wait for Google Translate to be ready
    const attemptChange = (retries = 0) => {
      const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement;

      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (retries < 10) {
        setTimeout(() => attemptChange(retries + 1), 200);
      } else {
        console.error("Google Translate not ready");
      }
    };

    attemptChange();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl glass border border-white/20 hover:bg-white/10 flex items-center justify-center transition-all"
          title="Change Language"
        >
          <span className="text-xl">🌐</span>
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 glass border border-white/20 bg-black/90 backdrop-blur-xl rounded-xl shadow-xl z-50 py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="w-full px-4 py-2 text-left text-white hover:bg-primary/20 transition-colors"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        /* Hide Google Translate UI elements */
        #google_translate_element {
          display: none !important;
        }

        .goog-te-banner-frame {
          display: none !important;
        }

        .goog-te-gadget {
          display: none !important;
        }

        body {
          top: 0 !important;
          position: static !important;
        }

        body.translated-ltr {
          top: 0 !important;
        }

        .skiptranslate {
          display: none !important;
        }

        /* Hide iframe */
        iframe.skiptranslate {
          display: none !important;
        }

        /* Ensure body doesn't get pushed down */
        body {
          top: 0px !important;
        }
      `}</style>
    </>
  );
}

