
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16"> {/* Add semantic main tag and padding top to account for fixed navbar */}
        <h1 className="sr-only">Saver - Prevent Malpractice Lawsuits with AI</h1>
        <ApiKeyInput />
        <Hero />
      </main>
    </div>
  );
};

export default Index;
