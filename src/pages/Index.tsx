
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Hero } from "./Hero";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we have a scroll request in the state
    if (location.state?.scrollToHero) {
      const heroSection = document.querySelector('#hero-section');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="pt-16 flex-1">
        <ApiKeyInput />
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
