
import { MessageCircle, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  is_admin: boolean;
  created_at: string;
}

const Support = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentChatId) {
      // Subscribe to new messages
      const channel = supabase
        .channel('chat-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'support_messages',
            filter: `chat_id=eq.${currentChatId}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages((prev) => [...prev, newMessage]);
          }
        )
        .subscribe();

      // Fetch existing messages
      fetchMessages();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentChatId]);

  const fetchMessages = async () => {
    if (!currentChatId) return;

    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('chat_id', currentChatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const handleStartChat = async () => {
    try {
      // Create a new chat
      const { data: chatData, error: chatError } = await supabase
        .from('support_chats')
        .insert([{}])
        .select()
        .single();

      if (chatError) throw chatError;

      setCurrentChatId(chatData.id);
      setIsChatOpen(true);

      // Send welcome message
      const { error: messageError } = await supabase
        .from('support_messages')
        .insert([
          {
            chat_id: chatData.id,
            content: "Hello! How can I help you today?",
            is_admin: true
          }
        ]);

      if (messageError) throw messageError;
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChatId) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert([
          {
            chat_id: currentChatId,
            content: message,
            is_admin: false
          }
        ]);

      if (error) throw error;

      setMessage("");

      // Simulate admin response after a delay
      setTimeout(async () => {
        const { error: responseError } = await supabase
          .from('support_messages')
          .insert([
            {
              chat_id: currentChatId,
              content: "Thank you for your message. Our support team will get back to you shortly.",
              is_admin: true
            }
          ]);

        if (responseError) {
          console.error('Error sending auto-response:', responseError);
        }
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@save.com";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
            <p className="text-gray-600 text-lg">
              Our support team is here to help you 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <button
              onClick={handleStartChat}
              className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-4 border border-gray-100"
            >
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <h2 className="text-xl font-semibold">Live Chat</h2>
              <p className="text-gray-600 text-center">
                Start a conversation with our support team
              </p>
            </button>

            <button
              onClick={handleEmailSupport}
              className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-4 border border-gray-100"
            >
              <Mail className="w-8 h-8 text-blue-600" />
              <h2 className="text-xl font-semibold">Email Support</h2>
              <p className="text-gray-600 text-center">
                Send us an email and we'll get back to you
              </p>
            </button>
          </div>

          {isChatOpen && (
            <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
                <h3 className="font-semibold">Live Support</h3>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.is_admin
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
