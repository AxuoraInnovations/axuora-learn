"use client";

import { useState, useRef } from "react";
import { Camera, Paperclip, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DarkThinkAIStyleTypebarProps {
  placeholder?: string;
  appName?: string;
  onSendMessage?: (message: string) => void;
  className?: string;
}

export function DarkThinkAIStyleTypebar({
  placeholder = "How can AxuoraLearn help you today?",
  appName = "AxuoraLearn",
  onSendMessage,
  className,
}: DarkThinkAIStyleTypebarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSendMessage?.(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) {
        onSendMessage?.(trimmed);
        setValue("");
      }
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-white/10 bg-[#282828] overflow-hidden min-h-[140px] flex flex-col"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full min-h-[88px] resize-none bg-transparent border-0 outline-none text-white placeholder:text-gray-500 text-base px-4 pt-4 pb-2"
        />
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">{appName} V1.0 Study</span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1f1f1f] border border-white/10 px-3 py-1.5 text-sm text-white"
            >
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              Formal
              <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Attach image"
            >
              <Camera className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-xs text-gray-500">
          {appName} can make mistakes. Please double-check responses.
        </p>
        <p className="text-xs text-gray-500">Use <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">shift + return</kbd> for new line</p>
      </div>
    </div>
  );
}
