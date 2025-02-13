
import { CornerRightUp, Mic, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Avatar } from "@/components/ui/avatar";

export interface AIInputProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  onSubmit: (value: string) => void;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  value: string;
  setValue: (value: string) => void;
}

export interface AIChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatMessage({ role, content }: AIChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-3 p-4",
      role === 'assistant' ? "bg-gray-50" : ""
    )}>
      <Avatar className="h-8 w-8">
        <span className="text-xs">
          {role === 'assistant' ? 'AI' : 'You'}
        </span>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

export function AIInput({
  id = "ai-input",
  placeholder = "",
  minHeight = 52,
  maxHeight = 200,
  onSubmit,
  className,
  isLoading = false,
  disabled = false,
  value,
  setValue
}: AIInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onSubmit(value);
      }
    }
  };

  const handleSubmit = () => {
    if (!isLoading && value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          adjustHeight();
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        className="pr-20 resize-none"
        style={{ minHeight }}
      />
      <div className="absolute right-2 bottom-2 flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={disabled || isLoading}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <CornerRightUp className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
