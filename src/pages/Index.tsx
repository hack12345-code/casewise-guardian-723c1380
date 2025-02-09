
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Button as MovingButton } from "@/components/ui/moving-border";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        <div className="flex justify-center mb-8">
          <MovingButton
            borderRadius="1.75rem"
            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
          >
            Moving Border Button
          </MovingButton>
        </div>
        <ApiKeyInput />
        <Hero />
      </div>
    </div>
  );
};

export default Index;
