
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  is_admin: boolean;
  created_at: string;
  user_id: string;
}

interface Chat {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  messages?: Message[];
}

const AdminSupport = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadChats();
    
    // Subscribe to new chats
    const channel = supabase
      .channel('admin_chats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_chats'
        },
        () => {
          loadChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      
      // Subscribe to new messages for the selected chat
      const channel = supabase
        .channel(`admin_chat:${selectedChat.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'support_messages',
            filter: `chat_id=eq.${selectedChat.id}`
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedChat]);

  const loadChats = async () => {
    const { data, error } = await supabase
      .from('support_chats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading chats:', error);
      return;
    }

    setChats(data || []);
  };

  const loadMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to send messages",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('support_messages')
        .insert({
          chat_id: selectedChat.id,
          user_id: session.user.id,
          content: message,
          is_admin: true
        });

      if (error) throw error;

      setMessage("");
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCloseChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('support_chats')
        .update({ status: 'closed' })
        .eq('id', chatId);

      if (error) throw error;

      loadChats();
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }

      toast({
        title: "Chat closed",
        description: "The support chat has been closed successfully.",
      });
    } catch (error: any) {
      console.error('Error closing chat:', error);
      toast({
        title: "Error",
        description: "Failed to close chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Support Dashboard</h1>
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4">
            <Card className="p-4 h-[calc(100vh-200px)] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Active Chats</h2>
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedChat?.id === chat.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white hover:bg-gray-50'
                    } border`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">User ID: {chat.user_id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(chat.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          chat.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {chat.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          <div className="col-span-8">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Chat with {selectedChat.user_id}
                    </h2>
                    <Button
                      variant="destructive"
                      onClick={() => handleCloseChat(selectedChat.id)}
                      disabled={selectedChat.status === 'closed'}
                    >
                      Close Chat
                    </Button>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.is_admin
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {msg.content}
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={selectedChat.status === 'closed'}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={selectedChat.status === 'closed'}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a chat to view the conversation
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
