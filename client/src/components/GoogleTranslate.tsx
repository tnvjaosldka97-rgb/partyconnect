import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const translatorInitialized = useRef(false);

  useEffect(() => {
    // Suppress removeChild errors globally
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function(child: Node) {
      try {
        return originalRemoveChild.call(this, child);
      } catch (error) {
        console.debug('removeChild error suppressed (Google Translate)');
        return child;
      }
    };

    // Prevent multiple initializations
    if (translatorInitialized.current) {
      return;
    }

    // Google Translate initialization function
    const initGoogleTranslate = () => {
      if (window.google && window.google.translate && containerRef.current) {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,ko,es,fr,de,ja,zh-CN,zh-TW,pt,ru,ar",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true,
            },
            "google_translate_element"
          );
          translatorInitialized.current = true;
        } catch (error) {
          console.error("Error initializing Google Translate:", error);
        }
      }
    };

    // Set up the callback
    window.googleTranslateElementInit = initGoogleTranslate;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    
    if (!existingScript && !scriptLoadedRef.current) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => {
        console.error("Failed to load Google Translate script");
        scriptLoadedRef.current = false;
      };
      script.onload = () => {
        scriptLoadedRef.current = true;
      };
      document.body.appendChild(script);
    } else if (window.google && window.google.translate && !translatorInitialized.current) {
      initGoogleTranslate();
    }

    return () => {
      Node.prototype.removeChild = originalRemoveChild;
      
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
      
      if (containerRef.current) {
        try {
          containerRef.current.innerHTML = '';
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const handleGlobeClick = () => {
    // Find and click the Google Translate select element
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      // Trigger click to open dropdown
      selectElement.focus();
      selectElement.click();
      
      // For mobile devices
      const event = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      selectElement.dispatchEvent(event);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Globe Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleGlobeClick}
        className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl glass border border-white/20 hover:bg-white/10"
        title="Change Language"
      >
        <span className="text-xl">🌐</span>
      </Button>

      {/* Hidden Google Translate Element */}
      <div className="hidden-translate">
        <div
          id="google_translate_element"
          ref={containerRef}
          className="google-translate-container"
        />
      </div>

      <style>{`
        /* Hide the Google Translate element but keep it functional */
        .hidden-translate {
          position: absolute;
          left: -9999px;
          top: -9999px;
          opacity: 0;
          pointer-events: none;
        }
        
        /* When select is focused, show it */
        .goog-te-combo:focus,
        .goog-te-combo:active {
          position: fixed !important;
          left: auto !important;
          top: 60px !important;
          right: 20px !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          z-index: 9999 !important;
        }
        
        /* Style the select dropdown */
        .goog-te-combo {
          background: rgba(26, 26, 46, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 0.75rem !important;
          color: white !important;
          padding: 0.75rem !important;
          font-size: 0.875rem !important;
          cursor: pointer !important;
          outline: none !important;
          min-width: 180px !important;
          backdrop-filter: blur(10px) !important;
        }
        
        .goog-te-combo:hover {
          background: rgba(26, 26, 46, 1) !important;
          border-color: rgba(139, 92, 246, 0.5) !important;
        }
        
        .goog-te-combo option {
          background: #1a1a2e !important;
          color: white !important;
          padding: 0.5rem !important;
        }
        
        /* Hide Google Translate branding */
        .goog-te-gadget {
          font-size: 0 !important;
        }
        
        .goog-te-gadget > span {
          display: none !important;
        }
        
        /* Hide the banner */
        .goog-te-banner-frame {
          display: none !important;
        }
        
        body {
          top: 0 !important;
        }
        
        body.translated-ltr {
          top: 0 !important;
        }
        
        .google-translate-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

