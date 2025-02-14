
import { MessageCircle, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Support = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const { toast } = useToast();

  const handleStartChat = () => {
    setIsChatOpen(true);
    setMessages([
      { 
        text: "Hello! How can I help you today?", 
        isUser: false 
      }
    ]);

    // Create a new support chat in localStorage
    const newChat = {
      id: Date.now().toString(),
      userId: "user-" + Date.now(), // Simple user ID generation
      userName: "Guest User",
      message: "Started a new chat",
      timestamp: new Date().toISOString(),
      status: "unread" as const,
      messages: [{
        id: Date.now().toString(),
        text: "Hello! How can I help you today?",
        sender: "admin" as const,
        timestamp: new Date().toISOString(),
      }]
    };

    const existingMessages = localStorage.getItem("support-messages");
    const supportMessages = existingMessages ? JSON.parse(existingMessages) : [];
    supportMessages.push(newChat);
    localStorage.setItem("support-messages", JSON.stringify(supportMessages));
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add message to chat window
    const newUserMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, newUserMessage]);
    setMessage("");
    
    // Update support messages in localStorage
    const existingMessages = localStorage.getItem("support-messages");
    if (existingMessages) {
      const supportMessages = JSON.parse(existingMessages);
      const currentChat = supportMessages[supportMessages.length - 1];
      
      currentChat.messages.push({
        id: Date.now().toString(),
        text: message,
        sender: "user" as const,
        timestamp: new Date().toISOString(),
      });

      currentChat.message = message; // Update last message preview
      localStorage.setItem("support-messages", JSON.stringify(supportMessages));
    }

    // Simulate admin response after a delay
    setTimeout(() => {
      const autoResponse = {
        text: "Thank you for your message. Our support team will get back to you shortly.",
        isUser: false
      };
      setMessages(prev => [...prev, autoResponse]);

      // Update support messages with auto-response
      const updatedMessages = JSON.parse(localStorage.getItem("support-messages") || "[]");
      const currentChat = updatedMessages[updatedMessages.length - 1];
      
      currentChat.messages.push({
        id: Date.now().toString(),
        text: autoResponse.text,
        sender: "admin" as const,
        timestamp: new Date().toISOString(),
      });

      localStorage.setItem("support-messages", JSON.stringify(updatedMessages));
    }, 1000);
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
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.text}
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
