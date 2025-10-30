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
  const [initAttempts, setInitAttempts] = useState(0);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.getElementById("google-translate-script");
    
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      
      script.onerror = () => {
        console.error("Failed to load Google Translate script");
      };
      
      document.head.appendChild(script);
    }

    // Initialize function with retry logic
    window.googleTranslateElementInit = () => {
      const initTranslate = () => {
        try {
          // Check if Google Translate API is available
          if (!window.google || !window.google.translate) {
            if (initAttempts < 10) {
              setInitAttempts(prev => prev + 1);
              setTimeout(initTranslate, 500);
              return;
            } else {
              console.error("Google Translate API not available after retries");
              return;
            }
          }

          // Create or get the translate element
          let translateElement = document.getElementById("google_translate_element");
          if (!translateElement) {
            translateElement = document.createElement("div");
            translateElement.id = "google_translate_element";
            translateElement.style.display = "none";
            document.body.appendChild(translateElement);
          }

          // Initialize Google Translate
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,ko,es,fr,de,ja,zh-CN,zh-TW,pt,ru,ar",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );

          // Wait a bit for the select element to be created
          setTimeout(() => {
            const selectElement = document.querySelector(".goog-te-combo");
            if (selectElement) {
              setIsReady(true);
              console.log("Google Translate initialized successfully");
            } else {
              console.warn("Google Translate select element not found");
            }
          }, 1000);

        } catch (error) {
          console.error("Failed to initialize Google Translate:", error);
        }
      };

      initTranslate();
    };

    // Trigger initialization if script is already loaded
    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

  }, [initAttempts]);

  const changeLanguage = (langCode: string) => {
    setIsOpen(false);

    // Wait for Google Translate to be ready
    const attemptChange = (retries = 0) => {
      const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement;

      if (selectElement) {
        console.log(`Changing language to: ${langCode || 'English'}`);
        selectElement.value = langCode;
        
        // Trigger change event multiple ways to ensure it works
        selectElement.dispatchEvent(new Event("change", { bubbles: true }));
        selectElement.dispatchEvent(new Event("input", { bubbles: true }));
        
        // Also try triggering with native event
        const event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, false);
        selectElement.dispatchEvent(event);
        
      } else if (retries < 15) {
        console.log(`Retrying language change... (${retries + 1}/15)`);
        setTimeout(() => attemptChange(retries + 1), 300);
      } else {
        console.error("Google Translate not ready after retries");
        alert("Translation service is not ready yet. Please try again in a moment.");
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
                  className="w-full px-4 py-2 text-left text-white hover:bg-primary/20 transition-colors text-sm"
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
          visibility: hidden !important;
          position: absolute !important;
          left: -9999px !important;
        }

        .goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
        }

        .goog-te-gadget {
          display: none !important;
          visibility: hidden !important;
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
          visibility: hidden !important;
        }

        /* Hide iframe */
        iframe.skiptranslate {
          display: none !important;
          visibility: hidden !important;
        }

        iframe.goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
        }

        /* Ensure body doesn't get pushed down */
        body {
          top: 0px !important;
        }

        /* Hide the Google Translate top bar */
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }

        body > .skiptranslate {
          display: none !important;
        }

        /* Additional hiding for persistent elements */
        .goog-te-spinner-pos {
          display: none !important;
        }
      `}</style>
    </>
  );
}

