"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, ChevronDown, ArrowUp, X, FileText, Loader2, Check, Archive, Paperclip, Mic, Send } from "lucide-react";

/* --- ICONS --- */
export const Icons = {
  Logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="presentation" {...props}>
      <defs>
        <ellipse id="petal-pair" cx="100" cy="100" rx="90" ry="22" />
      </defs>
      <g fill="rgb(4, 84, 255)" fillRule="evenodd">
        <use href="#petal-pair" transform="rotate(0 100 100)" />
        <use href="#petal-pair" transform="rotate(45 100 100)" />
        <use href="#petal-pair" transform="rotate(90 100 100)" />
        <use href="#petal-pair" transform="rotate(135 100 100)" />
      </g>
    </svg>
  ),
  Plus,
  Thinking: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.3857 2.50977C14.3486 2.71054 17.5 5.98724 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 9.72386 2.72386 9.5 3 9.5C3.27614 9.5 3.5 9.72386 3.5 10C3.5 13.5899 6.41015 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.5225 13.7691 3.68312 10.335 3.50879L10 3.5L9.89941 3.49023C9.67145 3.44371 9.5 3.24171 9.5 3C9.5 2.72386 9.72386 2.5 10 2.5L10.3857 2.50977ZM10 5.5C10.2761 5.5 10.5 5.72386 10.5 6V9.69043L13.2236 11.0527C13.4706 11.1762 13.5708 11.4766 13.4473 11.7236C13.3392 11.9397 13.0957 12.0435 12.8711 11.9834L12.7764 11.9473L9.77637 10.4473C9.60698 10.3626 9.5 10.1894 9.5 10V6C9.5 5.72386 9.72386 5.5 10 5.5ZM3.66211 6.94141C4.0273 6.94159 4.32303 7.23735 4.32324 7.60254C4.32324 7.96791 4.02743 8.26446 3.66211 8.26465C3.29663 8.26465 3 7.96802 3 7.60254C3.00021 7.23723 3.29676 6.94141 3.66211 6.94141ZM4.95605 4.29395C5.32146 4.29404 5.61719 4.59063 5.61719 4.95605C5.6171 5.3214 5.3214 5.61709 4.95605 5.61719C4.59063 5.61719 4.29403 5.32146 4.29395 4.95605C4.29395 4.59057 4.59057 4.29395 4.95605 4.29395ZM7.60254 3C7.96802 3 8.26465 3.29663 8.26465 3.66211C8.26446 4.02743 7.96791 4.32324 7.60254 4.32324C7.23736 4.32302 6.94159 4.0273 6.94141 3.66211C6.94141 3.29676 7.23724 3.00022 7.60254 3Z" />
    </svg>
  ),
  SelectArrow: ChevronDown,
  ArrowUp,
  X,
  FileText,
  Loader2,
  Check,
  Archive,
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10.3857 2.50977C14.3486 2.71054 17.5 5.98724 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 9.72386 2.72386 9.5 3 9.5C3.27614 9.5 3.5 9.72386 3.5 10C3.5 13.5899 6.41015 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.5225 13.7691 3.68312 10.335 3.50879L10 3.5L9.89941 3.49023C9.67145 3.44371 9.5 3.24171 9.5 3C9.5 2.72386 9.72386 2.5 10 2.5L10.3857 2.50977ZM10 5.5C10.2761 5.5 10.5 5.72386 10.5 6V9.69043L13.2236 11.0527C13.4706 11.1762 13.5708 11.4766 13.4473 11.7236C13.3392 11.9397 13.0957 12.0435 12.8711 11.9834L12.7764 11.9473L9.77637 10.4473C9.60698 10.3626 9.5 10.1894 9.5 10V6C9.5 5.72386 9.72386 5.5 10 5.5Z" />
    </svg>
  ),
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/* --- TYPES --- */
export interface AttachedFile {
  id: string;
  file: File;
  type: string;
  preview: string | null;
  uploadStatus: string;
  content?: string;
}

export interface PastedContent {
  id: string;
  content: string;
  timestamp: Date;
}

/* --- COMPONENTS --- */
interface FilePreviewCardProps {
  file: AttachedFile;
  onRemove: (id: string) => void;
}

