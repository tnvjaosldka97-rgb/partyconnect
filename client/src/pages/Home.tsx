import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedParties from "@/components/FeaturedParties";
import TrustSection from "@/components/TrustSection";
import HostCTA from "@/components/HostCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedParties />
        <TrustSection />
        <HostCTA />
      </main>
      <Footer />
    </div>
  );
}

