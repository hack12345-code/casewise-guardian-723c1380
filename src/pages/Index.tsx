
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

const Index = () => {
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
