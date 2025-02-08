
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

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedUsage = localStorage.getItem('promptUsage');
    let usage: PromptUsage;

    if (storedUsage) {
      usage = JSON.parse(storedUsage);
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
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail === 'savesuppo@gmail.com') {
      return true;
    }

    const today = new Date().toISOString().split('T')[0];
    const storedUsage = localStorage.getItem('promptUsage');
    
    if (storedUsage) {
      const usage: PromptUsage = JSON.parse(storedUsage);
      
      if (usage.lastPromptDate !== today) {
        localStorage.setItem('promptUsage', JSON.stringify({
          lastPromptDate: today,
          promptCount: 0
        }));
        return true;
      }
      
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
    if (localStorage.getItem('userEmail') === 'savesuppo@gmail.com') {
      return;
    }

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
        "container mx-auto px-4 py-6 transition-all duration-500 ease-in-out", // Changed py-12 to py-6
        hasResponse ? "flex flex-col" : ""
      )}>
        <div className={cn(
          "text-center mb-8 max-w-4xl mx-auto transition-all duration-500", // Changed mb-12 to mb-8
          hasResponse ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100"
        )}>
          <h1 className="text-6xl font-bold text-[#1a1a1a] mb-4"> {/* Changed mb-6 to mb-4 */}
            <span className="text-7xl">Save</span>
          </h1>
          <h2 className="text-5xl font-bold text-[#1a1a1a] mb-4"> {/* Changed mb-6 to mb-4 */}
            Your Medical Practice
          </h2>
          <p className="text-xl text-gray-600 mb-6"> {/* Changed mb-8 to mb-6 */}
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
            <div className="w-1/3 flex flex-col bg-white rounded-lg shadow-sm border">
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
              
              <div className="p-4 border-t">
                <AIInput 
                  placeholder="Enter your case details here..."
                  minHeight={150}
                  maxHeight={250}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

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
          <>
            <div className="mt-8">
              <AIInput 
                placeholder="Enter your case details here... Be specific about the patient's condition, your planned approach, and any concerns."
                minHeight={250}
                maxHeight={450}
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto"
              />
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500 mb-6">TRUSTED BY LEADING HEALTHCARE INSTITUTIONS</p>
              <div className="flex justify-between items-center px-16 py-8 bg-white/50 rounded-lg backdrop-blur-sm">
                <img 
                  src="/lovable-uploads/1510baf5-fa8b-42a8-9f74-ef904389fa4a.png" 
                  alt="HIPAA" 
                  className="h-20 object-contain"
                />
                <img 
                  src="/lovable-uploads/fdc5f2a1-dc7e-4165-80cd-67c6ec32dc13.png" 
                  alt="GDPR" 
                  className="h-20 object-contain"
                />
                <img 
                  src="/lovable-uploads/c9b981d9-8d96-48a5-9637-093c2dfee8a0.png" 
                  alt="HHS" 
                  className="h-20 object-contain"
                />
                <img 
                  src="/lovable-uploads/b4b50947-99f9-4652-8f8f-5d1ad9d1025a.png" 
                  alt="AMA" 
                  className="h-20 object-contain"
                />
                <img 
                  src="/lovable-uploads/64d59b40-6f92-4424-863b-4954432c53b1.png" 
                  alt="AHA" 
                  className="h-20 object-contain"
                />
              </div>
            </div>

            <div className="mt-12">
              <DisplayCards />
            </div>
            
            <div className="mt-20">
              <Cases />
            </div>

            <div className="mt-20">
              <FAQs />
            </div>

            <Footer />
          </>
        )}
      </div>
    </div>
  );
};
