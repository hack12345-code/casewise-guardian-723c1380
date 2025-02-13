
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { AIInput, AIChatMessage } from "@/components/ui/ai-input";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";

interface ChatMessage {
  id: string;
  created_at: string;
  content: string;
  role: 'user' | 'assistant';
  chat_id: string;
  user_id: string;
}

const Chat = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { caseId } = useParams<{ caseId: string }>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_blocked')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setIsBlocked(profile.is_blocked || false);
        }
      }
    };

    getProfile();
  }, []);

  useEffect(() => {
    if (caseId) {
      setChatId(caseId);
      fetchMessages(caseId);
    }
  }, [caseId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (chatId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Add type assertion to ensure role is correct
        const typedMessages = (data || []).map(msg => ({
          ...msg,
          role: msg.role as 'user' | 'assistant'
        }));
        setMessages(typedMessages);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (input: string) => {
    if (!input.trim() || !chatId) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Session expired",
        description: "Please login again to continue.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (isBlocked) {
      toast({
        title: "Account Blocked",
        description: "Your account has been blocked from sending prompts. Please contact support for assistance.",
        variant: "destructive",
      });
      return;
    }

    try {
      const userMessage = {
        chat_id: chatId,
        content: input,
        role: 'user' as const,
        user_id: session.user.id
      };

      const { data: userMessageData, error: userMessageError } = await supabase
        .from('medical_messages')
        .insert([userMessage])
        .select();

      if (userMessageError) throw userMessageError;

      setMessages(prev => [...prev, userMessageData[0] as ChatMessage]);
      setInput('');

      const response = await fetch('https://bdyudlqxufggzdzolayb.supabase.co/functions/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'apikey': process.env.SUPABASE_ANON_KEY || ''
        },
        body: JSON.stringify({ message: input, chatId: chatId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const aiResponse = await response.json();

      const aiMessage = {
        chat_id: chatId,
        content: aiResponse.response,
        role: 'assistant' as const,
        user_id: session.user.id
      };

      const { data: aiMessageData, error: aiMessageError } = await supabase
        .from('medical_messages')
        .insert([aiMessage])
        .select();

      if (aiMessageError) throw aiMessageError;

      setMessages(prev => [...prev, aiMessageData[0] as ChatMessage]);
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleNewCase = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast({
        title: "Session expired",
        description: "Please login again to continue.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (isBlocked) {
      toast({
        title: "Account Blocked",
        description: "Your account has been blocked from sending prompts. Please contact support for assistance.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('medical_chats')
        .insert([{ user_id: session.user.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      navigate(`/cases/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error creating new case",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        {chatId ? (
          <Card className="h-full flex flex-col">
            <CardContent className="overflow-auto h-full">
              <ScrollArea className="h-full">
                <div className="flex flex-col space-y-4">
                  {messages.map((message) => (
                    <AIChatMessage key={message.id} role={message.role} content={message.content} />
                  ))}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <div className="p-4 border-t">
              <AIInput
                onSubmit={handleSendMessage}
                value={input}
                setValue={setInput}
                disabled={loading}
              />
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No case selected.
            </h2>
            <p className="text-gray-500 mb-4">
              Start a new case to begin the conversation.
            </p>
            <Button onClick={handleNewCase}>
              Start New Case
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
