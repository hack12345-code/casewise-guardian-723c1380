
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIInput } from "@/components/ui/ai-input";
import { SupportMessage } from "@/types/admin";

interface SupportChatDialogProps {
  chat: SupportMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onResolve: () => void;
}

export const SupportChatDialog = ({
  chat,
  isOpen,
  onClose,
  onSendMessage,
  onResolve,
}: SupportChatDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>Chat with {chat?.userName}</DialogTitle>
          <DialogDescription>
            Support conversation
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.sender === "admin"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t mt-4">
            <AIInput
              placeholder="Type your response..."
              minHeight={80}
              maxHeight={120}
              onSubmit={onSendMessage}
            />
            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant="default"
                onClick={onResolve}
              >
                Mark as Resolved
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
