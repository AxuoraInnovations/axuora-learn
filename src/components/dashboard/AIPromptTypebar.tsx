"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowRight, Paperclip } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

function useAutoResizeTextarea(minHeight: number, maxHeight = 300) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const t = textareaRef.current;
    if (t) t.style.height = `${minHeight}px`;
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const AI_MODELS = ["Gemini 2.5 Flash", "GPT-4 Mini", "Claude 3.5 Sonnet"];

export interface AIPromptTypebarProps {
  onSendMessage?: (message: string) => void;
  /** When set, typebar pre-fills with this value (e.g. from suggestion click) */
  prefill?: string;
  /** Called when prefill has been applied so parent can clear it */
  onPrefillConsumed?: () => void;
  className?: string;
}

export function AIPromptTypebar({ onSendMessage, prefill, onPrefillConsumed, className }: AIPromptTypebarProps) {
  const [value, setValue] = useState("");
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea(72, 300);

  useEffect(() => {
    if (prefill) {
      setValue(prefill);
      adjustHeight();
      onPrefillConsumed?.();
    }
  }, [prefill]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSendMessage?.(value.trim());
      setValue("");
      adjustHeight(true);
    }
  };

  const handleSend = () => {
    if (!value.trim()) return;
    onSendMessage?.(value.trim());
    setValue("");
    adjustHeight(true);
  };

  return (
    <div className={cn("w-full max-w-3xl py-4", className)}>
      <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-1.5">
        <div className="relative">
          <div className="relative flex flex-col">
            <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
              <textarea
                ref={textareaRef}
                value={value}
                placeholder="What can I do for you?"
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                className={cn(
                  "w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[72px] text-sm"
                )}
              />
            </div>
            <div className="h-14 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center">
              <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="flex items-center gap-1 h-8 pl-2 pr-2 text-xs rounded-md bg-transparent border border-black/10 dark:border-white/10 text-black dark:text-white focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    {AI_MODELS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
                  <label
                    className={cn(
                      "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                    )}
                    aria-label="Attach file"
                  >
                    <input type="file" className="hidden" />
                    <Paperclip className="w-4 h-4 transition-colors" />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!value.trim()}
                  className={cn(
                    "rounded-lg p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Send message"
                >
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 dark:text-white transition-opacity duration-200",
                      value.trim() ? "opacity-100" : "opacity-30"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
