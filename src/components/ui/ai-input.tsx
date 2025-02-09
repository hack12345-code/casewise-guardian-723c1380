
"use client";
import { CornerRightUp, Mic, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { MovingBorder } from "./moving-border";

interface AIInputProps {
  id?: string
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  onSubmit?: (value: string) => void
  className?: string
  isLoading?: boolean
}

export function AIInput({
  id = "ai-input",
  placeholder = "Type your message...",
  minHeight = 52,
  maxHeight = 200,
  onSubmit,
  className,
  isLoading = false
}: AIInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });
  const [inputValue, setInputValue] = useState("");

  const handleReset = () => {
    if (!inputValue.trim()) return;
    onSubmit?.(inputValue);
    setInputValue("");
    adjustHeight(true);
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto">
        <MovingBorder
          duration={4000}
          rx="20%"
          ry="20%"
          containerClassName="p-[1px] relative max-w-xl"
          className="overflow-hidden rounded-3xl w-full"
        >
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl w-full">
            <Textarea
              id={id}
              placeholder={placeholder}
              className={cn(
                "max-w-xl pl-6 pr-16",
                "placeholder:text-black/50 dark:placeholder:text-white/50",
                "border-none ring-0",
                "text-black dark:text-white text-wrap",
                "overflow-y-auto resize-none",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "transition-[height] duration-100 ease-out",
                "leading-[1.2] py-[16px]",
                `min-h-[${minHeight}px]`,
                `max-h-[${maxHeight}px]`,
                "[&::-webkit-resizer]:hidden",
                "bg-transparent"
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
              disabled={isLoading}
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
                    inputValue ? "right-10" : "right-3"
                  )}
                >
                  <Mic className="w-4 h-4 text-black/70 dark:text-white/70" />
                </div>
                <button
                  onClick={handleReset}
                  type="button"
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 right-3",
                    "rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1",
                    "transition-all duration-200",
                    inputValue 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-95 pointer-events-none"
                  )}
                >
                  <CornerRightUp className="w-4 h-4 text-black/70 dark:text-white/70" />
                </button>
              </>
            )}
          </div>
        </MovingBorder>
      </div>
    </div>
  );
}
