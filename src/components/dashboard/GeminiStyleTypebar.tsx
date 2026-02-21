"use client";

import { useState, useRef } from "react";
import { Plus, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GeminiStyleTypebarProps {
  placeholder?: string;
  onSendMessage?: (message: string) => void;
  className?: string;
}

export function GeminiStyleTypebar({
  placeholder = "Ask AxuoraLearn",
  onSendMessage,
  className,
}: GeminiStyleTypebarProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSendMessage?.(trimmed);
      setValue("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full max-w-2xl mx-auto flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden px-3 py-2 min-h-[56px]",
        className
      )}
    >
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Add"
      >
        <Plus className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-sm font-medium text-slate-600">Tools</span>
        <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base py-2 px-2"
      />
      <select
        className="shrink-0 text-sm font-medium text-slate-600 bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none py-1 pr-6"
        aria-label="Speed"
      >
        <option>Fast</option>
        <option>Thorough</option>
      </select>
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Voice input"
      >
        <Mic className="h-5 w-5" />
      </button>
      <button
        type="submit"
        disabled={!value.trim()}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
          value.trim() ? "bg-primary text-white hover:opacity-90" : "bg-slate-100 text-slate-400 cursor-not-allowed"
        )}
        aria-label="Send"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </svg>
      </button>
    </form>
  );
}
