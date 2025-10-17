import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedParties from "@/components/FeaturedParties";
import TrustSection from "@/components/TrustSection";
import HostCTA from "@/components/HostCTA";
import Footer from "@/components/Footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

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
        <FeaturedParties
          searchQuery={searchQuery}
          selectedCity={selectedCity}
        />
        <TrustSection />
        <HostCTA />
      </main>
      <Footer />
    </div>
  );
}

