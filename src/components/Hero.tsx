import { AIInput } from "./ui/ai-input";
import { Response } from "./Response";
import { Sectors } from "./Sectors";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export const Hero = () => {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (caseDetails: string) => {
    setIsLoading(true);
    try {
      // Simulate a brief loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll just set an empty response and trigger the transition
      setResponse("");
      setHasResponse(true);
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
          <h1 className="text-5xl font-bold text-[#1a1a1a] mb-6">
            Protect and <span className="text-blue-600">Guide</span>
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
        
        <div className={cn(
          "flex flex-col flex-grow transition-all duration-500",
          hasResponse ? "h-[calc(100vh-200px)]" : ""
        )}>
          {hasResponse && (
            <div className="flex-grow overflow-auto mb-8 animate-fade-in">
              <Response response={response} />
            </div>
          )}
          
          <div className={cn(
            "mt-12",
            hasResponse ? "mt-auto" : ""
          )}>
            <AIInput 
              placeholder="Enter your case details here... Be specific about the patient's condition, your planned approach, and any concerns."
              minHeight={200}
              maxHeight={400}
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};