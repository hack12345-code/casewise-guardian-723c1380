
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden">
      <Navbar />
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        <ApiKeyInput />
        <Hero />
      </div>
    </div>
  );
};

export default Index;
