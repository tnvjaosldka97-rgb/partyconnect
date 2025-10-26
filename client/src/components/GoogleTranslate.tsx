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
        // Silently ignore removeChild errors from Google Translate
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
        // Clear any existing content using innerHTML (safer than removeChild)
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
    } else if (window.google && window.google.translate && !translatorInitialized.current) {
      // Script already loaded, just initialize
      initGoogleTranslate();
    }

    return () => {
      // Restore original removeChild
      Node.prototype.removeChild = originalRemoveChild;
      
      // Minimal cleanup - don't try to remove children
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
      
      // Use innerHTML for safe cleanup
      if (containerRef.current) {
        try {
          containerRef.current.innerHTML = '';
        } catch (error) {
          // Ignore cleanup errors silently
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

