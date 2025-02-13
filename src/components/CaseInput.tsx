
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CaseInputProps {
  onSubmit: (caseDetails: string) => void;
  isLoading: boolean;
}

export const CaseInput = ({ onSubmit, isLoading }: CaseInputProps) => {
  const [caseDetails, setCaseDetails] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkBlockStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_blocked')
        .eq('id', session.user.id)
        .single();

      if (!error && profile) {
        setIsBlocked(profile.is_blocked || false);
      }
    };

    checkBlockStatus();
  }, []);

  const handleSubmit = async () => {
    if (isBlocked) {
      toast({
        title: "Account Blocked",
        description: "Your account has been blocked from sending prompts. Please contact support for assistance.",
        variant: "destructive",
      });
      return;
    }

    if (caseDetails.trim().length < 10) {
      toast({
        title: "Case details too short",
        description: "Please provide more details about the case.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('medical-ai-chat', {
        body: { prompt: caseDetails }
      });

      if (error) throw error;

      onSubmit(data.response);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <Textarea
        placeholder={
          isBlocked 
            ? "Your account has been blocked from sending prompts. Please contact support."
            : "Enter your case details here... Be specific about the patient's condition, your planned approach, and any concerns."
        }
        className="min-h-[200px] p-4 text-lg resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        value={caseDetails}
        onChange={(e) => setCaseDetails(e.target.value)}
        disabled={isBlocked}
      />
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
        size="lg" 
        onClick={handleSubmit}
        disabled={isLoading || isBlocked}
      >
        {isLoading ? "Analyzing..." : "Get Professional Guidance"}
      </Button>
      {isBlocked && (
        <p className="text-sm text-red-500 text-center">
          Your account has been blocked from sending prompts. Please contact support for assistance.
        </p>
      )}
    </div>
  );
};
