import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedParties from "@/components/FeaturedParties";
import TrustSection from "@/components/TrustSection";
import HostCTA from "@/components/HostCTA";
import Footer from "@/components/Footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const featuredPartiesRef = useRef<HTMLDivElement>(null);

  // 검색어가 변경되면 파티 섹션으로 스크롤
  useEffect(() => {
    if (searchQuery && featuredPartiesRef.current) {
      featuredPartiesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />
      <main>
        <HeroSection />
        <div ref={featuredPartiesRef}>
          <FeaturedParties
            searchQuery={searchQuery}
            selectedCity={selectedCity}
          />
        </div>
        <TrustSection />
        <HostCTA />
      </main>
      <Footer />
    </div>
  );
}

