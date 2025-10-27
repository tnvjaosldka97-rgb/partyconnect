import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    // Function to initialize Google Translate
    const initGoogleTranslate = () => {
      if (window.google?.translate?.TranslateElement) {
        try {
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
          console.error("Error initializing Google Translate:", error);
        }
      }
    };

    // Set global callback
    window.googleTranslateElementInit = initGoogleTranslate;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    
    if (!existingScript) {
      // Load the script
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => {
        console.error("Failed to load Google Translate script");
      };
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      // Script already loaded
      initGoogleTranslate();
    }

    return () => {
      // Cleanup
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    // Wait for Google Translate to be ready
    const maxAttempts = 20;
    let attempts = 0;

    const tryChangeLanguage = () => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change'));
        setIsOpen(false);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryChangeLanguage, 100);
      } else {
        console.error("Google Translate select element not found");
        setIsOpen(false);
      }
    };

    tryChangeLanguage();
  };

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id="google_translate_element" />
      </div>

      {/* Custom Dropdown UI */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl glass border border-white/20 hover:bg-white/10"
            title="Change Language"
          >
            <span className="text-xl">🌐</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 glass border-white/20">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="cursor-pointer hover:bg-primary/10"
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <style>{`
        /* Hide Google Translate banner and branding */
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
        
        /* Hide the Google Translate toolbar */
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        
        body {
          top: 0px !important;
        }
      `}</style>
    </>
  );
}

