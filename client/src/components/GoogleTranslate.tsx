import { useEffect, useState } from "react";
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
    // Check if already loaded
    if (window.google?.translate?.TranslateElement) {
      initializeTranslate();
      return;
    }

    // Load Google Translate script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    
    // Initialize function
    window.googleTranslateElementInit = () => {
      initializeTranslate();
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[src*="translate.google.com"]');
      scripts.forEach(s => s.remove());
      
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  const initializeTranslate = () => {
    try {
      if (!document.getElementById("google_translate_element")) {
        const div = document.createElement("div");
        div.id = "google_translate_element";
        div.style.display = "none";
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

  const changeLanguage = (langCode: string) => {
    setIsOpen(false);
    
    // Wait a bit for Google Translate to be ready
    setTimeout(() => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        console.error("Google Translate not ready yet");
        // Retry after a delay
        setTimeout(() => {
          const retrySelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (retrySelect) {
            retrySelect.value = langCode;
            retrySelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, 1000);
      }
    }, 100);
  };

  return (
    <>
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
        <DropdownMenuContent align="end" className="w-48 glass border-white/20 bg-black/90 backdrop-blur-xl">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="cursor-pointer hover:bg-primary/20 text-white"
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

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

