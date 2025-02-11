import { useState, useEffect } from "react";
import { AIInput } from "./ui/ai-input";
import { Response } from "./Response";
import { Sectors } from "./Sectors";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import DisplayCards from "./ui/display-cards";
import { Cases } from "./Cases";
import { FAQs } from "./FAQs";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Prompt {
  text: string;
  response: string;
  caseTitle: string;
}

export const Hero = () => {
  const [response, setResponse] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [caseCounter, setCaseCounter] = useState(1);
  const [demoType, setDemoType] = useState<'regular' | 'report'>('regular');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedPrompt = localStorage.getItem('pendingPrompt');
    if (savedPrompt) {
      handleSubmit(savedPrompt);
      localStorage.removeItem('pendingPrompt');
    }
  }, []);

  const handleSubmit = async (caseDetails: string) => {
    if (!caseDetails.trim()) return;

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      localStorage.setItem('pendingPrompt', caseDetails);
      navigate('/signup');
      return;
    }

    setIsLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_status, prompt_count, last_prompt_date, case_count')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      const today = new Date().toISOString().split('T')[0];
      const isNewDay = !profile.last_prompt_date || profile.last_prompt_date < today;
      const hasActiveSubscription = profile.subscription_status === 'active';
      const isFreeUser = !hasActiveSubscription;

      if (isFreeUser && profile.case_count >= 1) {
        toast({
          title: "Case Limit Reached",
          description: "Free users can only have one case. Please upgrade to create more cases!",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (isFreeUser && !isNewDay && profile.prompt_count >= 1) {
        toast({
          title: "Daily Limit Reached",
          description: "Free users can only send one prompt per day. Upgrade for unlimited access!",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data: newChat, error: chatError } = await supabase
        .from('medical_chats')
        .insert({
          case_title: 'New Case',
          user_id: session.user.id
        })
        .select()
        .single();

      if (chatError) throw chatError;

      const { error: messageError } = await supabase
        .from('medical_messages')
        .insert({
          chat_id: newChat.id,
          content: caseDetails,
          role: 'user',
          user_id: session.user.id
        });

      if (messageError) throw messageError;

      navigate(`/chat/${newChat.id}`);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message,
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
    <div id="hero-section" className="min-h-screen bg-[#f8f9ff]">
      <div className={cn(
        "container mx-auto px-4 py-6 transition-all duration-500 ease-in-out",
        hasResponse ? "flex flex-col" : ""
      )}>
        <div className={cn(
          "text-center mb-8 max-w-4xl mx-auto transition-all duration-500",
          hasResponse ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100"
        )}>
          <h1 className="text-6xl font-bold text-[#1a1a1a] mb-4">
            Healthcare Workers,
          </h1>
          <h2 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#1877F2] to-[#9b87f5] bg-clip-text text-transparent whitespace-nowrap">
              Prevent Malpractice Lawsuits with AI Protection
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Enter your patient's case/condition, and our tailored AI will generate actionable guidance to prevent malpractice. Also, generate full reports or fixes for existing reports instantly.
          </p>
        </div>
        
        <div className={cn(
          "transition-all duration-500",
          hasResponse ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        )}>
          <Sectors />
        </div>

        <div className="mt-8">
          <AIInput 
            placeholder="Enter your case details here... Be specific about the patient's condition and any concerns."
            minHeight={250}
            maxHeight={450}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            className="max-w-3xl mx-auto"
          />
        </div>

        {hasResponse ? (
          <div className="flex min-h-[calc(100vh-4rem)] pt-8">
            <main className="flex-1">
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1">
                  <Card className="h-[calc(100vh-8rem)] p-6 overflow-y-auto">
                    <Response
                      response={
                        prompts.length > 0
                          ? prompts[prompts.length - 1].response
                          : ""
                      }
                      prompt={prompts.length > 0 ? prompts[prompts.length - 1].text : ""}
                      caseTitle={prompts[prompts.length - 1]?.caseTitle}
                      onRename={(newTitle) => handleRename(prompts.length - 1, newTitle)}
                    />
                  </Card>
                </div>

                <div className="col-span-2">
                  <Card className="h-[calc(100vh-8rem)]">
                    <div className="h-full flex flex-col">
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {prompts.map((prompt, index) => (
                          <div key={index} className="flex flex-col gap-4">
                            <div className="flex justify-end">
                              <div className="max-w-[80%] p-4 rounded-lg bg-blue-600 text-white">
                                <p className="text-sm whitespace-pre-wrap">{prompt.text}</p>
                                <span className="text-xs opacity-70 mt-2 block">
                                  {new Date().toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-start">
                              <div className="max-w-[80%] p-4 rounded-lg bg-gray-100">
                                <p className="text-sm whitespace-pre-wrap">{prompt.response}</p>
                                <span className="text-xs text-gray-500 mt-2 block">
                                  {new Date().toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t">
                        <AIInput
                          placeholder="Enter your case details here..."
                          minHeight={100}
                          maxHeight={200}
                          onSubmit={handleSubmit}
                          isLoading={isLoading}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </main>
          </div>
        ) : (
          <>
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500 mb-6">Following industry-leading standards</p>
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

            <div className="mt-20 mb-20">
              <div className="max-w-5xl mx-auto">
                <div className="flex justify-center mb-12">
                  <div className="flex w-fit rounded-full bg-muted p-1">
                    <button
                      onClick={() => setDemoType('regular')}
                      className={cn(
                        "relative px-6 py-2 text-sm transition-colors rounded-full",
                        demoType === 'regular'
                          ? "text-white"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="relative z-10">Regular Demo</span>
                      {demoType === 'regular' && (
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => setDemoType('report')}
                      className={cn(
                        "relative px-6 py-2 text-sm transition-colors rounded-full",
                        demoType === 'report'
                          ? "text-white"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="relative z-10">Report Demo</span>
                      {demoType === 'report' && (
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="aspect-video w-full bg-white rounded-xl shadow-lg overflow-hidden">
                  {demoType === 'regular' ? (
                    <iframe 
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/your-regular-demo-id"
                      title="Regular Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <iframe 
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/your-report-demo-id"
                      title="Report Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
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
