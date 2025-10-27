import { useEffect, useRef } from "react";

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

  return (
    <div className="relative google-translate-wrapper">
      <div
        id="google_translate_element"
        ref={containerRef}
        className="google-translate-container"
      />
      <style>{`
        /* Custom styling for Google Translate */
        .google-translate-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Hide Google Translate branding */
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0 !important;
        }
        
        .goog-te-gadget > span {
          display: none !important;
        }
        
        .goog-te-gadget > div {
          display: inline-block !important;
        }
        
        /* Style the select dropdown to look like globe icon */
        .goog-te-combo {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 0.75rem !important;
          color: white !important;
          padding: 0.5rem !important;
          font-size: 0.875rem !important;
          cursor: pointer !important;
          outline: none !important;
          min-width: 40px !important;
          height: 40px !important;
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background-image: none !important;
          text-align: center !important;
          font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
        }
        
        /* Add globe emoji as background */
        .goog-te-combo::before {
          content: "🌐" !important;
          font-size: 1.25rem !important;
        }
        
        .goog-te-combo:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(139, 92, 246, 0.5) !important;
        }
        
        .goog-te-combo option {
          background: #1a1a2e !important;
          color: white !important;
          padding: 0.5rem !important;
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
        
        .skiptranslate {
          display: inline-block !important;
        }
        
        .google-translate-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Mobile responsive */
        @media (max-width: 640px) {
          .goog-te-combo {
            min-width: 36px !important;
            height: 36px !important;
            padding: 0.375rem !important;
          }
        }
      `}</style>
    </div>
  );
}

