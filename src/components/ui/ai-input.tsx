
import { CornerRightUp, Mic, Loader2, Paperclip, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  onFileRemove?: (fileName: string) => void
  className?: string
  isLoading?: boolean
  disabled?: boolean
  pendingFiles?: File[]
}

export function AIInput({
  id = "ai-input",
  placeholder = "",
  minHeight = 100,
  maxHeight = 200,
  onSubmit,
  onFileSelect,
  onFileRemove,
  className,
  isLoading = false,
  disabled = false,
  pendingFiles = []
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
  const [isDragging, setIsDragging] = useState(false);

  const placeholders = [
    "I have a 45-year-old patient presenting with persistent fatigue, unintentional weight loss, and intermittent night sweats. Blood work shows mild anemia but no obvious signs of infection...",
    "A 62-year-old patient with a history of hypertension and hyperlipidemia reports episodic chest discomfort that is not triggered by exertion...",
    "A previously healthy 5-year-old presents with a persistent dry cough, low-grade fever, and mild wheezing. Chest X-ray is inconclusive...",
    "A 68-year-old patient, two weeks post-total knee replacement, reports increasing swelling, warmth, and discomfort around the surgical site. No systemic symptoms, but CRP is mildly elevated..."
  ];

  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    
    if (isTyping) {
      if (currentTextIndex < placeholders[placeholderIndex].length) {
        typingTimer = setTimeout(() => {
          setCurrentPlaceholder(prev => prev + placeholders[placeholderIndex][currentTextIndex]);
          setCurrentTextIndex(prev => prev + 1);
        }, 50);
      } else {
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (currentPlaceholder.length > 0) {
        typingTimer = setTimeout(() => {
          setCurrentPlaceholder(prev => prev.slice(0, -1));
        }, 30);
      } else {
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          setCurrentTextIndex(0);
          setIsTyping(true);
        }, 500);
      }
    }

    return () => clearTimeout(typingTimer);
  }, [currentTextIndex, isTyping, currentPlaceholder, placeholderIndex]);

  const handleReset = () => {
    if (!inputValue && !pendingFiles.length) return;
    onSubmit?.(inputValue);
    setInputValue("");
    adjustHeight(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isLoading) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileSelect?.(event);
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto">
        {pendingFiles.length > 0 && (
          <div className="bg-blue-50 p-2 rounded-md text-sm max-h-32 overflow-y-auto mb-2">
            <div className="space-y-2">
              {pendingFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white/50 p-1.5 rounded">
                  <span className="text-blue-600 flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    {file.name}
                  </span>
                  <button
                    onClick={() => onFileRemove?.(file.name)}
                    className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div 
          className={cn(
            "relative",
            isDragging && "after:absolute after:inset-0 after:border-2 after:border-dashed after:border-blue-400 after:bg-blue-50/50 after:rounded-3xl"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Textarea
            id={id}
            placeholder={placeholder || currentPlaceholder}
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
            multiple
          />

          {isLoading ? (
            <div className="absolute top-1/2 -translate-y-1/2 right-3">
              <Loader2 className="w-4 h-4 text-black/70 dark:text-white/70 animate-spin" />
            </div>
          ) : (
            <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-2">
              <div className="rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1">
                <Mic className="w-4 h-4 text-black/70 dark:text-white/70" />
              </div>
              <div
                className="rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-4 h-4 text-black/70 dark:text-white/70" />
              </div>
              {(inputValue || pendingFiles.length > 0) && (
                <button
                  onClick={handleReset}
                  type="button"
                  disabled={disabled || isLoading}
                  className={cn(
                    "rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1",
                    "transition-all duration-200",
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                  )}
                >
                  <CornerRightUp className="w-4 h-4 text-black/70 dark:text-white/70" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
