"use client";

import { useState, useRef } from "react";
import { Paperclip, Globe, Lightbulb, CalendarDays, MoreHorizontal, ArrowUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClaudeChatInputPayload, AttachedFile } from "@/components/chat/ClaudeChatInput";

export interface MinimalChatInputBarProps {
  placeholder?: string;
  onSendMessage?: (data: ClaudeChatInputPayload) => void;
  className?: string;
}

export function MinimalChatInputBar({
  placeholder = "Ask anything",
  onSendMessage,
  className,
}: MinimalChatInputBarProps) {
  const [value, setValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    const hasFiles = attachedFiles.length > 0;
    if (!trimmed && !hasFiles) return;
    onSendMessage?.({
      message: trimmed || (hasFiles ? `[Attached ${attachedFiles.length} file(s)]` : ""),
      files: [...attachedFiles],
      pastedContent: [],
      model: "sonnet-4.5",
      isThinkingEnabled: false,
    });
    setValue("");
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const hasContent = value.trim().length > 0 || attachedFiles.length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative w-full max-w-2xl lg:max-w-3xl mx-auto rounded-3xl overflow-hidden transition-all duration-300",
        "bg-white/90 backdrop-blur-xl",
        "border border-gray-200/80",
        "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
        "hover:border-gray-300/80 focus-within:border-gray-300/80",
        className
      )}
    >
      <div className="relative flex flex-col min-h-[3.5rem] lg:min-h-[4rem]">
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-3 pt-2 pb-0">
            {attachedFiles.map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
              >
                <span className="truncate max-w-[120px]">{f.file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="rounded-full p-0.5 hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                  aria-label="Remove file"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex-1 flex items-center gap-2 px-4 lg:px-5 py-3 lg:py-3.5 min-h-[52px] lg:min-h-[56px]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 min-w-0 resize-none bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-400 text-base lg:text-[17px] py-1.5 leading-relaxed lg:leading-7"
            style={{ minHeight: "1.5rem" }}
          />
        </div>
        <div className="flex items-center justify-between px-3 lg:px-4 pb-3 lg:pb-3.5 pt-0 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 lg:gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 lg:gap-2 rounded-full px-3 py-1.5 lg:px-3.5 lg:py-2 text-sm lg:text-base text-gray-600 bg-gray-100/80 hover:bg-gray-100 border-0 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              Deep Search
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 lg:gap-2 rounded-full px-3 py-1.5 lg:px-3.5 lg:py-2 text-sm lg:text-base text-gray-600 bg-gray-100/80 hover:bg-gray-100 border-0 transition-colors"
            >
              <Lightbulb className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              Reason
            </button>
            <button
              type="button"
              onClick={() => {
                onSendMessage?.({
                  message: "I want to create a study plan for my upcoming exams. Please ask me the questions you need (exam date, subjects, hours per day, etc.) to build my schedule so it can be added to my calendar.",
                  files: [],
                  pastedContent: [],
                  model: "sonnet-4.5",
                  isThinkingEnabled: false,
                });
              }}
              className="inline-flex items-center gap-1.5 lg:gap-2 rounded-full px-3 py-1.5 lg:px-3.5 lg:py-2 text-sm lg:text-base text-gray-600 bg-gray-100/80 hover:bg-gray-100 border-0 transition-colors"
            >
              <CalendarDays className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              Study Plan
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!hasContent}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
              hasContent
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.md"
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (!files?.length) return;
          const newFiles: AttachedFile[] = Array.from(files).map((file) => {
            const isImage = file.type.startsWith("image/");
            return {
              id: Math.random().toString(36).slice(2),
              file,
              type: file.type || "application/octet-stream",
              preview: isImage ? URL.createObjectURL(file) : null,
              uploadStatus: "complete",
            };
          });
          setAttachedFiles((prev) => [...prev, ...newFiles]);
          e.target.value = "";
        }}
      />
    </form>
  );
}
