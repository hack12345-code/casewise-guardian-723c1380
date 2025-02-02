import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CaseInputProps {
  onSubmit: (caseDetails: string) => void;
  isLoading: boolean;
}

export const CaseInput = ({ onSubmit, isLoading }: CaseInputProps) => {
  const [caseDetails, setCaseDetails] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (caseDetails.trim().length < 10) {
      toast({
        title: "Case details too short",
        description: "Please provide more details about the case.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(caseDetails);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Textarea
        placeholder="Enter the case details here..."
        className="min-h-[200px] p-4 text-lg"
        value={caseDetails}
        onChange={(e) => setCaseDetails(e.target.value)}
      />
      <Button 
        className="w-full" 
        size="lg" 
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Get Guidance"}
      </Button>
    </div>
  );
};