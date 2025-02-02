import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem("OPENAI_API_KEY");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("OPENAI_API_KEY", apiKey);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved successfully",
    });
  };

  return (
    <div className="fixed top-4 right-4 flex gap-2">
      <Input
        type="password"
        placeholder="Enter OpenAI API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="w-64"
      />
      <Button onClick={handleSave}>Save Key</Button>
    </div>
  );
};