const FilePreviewCard: React.FC<FilePreviewCardProps> = ({ file, onRemove }) => {
  const isImage = file.type.startsWith("image/") && file.preview;
  return (
    <div className="group relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-bg-300 bg-bg-200 transition-all hover:border-text-400 animate-fade-in">
      {isImage ? (
        <div className="relative h-full w-full">
          <img src={file.preview!} alt={file.file.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/0" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-bg-300 p-1.5">
              <Icons.FileText className="h-4 w-4 text-text-300" />
            </div>
            <span className="truncate text-[10px] font-medium uppercase tracking-wider text-text-400">
              {file.file.name.split(".").pop()}
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="truncate text-xs font-medium text-text-200" title={file.file.name}>
              {file.file.name}
            </p>
            <p className="text-[10px] text-text-500">{formatFileSize(file.file.size)}</p>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
      >
        <Icons.X className="h-3 w-3" />
      </button>
      {file.uploadStatus === "uploading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Icons.Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      )}
    </div>
  );
};

interface PastedContentCardProps {
  content: {
    id: string;
    content: string;
    timestamp: Date;
  };
  onRemove: (id: string) => void;
}

const PastedContentCard: React.FC<PastedContentCardProps> = ({ content, onRemove }) => (
  <div className="group relative flex h-28 w-28 flex-shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] animate-fade-in dark:border-[#30302E] dark:bg-[#20201F]">
    <div className="w-full overflow-hidden">
      <p className="line-clamp-4 whitespace-pre-wrap break-words font-mono text-[10px] leading-[1.4] text-[#9CA3AF] select-none">
        {content.content}
      </p>
    </div>
    <div className="mt-2 flex w-full items-center justify-between">
      <div className="inline-flex items-center justify-center rounded border border-[#E5E5E5] bg-white px-1.5 py-[2px] dark:border-[#404040] dark:bg-transparent">
        <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
          PASTED
        </span>
      </div>
    </div>
    <button
      type="button"
      onClick={() => onRemove(content.id)}
      className="absolute right-2 top-2 rounded-full border border-[#E5E5E5] bg-white p-[3px] text-[#9CA3AF] opacity-0 shadow-sm transition-colors hover:text-[#6B7280] group-hover:opacity-100 dark:border-[#404040] dark:bg-[#30302E] dark:hover:text-white"
    >
      <Icons.X className="h-2 w-2" />
    </button>
  </div>
);

interface Model {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onSelect: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModel, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex h-8 min-w-[4rem] items-center justify-center gap-1 rounded-xl px-3 pl-2.5 pr-2 font-base whitespace-nowrap text-xs transition duration-300 ease-[cubic-bezier(0.165,0.85,0.45,1)] active:scale-[0.98] shrink-0 ${
          isOpen
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <div className="font-ui inline-flex h-[14px] items-baseline gap-[3px] text-[14px] leading-none">
          <div className="flex items-center gap-[4px]">
            <div className="select-none font-medium whitespace-nowrap">{currentModel.name}</div>
          </div>
        </div>
        <div className="flex h-5 w-5 items-center justify-center opacity-75" style={{ width: "20px", height: "20px" }}>
          <Icons.SelectArrow className={`shrink-0 opacity-75 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>
      {isOpen && (
        <div className="absolute bottom-full right-0 z-50 mb-2 flex w-[260px] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl animate-fade-in">
          {models.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => {
                onSelect(model.id);
                setIsOpen(false);
              }}
              className="flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-slate-900">{model.name}</span>
                  {model.badge && (
                    <span
                      className={`rounded-full border px-1.5 py-[1px] text-[10px] font-medium ${
                        model.badge === "Upgrade"
                          ? "border-blue-200 bg-white text-blue-600"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {model.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">{model.description}</span>
              </div>
              {selectedModel === model.id && (
                <Icons.Check className="mt-1 h-4 w-4 text-blue-600" />
              )}
            </button>
          ))}
          <div className="mx-2 my-1 h-px bg-slate-100" />
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="text-[13px] font-semibold text-slate-900">More models</span>
            <Icons.SelectArrow className="-rotate-90 h-4 w-4 text-slate-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export interface ClaudeChatInputPayload {
  message: string;
  files: AttachedFile[];
  pastedContent: PastedContent[];
  model: string;
  isThinkingEnabled: boolean;
}

interface ClaudeChatInputProps {
  onSendMessage: (data: ClaudeChatInputPayload) => void;
  /** "intro" = ref layout: dark bar, attach left, placeholder, mic + send right */
  variant?: "default" | "intro";
}

export const ClaudeChatInput: React.FC<ClaudeChatInputProps> = ({ onSendMessage, variant = "default" }) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [pastedContent, setPastedContent] = useState<PastedContent[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState("sonnet-4.5");
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const models: Model[] = [
    { id: "opus-4.5", name: "Opus 4.5", description: "Most capable for complex work" },
    { id: "sonnet-4.5", name: "Sonnet 4.5", description: "Best for everyday tasks" },
    { id: "haiku-4.5", name: "Haiku 4.5", description: "Fastest for quick answers" },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 384) + "px";
    }
  }, [message]);

  const handleFiles = useCallback((newFilesList: FileList | File[]) => {
    const newFiles = Array.from(newFilesList).map((file) => {
      const isImage =
        file.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: isImage ? "image/unknown" : file.type || "application/octet-stream",
        preview: isImage ? URL.createObjectURL(file) : null,
        uploadStatus: "pending",
      };
    });
    setFiles((prev) => [...prev, ...newFiles]);
    setMessage((prev) => {
      if (prev) return prev;
      if (newFiles.length === 1) {
        const f = newFiles[0];
        if (f.type.startsWith("image/")) return "Analyzed image...";
        return "Analyzed document...";
      }
      return `Analyzed ${newFiles.length} files...`;
    });
    newFiles.forEach((f) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((p) => (p.id === f.id ? { ...p, uploadStatus: "complete" } : p))
        );
      }, 800 + Math.random() * 1000);
    });
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const pastedFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      e.preventDefault();
      handleFiles(pastedFiles);
      return;
    }
    // Handle large text paste
    const text = e.clipboardData.getData('text');
    if (text.length > 300) {
      e.preventDefault();
      const snippet = {
        id: Math.random().toString(36).substr(2, 9),
        content: text,
        timestamp: new Date()
      };
      setPastedContent(prev => [...prev, snippet]);

      if (!message) {
        setMessage("Analyzed pasted text...");
      }
    }
  };

  const handleSend = () => {
    if (!message.trim() && files.length === 0 && pastedContent.length === 0) return;
    onSendMessage({
      message,
      files,
      pastedContent,
      model: selectedModel,
      isThinkingEnabled,
    });
    setMessage("");
    setFiles([]);
    setPastedContent([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasContent = Boolean(message.trim() || files.length > 0 || pastedContent.length > 0);

  /* Intro variant: dark bar, attach left, "type your prompt here", mic + send right (ref image) */
  if (variant === "intro") {
    return (
      <div
        className="relative w-full font-sans"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {(files.length > 0 || pastedContent.length > 0) && (
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-3">
            {pastedContent.map((content) => (
              <PastedContentCard
                key={content.id}
                content={content}
                onRemove={(id) => setPastedContent((prev) => prev.filter((c) => c.id !== id))}
              />
            ))}
            {files.map((file) => (
              <FilePreviewCard
                key={file.id}
                file={file}
                onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 rounded-2xl bg-[#374151] px-3 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.15)] min-h-[3.25rem]">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#6b7280] bg-transparent text-[#d1d5db] hover:bg-[#4b5563] hover:text-white transition-colors"
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            placeholder="type your prompt here"
            className="min-h-[1.5rem] flex-1 resize-none bg-transparent text-base text-white placeholder:text-[#9ca3af] outline-none"
            rows={1}
            style={{ minHeight: "1.5rem" }}
          />
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#d1d5db] hover:bg-[#4b5563] hover:text-white transition-colors"
            aria-label="Voice input"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!hasContent}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4b5563] text-white hover:bg-[#6b7280] disabled:opacity-50 disabled:cursor-default transition-colors"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    );
  }

  /* Light type bar styling to match default new chat (AnimatedAIChatLight) */
  return (
    <div
      className="relative mx-auto w-full max-w-2xl font-sans text-left transition-all duration-300"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div
        className="relative z-10 mx-2 flex cursor-text flex-col items-stretch rounded-3xl border border-slate-200 bg-white font-sans antialiased transition-all duration-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.1)] focus-within:shadow-[0_8px_40px_rgba(0,0,0,0.12)] md:mx-0"
      >
        <div className="flex flex-col gap-2 p-2 pb-2 pt-3 text-left">
          {/* 1. Artifacts (Files & Pastes) - Rendered ABOVE text input */}
          {(files.length > 0 || pastedContent.length > 0) && (
            <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 px-1">
              {pastedContent.map(content => (
                <PastedContentCard
                  key={content.id}
                  content={content}
                  onRemove={id => setPastedContent(prev => prev.filter(c => c.id !== id))}
                />
              ))}
              {files.map(file => (
                <FilePreviewCard
                  key={file.id}
                  file={file}
                  onRemove={id => setFiles(prev => prev.filter(f => f.id !== id))}
                />
              ))}
            </div>
          )}
          {/* 2. Input Area – same min-height behavior as new chat */}
          <div className="relative mb-1">
            <div
              className={`max-h-96 w-full overflow-y-auto custom-scrollbar font-sans break-words pl-1 transition-[min-height] duration-300 ease-out ${
                isFocused ? "min-h-[7rem]" : "min-h-[2.5rem]"
              }`}
            >
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Type your prompt here"
                className="w-full bg-transparent border-0 outline-none text-slate-900 text-[16px] placeholder:text-slate-400 resize-none overflow-hidden py-0 leading-relaxed block font-normal antialiased"
                rows={1}
                autoFocus
                style={{ minHeight: "1.5em" }}
              />
            </div>
          </div>

          {/* 3. Action Bar – light theme icons */}
          <div className="flex w-full items-center gap-2">
            <div className="relative flex-1 flex items-center shrink min-w-0 gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center relative shrink-0 transition-colors duration-200 h-8 w-8 rounded-full active:scale-95 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                type="button"
                aria-label="Attach file"
              >
                <Icons.Plus className="w-5 h-5" />
              </button>
              <div className="group flex shrink min-w-8 !shrink-0">
                <button
                  onClick={() => setIsThinkingEnabled(!isThinkingEnabled)}
                  className={`transition-all duration-200 h-8 w-8 flex items-center justify-center rounded-full active:scale-95
                    ${isThinkingEnabled
                      ? "text-violet-600 bg-violet-500/10"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}
                  `}
                  aria-pressed={isThinkingEnabled}
                  aria-label="Extended thinking"
                >
                  <Icons.Thinking className="w-5 h-5" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 flex items-center gap-1 shadow-sm">
                    <span>Extended thinking</span>
                    <span className="text-slate-300" style={{ fontSize: "10px" }}>⇧+Ctrl+E</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex flex-row items-center min-w-0 gap-1">
              <div className="shrink-0 p-1 -m-1">
                <ModelSelector
                  models={models}
                  selectedModel={selectedModel}
                  onSelect={setSelectedModel}
                />
              </div>
              <div>
                <button
                  onClick={handleSend}
                  disabled={!hasContent}
                  className={`
                    inline-flex items-center justify-center relative shrink-0 transition-colors h-8 w-8 rounded-xl active:scale-95
                    ${hasContent
                      ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md"
                      : "bg-slate-200 text-slate-400 cursor-default"}
                  `}
                  type="button"
                  aria-label="Send message"
                >
                  <Icons.ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isDragging && (
        <div className="absolute inset-0 bg-slate-100/90 border-2 border-dashed border-slate-300 rounded-3xl z-50 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none">
          <Icons.Archive className="w-10 h-10 text-slate-600 mb-2 animate-bounce" />
          <p className="text-slate-700 font-medium">Drop files to upload</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="mt-3 text-left">
        <p className="text-xs text-slate-500">
          AI can make mistakes. Please check important information.
        </p>
      </div>
    </div>
  );
};

export default ClaudeChatInput;
