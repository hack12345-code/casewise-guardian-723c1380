
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
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
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <ApiKeyInput />
        <Hero />
      </main>
    </div>
  );
};

export default Index;
