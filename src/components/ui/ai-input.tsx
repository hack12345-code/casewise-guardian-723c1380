
import { CornerRightUp, Mic, Loader2, Paperclip } from "lucide-react";
import { useState, useEffect, useRef } from "react"; // Added useRef to imports
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

interface AIInputProps {
  id?: string
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  onSubmit?: (value: string) => void
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  isLoading?: boolean
  disabled?: boolean
}

const placeholders = [
  "A 60-year-old male patient presents with chest discomfort that worsens after meals, with occasional nausea and a burning sensation...",
  "A 7-year-old boy has been experiencing lower right abdominal pain for the past 12 hours...",
  "A 19-year-old college student presents with excessive worry, difficulty concentrating, and frequent panic attacks...",
  "A 2-month-old infant presents with persistent crying, difficulty sleeping, and drawing up of the legs...",
  "A 47-year-old woman reports the appearance of dark, irregular spots on her cheeks and forehead over the past six months..."
];

export function AIInput({
  id = "ai-input",
  placeholder = "",
  minHeight = 100,
  maxHeight = 200,
  onSubmit,
  onFileSelect,
  className,
  isLoading = false,
  disabled = false
}: AIInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });
  const [inputValue, setInputValue] = useState("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    
    if (isTyping) {
      if (currentTextIndex < placeholders[placeholderIndex].length) {
        typingTimer = setTimeout(() => {
          setCurrentPlaceholder(prev => prev + placeholders[placeholderIndex][currentTextIndex]);
          setCurrentTextIndex(prev => prev + 1);
        }, 50); // Typing speed
      } else {
        setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Pause before starting to delete
      }
    } else {
      if (currentPlaceholder.length > 0) {
        typingTimer = setTimeout(() => {
          setCurrentPlaceholder(prev => prev.slice(0, -1));
        }, 30); // Deleting speed
      } else {
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          setCurrentTextIndex(0);
          setIsTyping(true);
        }, 500); // Pause before starting next sentence
      }
    }

    return () => clearTimeout(typingTimer);
  }, [currentTextIndex, isTyping, currentPlaceholder, placeholderIndex]);

  const handleReset = () => {
    if (!inputValue.trim()) return;
    onSubmit?.(inputValue);
    setInputValue("");
    adjustHeight(true);
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto">
        <Textarea
          id={id}
          placeholder={currentPlaceholder}
          className={cn(
            "max-w-xl bg-black/5 dark:bg-white/5 rounded-3xl pl-6 pr-24",
            "placeholder:text-black/50 dark:placeholder:text-white/50",
            "border-none ring-black/20 dark:ring-white/20",
            "text-black dark:text-white text-wrap",
            "overflow-y-auto resize-none",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "transition-[height] duration-100 ease-out",
            "leading-[1.3]",
            "text-sm",
            "py-[20px]",
            `min-h-[${minHeight}px]`,
            `max-h-[${maxHeight}px]`,
            "[&::-webkit-resizer]:hidden",
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleReset();
            }
          }}
          disabled={disabled || isLoading}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          className="hidden"
        />

        {isLoading ? (
          <div className="absolute top-1/2 -translate-y-1/2 right-3">
            <Loader2 className="w-4 h-4 text-black/70 dark:text-white/70 animate-spin" />
          </div>
        ) : (
          <>
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1 transition-all duration-200",
                inputValue ? "right-[4.5rem]" : "right-[3.5rem]"
              )}
            >
              <Mic className="w-4 h-4 text-black/70 dark:text-white/70" />
            </div>
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1 transition-all duration-200 cursor-pointer",
                inputValue ? "right-10" : "right-3"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4 text-black/70 dark:text-white/70" />
            </div>
            <button
              onClick={handleReset}
              type="button"
              disabled={disabled || isLoading}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 right-3",
                "rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1",
                "transition-all duration-200",
                inputValue 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-95 pointer-events-none",
                disabled ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              <CornerRightUp className="w-4 h-4 text-black/70 dark:text-white/70" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
