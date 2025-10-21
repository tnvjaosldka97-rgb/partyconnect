import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Google Translate script 로드
    const addScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    // Google Translate 초기화 함수
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ko,es,fr,de,ja,zh-CN,zh-TW,pt,ru,ar",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // 스크립트가 이미 로드되었는지 확인
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      addScript();
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    return () => {
      // Cleanup
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      className="flex items-center scale-75 origin-right"
      style={{
        // Google Translate 위젯 스타일링 - 작게 표시
        filter: "invert(1) hue-rotate(180deg)",
        transform: "scale(0.85)",
        transformOrigin: "right center",
      }}
    />
  );
}

