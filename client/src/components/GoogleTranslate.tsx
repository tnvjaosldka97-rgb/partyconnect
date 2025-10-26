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

  useEffect(() => {
    // Prevent multiple script loads
    if (scriptLoadedRef.current) {
      return;
    }

    // Google Translate initialization function
    const initGoogleTranslate = () => {
      if (window.google && window.google.translate && containerRef.current) {
        // Clear any existing content safely
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
        
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
        } catch (error) {
          console.error("Error initializing Google Translate:", error);
        }
      }
    };

    // Set up the callback
    window.googleTranslateElementInit = initGoogleTranslate;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    
    if (!existingScript) {
      // Add the script
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
    } else if (window.google && window.google.translate) {
      // Script already loaded, just initialize
      initGoogleTranslate();
      scriptLoadedRef.current = true;
    }

    return () => {
      // Cleanup on unmount
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
      
      // Clean up container safely
      if (containerRef.current) {
        try {
          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
        } catch (error) {
          // Ignore cleanup errors
          console.debug("Cleanup error (safe to ignore):", error);
        }
      }
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      ref={containerRef}
      className="flex items-center"
      style={{
        minWidth: "150px",
        minHeight: "30px",
      }}
    />
  );
}

