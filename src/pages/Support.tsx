import { MessageCircle, Mail, Phone, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

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
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setMessage("");
    
    // Simulate customer support response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thank you for your message. One of our support agents will be with you shortly.", 
        isUser: false 
      }]);
    }, 1000);
  };

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@save.com";
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
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

        {/* Live Chat Dialog */}
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

        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <Phone className="w-5 h-5" />
            <span>Or call us at: +1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;