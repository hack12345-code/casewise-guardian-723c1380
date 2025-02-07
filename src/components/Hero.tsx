
import { AIInput } from "./ui/ai-input";
import { Response } from "./Response";
import { Sectors } from "./Sectors";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import DisplayCards from "./ui/display-cards";
import { Cases } from "./Cases";
import { FAQs } from "./FAQs";
import { Footer } from "./Footer";

interface Prompt {
  text: string;
  response: string;
  caseTitle: string;
}

interface PromptUsage {
  lastPromptDate: string;
  promptCount: number;
}

export const Hero = () => {
  const [response, setResponse] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [caseCounter, setCaseCounter] = useState(1);
  const { toast } = useToast();

  // Check prompt usage on component mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedUsage = localStorage.getItem('promptUsage');
    let usage: PromptUsage;

    if (storedUsage) {
      usage = JSON.parse(storedUsage);
      // Reset count if it's a new day
      if (usage.lastPromptDate !== today) {
        usage = {
          lastPromptDate: today,
          promptCount: 0
        };
        localStorage.setItem('promptUsage', JSON.stringify(usage));
      }
    } else {
      usage = {
        lastPromptDate: today,
        promptCount: 0
      };
      localStorage.setItem('promptUsage', JSON.stringify(usage));
    }
  }, []);

  const checkPromptLimit = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const storedUsage = localStorage.getItem('promptUsage');
    
    if (storedUsage) {
      const usage: PromptUsage = JSON.parse(storedUsage);
      
      // If it's a new day, reset the count
      if (usage.lastPromptDate !== today) {
        localStorage.setItem('promptUsage', JSON.stringify({
          lastPromptDate: today,
          promptCount: 0
        }));
        return true;
      }
      
      // Check if user has reached their daily limit
      if (usage.promptCount >= 1) {
        toast({
          title: "Daily limit reached",
          description: "You've reached your daily prompt limit. Please upgrade to a paid plan for unlimited prompts.",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const updatePromptUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const storedUsage = localStorage.getItem('promptUsage');
    let usage: PromptUsage;

    if (storedUsage) {
      usage = JSON.parse(storedUsage);
      usage.lastPromptDate = today;
      usage.promptCount += 1;
    } else {
      usage = {
        lastPromptDate: today,
        promptCount: 1
      };
    }

    localStorage.setItem('promptUsage', JSON.stringify(usage));
  };

  const handleSubmit = async (caseDetails: string) => {
    if (!checkPromptLimit()) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPrompt: Prompt = {
        text: caseDetails,
        response: "",
        caseTitle: `Case ${caseCounter}`
      };
      
      setPrompts(prev => [...prev, newPrompt]);
      setCurrentPrompt(caseDetails);
      setResponse("");
      setHasResponse(true);
      setCaseCounter(prev => prev + 1);
      
      // Update prompt usage after successful submission
      updatePromptUsage();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = (index: number, newTitle: string) => {
    setPrompts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], caseTitle: newTitle };
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <div className={cn(
        "container mx-auto px-4 py-12 transition-all duration-500 ease-in-out",
        hasResponse ? "flex flex-col" : ""
      )}>
        <div className={cn(
          "text-center mb-12 max-w-4xl mx-auto transition-all duration-500",
          hasResponse ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100"
        )}>
          <h1 className="text-6xl font-bold text-[#1a1a1a] mb-6">
            <span className="text-7xl">Save</span>
          </h1>
          <h2 className="text-5xl font-bold text-[#1a1a1a] mb-6">
            Your Medical Practice
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get AI-powered guidance on preventing malpractice risks. Enter your case details
            and receive professional recommendations for safer patient care.
          </p>
        </div>
        
        <div className={cn(
          "transition-all duration-500",
          hasResponse ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        )}>
          <Sectors />
        </div>
        
        {hasResponse ? (
          <div className="flex h-[calc(100vh-200px)] gap-4">
            {/* Left Panel - 1/3 width */}
            <div className="w-1/3 flex flex-col bg-white rounded-lg shadow-sm border">
              {/* Prompts History */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {prompts.map((prompt, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{prompt.caseTitle}</h4>
                    </div>
                    <p className="text-sm text-gray-700">{prompt.text}</p>
                  </div>
                ))}
              </div>
              
              {/* Input Box */}
              <div className="p-4 border-t">
                <AIInput 
                  placeholder="Enter your case details here..."
                  minHeight={150}  // Increased height
                  maxHeight={250}  // Increased max height
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

            {/* Right Panel - 2/3 width */}
            <div className="w-2/3 bg-white rounded-lg shadow-sm border p-6 overflow-y-auto">
              <Response 
                response={response}
                prompt={currentPrompt}
                caseTitle={prompts[prompts.length - 1]?.caseTitle}
                onRename={(newTitle) => handleRename(prompts.length - 1, newTitle)}
              />
            </div>
          </div>
        ) : (
          <div className="mt-12">
            <AIInput 
              placeholder="Enter your case details here... Be specific about the patient's condition, your planned approach, and any concerns."
              minHeight={250}  // Increased height
              maxHeight={450}  // Increased max height
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto"
            />
          </div>
        )}

        {!hasResponse && (
          <>
            {/* Companies Bar */}
            <div className="mt-16 text-center">
              <p className="text-sm text-gray-500 mb-6">TRUSTED BY LEADING HEALTHCARE INSTITUTIONS</p>
              <div className="flex justify-center items-center gap-12 py-8 px-4 bg-white/50 rounded-lg backdrop-blur-sm">
                <span className="text-2xl font-bold text-gray-400">Mayo Clinic</span>
                <span className="text-2xl font-bold text-gray-400">Cleveland Clinic</span>
                <span className="text-2xl font-bold text-gray-400">Johns Hopkins</span>
                <span className="text-2xl font-bold text-gray-400">Mass General</span>
              </div>
            </div>

            {/* Display Cards */}
            <div className="mt-20">
              <DisplayCards />
            </div>
            
            {/* Cases Section */}
            <div className="mt-20">
              <Cases />
            </div>

            {/* FAQs Section */}
            <div className="mt-20">
              <FAQs />
            </div>

            {/* Footer */}
            <Footer />
          </>
        )}
      </div>
    </div>
  );
};
