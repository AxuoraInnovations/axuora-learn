"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Layers,
  Target,
  Youtube,
  Headphones,
  FileText,
  Paperclip,
  ArrowUp,
  Square,
  XIcon,
  StopCircle,
  Mic,
  Globe,
  BrainCog,
  FolderCode,
  Loader2,
  Command,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import * as React from "react";
import { GradualSpacing } from "@/components/ui/GradualSpacing";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
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
      const newHeight = Math.max(
        minHeight,
        Math.min(
          textarea.scrollHeight,
          maxHeight ?? Number.POSITIVE_INFINITY
        )
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
  /** Tailwind shadow/glow class for hover (e.g. hover glow color) */
  hoverGlowClass: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing
              ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showRing && isFocused && (
          <motion.span
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

/** Light-mode divider between toolbar buttons (prompt box style) */
function LightDivider() {
  return (
    <div className="relative h-6 w-[1.5px] mx-1 flex-shrink-0">
      <div
        className="absolute inset-0 bg-gradient-to-t from-transparent via-violet-400/50 to-transparent rounded-full"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 40%, 140% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, -40% 50%, 0% 40%)",
        }}
      />
    </div>
  );
}

/** Voice recording strip with timer and visualizer (light mode) */
function VoiceRecorderLight({
  isRecording,
  onStopRecording,
}: {
  isRecording: boolean;
  onStopRecording: (duration: number) => void;
}) {
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(0);
  timeRef.current = time;

  useEffect(() => {
    if (!isRecording) return;
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      onStopRecording(timeRef.current);
    };
  }, [isRecording, onStopRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isRecording) return null;
  return (
    <div className="flex flex-col items-center justify-center w-full py-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-sm text-slate-600">{formatTime(time)}</span>
      </div>
      <div className="w-full h-10 flex items-center justify-center gap-0.5 px-4">
        {[...Array(32)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-slate-400 animate-pulse"
            style={{
              height: `${Math.max(15, Math.random() * 100)}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export interface AnimatedAIChatLightProps {
  /** When true, fills container (flex-1 min-h-0) instead of min-h-screen. Use when embedding in chat intro. */
  embedded?: boolean;
  /** When true, only the type bar + command quick actions are shown (no greeting). Use for conversation view. */
  inputOnly?: boolean;
  /** When provided, send calls this with the message and clears input; no local typing state. */
  onSendMessage?: (message: string) => void;
  /** User's display name for time-based greeting (e.g. "Good morning, Alex") */
  userName?: string;
}

function getTimeBasedGreeting(): "Good morning" | "Good afternoon" | "Good evening" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Light mode version of the Animated AI Chat (21st.dev jatin-yadav05). Same layout and behavior, light theme. */
export function AnimatedAIChatLight({ embedded, inputOnly, onSendMessage, userName }: AnimatedAIChatLightProps = {}) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showThink, setShowThink] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const [inputFocused, setInputFocused] = useState(false);
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const commandSuggestions: CommandSuggestion[] = [
    {
      icon: <Layers className="w-4 h-4" />,
      label: "Flashcards",
      description: "Generate a set from any topic",
      prefix: "/flashcards",
      hoverGlowClass: "hover:shadow-[0_0_28px_rgba(139,92,246,0.5),0_0_14px_rgba(139,92,246,0.35),inset_0_0_20px_rgba(139,92,246,0.08)] hover:text-violet-900 transition-shadow duration-200",
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: "Full Marks",
      description: "Get feedback on your answer",
      prefix: "/fullmarks",
      hoverGlowClass: "hover:shadow-[0_0_28px_rgba(245,158,11,0.5),0_0_14px_rgba(245,158,11,0.35),inset_0_0_20px_rgba(245,158,11,0.08)] hover:text-amber-900 transition-shadow duration-200",
    },
    {
      icon: <Youtube className="w-4 h-4" />,
      label: "YouTube",
      description: "Extract transcript from a video",
      prefix: "/youtube",
      hoverGlowClass: "hover:shadow-[0_0_28px_rgba(239,68,68,0.5),0_0_14px_rgba(239,68,68,0.35),inset_0_0_20px_rgba(239,68,68,0.08)] hover:text-red-900 transition-shadow duration-200",
    },
    {
      icon: <Headphones className="w-4 h-4" />,
      label: "Audio lesson",
      description: "Listen & learn a topic",
      prefix: "/lesson",
      hoverGlowClass: "hover:shadow-[0_0_28px_rgba(16,185,129,0.5),0_0_14px_rgba(16,185,129,0.35),inset_0_0_20px_rgba(16,185,129,0.08)] hover:text-emerald-900 transition-shadow duration-200",
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Notes",
      description: "Summarize or quiz from notes",
      prefix: "/notes",
      hoverGlowClass: "hover:shadow-[0_0_28px_rgba(100,116,139,0.45),0_0_14px_rgba(100,116,139,0.28),inset_0_0_20px_rgba(100,116,139,0.06)] hover:text-slate-900 transition-shadow duration-200",
    },
  ];

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true);
      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) =>
        cmd.prefix.startsWith(value)
      );
      if (matchingSuggestionIndex >= 0) {
        setActiveSuggestion(matchingSuggestionIndex);
      } else {
        setActiveSuggestion(-1);
      }
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const commandButton = document.querySelector("[data-command-button]");
      if (
        commandPaletteRef.current &&
        !commandPaletteRef.current.contains(target) &&
        !commandButton?.contains(target)
      ) {
        setShowCommandPalette(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < commandSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev > 0 ? prev - 1 : commandSuggestions.length - 1
        );
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion];
          setValue(selectedCommand.prefix + " ");
          setShowCommandPalette(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    let trimmed = value.trim();
    if (!trimmed && files.length === 0 && attachments.length === 0) return;
    if (showSearch) trimmed = `[Search: ${trimmed}]`;
    else if (showThink) trimmed = `[Think: ${trimmed}]`;
    else if (showCanvas) trimmed = `[Canvas: ${trimmed}]`;
    if (onSendMessage) {
      onSendMessage(trimmed || "[Attachment]");
      setValue("");
      setFiles([]);
      setFilePreviews({});
      setAttachments([]);
      adjustHeight(true);
      return;
    }
    startTransition(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setValue("");
        setFiles([]);
        setFilePreviews({});
        setAttachments([]);
        adjustHeight(true);
      }, 3000);
    });
  };

  const hasContent = value.trim() !== "" || files.length > 0 || attachments.length > 0;
  const placeholder =
    showSearch ? "Search the web..." : showThink ? "Think deeply..." : showCanvas ? "Create on canvas..." : "Type your message here...";

  const processFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (isImage && file.size <= 10 * 1024 * 1024) {
      setFiles((prev) => [file]);
      const reader = new FileReader();
      reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
      reader.readAsDataURL(file);
    } else {
      setAttachments((prev) => [...prev, file.name]);
    }
  };

  const handleAttachFile = () => uploadInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (list?.length) {
      processFile(list[0]);
      e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    const file = files[index];
    if (file && filePreviews[file.name]) {
      setFilePreviews((prev) => {
        const next = { ...prev };
        delete next[file.name];
        return next;
      });
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    setShowThink(false);
  };
  const handleToggleThink = () => {
    setShowThink((prev) => !prev);
    setShowSearch(false);
  };
  const handleCanvasToggle = () => setShowCanvas((prev) => !prev);

  const handleStopRecording = (duration: number) => {
    setIsRecording(false);
    if (onSendMessage) onSendMessage(`[Voice message - ${duration} seconds]`);
  };

  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index];
    setValue(selectedCommand.prefix + " ");
    setShowCommandPalette(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full items-center justify-center text-slate-900 relative overflow-auto",
        embedded ? "flex-1 min-h-0 bg-transparent" : "min-h-screen bg-slate-50 overflow-hidden",
        !embedded && !inputOnly && "bg-white",
        inputOnly ? "p-4 pb-6" : "p-6"
      )}
    >
      {/* Light background orbs (hidden when embedded so parent gradient shows) */}
      {!embedded && !inputOnly && (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-300/20 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-300/15 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
      </div>
      )}

      <div className="w-full max-w-2xl mx-auto relative">
        <motion.div
          className={cn("relative z-10", inputOnly ? "space-y-4" : "space-y-12")}
          initial={{ opacity: 0, y: inputOnly ? 8 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: inputOnly ? 0.25 : 0.6, ease: "easeOut" }}
        >
          {!inputOnly && (
          <div className="text-center space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block min-w-0 overflow-x-auto"
            >
              <h1 className="pb-1 font-greeting text-5xl font-medium tracking-tight text-black sm:text-6xl whitespace-nowrap">
                <GradualSpacing
                  text={`${getTimeBasedGreeting()}${userName ? `, ${userName}` : ""}.`}
                  duration={0.4}
                  delayMultiple={0.03}
                  className="text-inherit font-greeting"
                />
              </h1>
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
          </div>
          )}

          {/* Typebar: liquid glass + morphism, white accent (preserve blur & depth) */}
          <motion.div
            className="relative rounded-3xl border border-white/60 bg-white/70 p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_8px_32px_rgba(0,0,0,0.08),0_2px_12px_rgba(0,0,0,0.05)] backdrop-blur-[24px] backdrop-saturate-[180%] transition-all duration-300"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatePresence>
              {showCommandPalette && (
                <motion.div
                  ref={commandPaletteRef}
                  className="absolute left-2 right-2 bottom-full mb-2 rounded-xl border border-white/55 bg-white/65 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_12px_40px_rgba(0,0,0,0.1)] backdrop-blur-[24px] z-50 overflow-hidden"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="py-1">
                    {commandSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.prefix}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                          activeSuggestion === index
                            ? "bg-slate-100 text-slate-900"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                        onClick={() => selectCommandSuggestion(index)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className="w-5 h-5 flex items-center justify-center text-slate-500">
                          {suggestion.icon}
                        </div>
                        <div className="font-medium">{suggestion.label}</div>
                        <div className="text-slate-400 text-xs ml-1">
                          {suggestion.prefix}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File previews row (images + attachment pills) */}
            {(files.length > 0 || attachments.length > 0) && !isRecording && (
              <div className="flex flex-wrap gap-2 p-0 pb-1">
                {files.map((file, index) =>
                  file.type.startsWith("image/") && filePreviews[file.name] ? (
                    <div key={file.name} className="relative group">
                      <button
                        type="button"
                        onClick={() => setSelectedImage(filePreviews[file.name])}
                        className="w-16 h-16 overflow-hidden rounded-xl border border-white/40 bg-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-violet-400"
                      >
                        <img src={filePreviews[file.name]} alt={file.name} className="h-full w-full object-cover" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="absolute top-1 right-1 rounded-full bg-slate-800/70 p-0.5 text-white hover:bg-slate-800"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null
                )}
                {attachments.map((name, index) => (
                  <div key={name} className="flex items-center gap-2 rounded-lg border border-white/40 bg-white/40 px-3 py-1.5 text-xs text-slate-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
                    <span>{name}</span>
                    <button type="button" onClick={() => removeAttachment(index)} className="text-slate-400 hover:text-slate-700">
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Textarea (hidden when recording) */}
            <div className={cn("transition-all duration-300", isRecording ? "h-0 overflow-hidden opacity-0" : "opacity-100")}>
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder={placeholder}
                containerClassName="w-full"
                className={cn(
                  "w-full min-h-[44px] px-3 py-2.5 text-base resize-none border-none",
                  "bg-transparent text-slate-900 placeholder:text-slate-400",
                  "focus:outline-none focus-visible:ring-0"
                )}
                style={{ overflow: "hidden" }}
                showRing={false}
              />
            </div>

            {/* Voice recorder strip */}
            <VoiceRecorderLight isRecording={isRecording} onStopRecording={handleStopRecording} />

            {/* Action row: Paperclip, Search, Think, Canvas, then Send/Mic/Stop */}
            <div className="flex items-center justify-between gap-2 p-0 pt-2">
              <div className={cn("flex items-center gap-1 transition-opacity duration-300", isRecording ? "opacity-0 invisible h-0" : "opacity-100 visible")}>
                <button
                  type="button"
                  onClick={handleAttachFile}
                  title="Upload image"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/55 text-slate-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_2px_8px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-colors hover:bg-white/75 hover:text-slate-900"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  ref={uploadInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <button
                  type="button"
                  data-command-button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCommandPalette((prev) => !prev);
                  }}
                  title="Commands"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/55 text-slate-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_2px_8px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-colors hover:bg-white/75 hover:text-slate-900",
                    showCommandPalette && "bg-white/70 text-slate-900"
                  )}
                >
                  <Command className="h-4 w-4" />
                </button>

                <LightDivider />

                <button
                  type="button"
                  onClick={handleToggleSearch}
                  className={cn(
                    "flex h-8 items-center gap-1 rounded-full border px-2 py-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all",
                    showSearch ? "border-sky-400/50 bg-sky-400/25 text-sky-600" : "border-white/50 bg-white/55 text-slate-600 hover:bg-white/75 hover:text-slate-900"
                  )}
                >
                  <Globe className={cn("w-4 h-4", showSearch && "text-sky-600")} />
                  <AnimatePresence>
                    {showSearch && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs overflow-hidden whitespace-nowrap text-sky-600"
                      >
                        Search
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <LightDivider />

                <button
                  type="button"
                  onClick={handleToggleThink}
                  className={cn(
                    "flex h-8 items-center gap-1 rounded-full border px-2 py-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all",
                    showThink ? "border-violet-400/50 bg-violet-400/25 text-violet-600" : "border-white/50 bg-white/55 text-slate-600 hover:bg-white/75 hover:text-slate-900"
                  )}
                >
                  <BrainCog className={cn("w-4 h-4", showThink && "text-violet-600")} />
                  <AnimatePresence>
                    {showThink && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs overflow-hidden whitespace-nowrap text-violet-600"
                      >
                        Think
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <LightDivider />

                <button
                  type="button"
                  onClick={handleCanvasToggle}
                  className={cn(
                    "flex h-8 items-center gap-1 rounded-full border px-2 py-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all",
                    showCanvas ? "border-amber-400/50 bg-amber-400/25 text-amber-600" : "border-white/50 bg-white/55 text-slate-600 hover:bg-white/75 hover:text-slate-900"
                  )}
                >
                  <FolderCode className={cn("w-4 h-4", showCanvas && "text-amber-600")} />
                  <AnimatePresence>
                    {showCanvas && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs overflow-hidden whitespace-nowrap text-amber-600"
                      >
                        Canvas
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <button
                type="button"
                title={isTyping ? "Stop" : isRecording ? "Stop recording" : hasContent ? "Send" : "Voice message"}
                onClick={() => {
                  if (isRecording) setIsRecording(false);
                  else if (hasContent) handleSendMessage();
                  else setIsRecording(true);
                }}
                disabled={isTyping && !hasContent}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-200",
                  isRecording && "border-white/50 bg-white/55 text-red-500 hover:bg-red-500/20 hover:text-red-600",
                  !isRecording && hasContent && "border-slate-700/30 bg-slate-900/95 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-slate-800",
                  !isRecording && !hasContent && "border-white/50 bg-white/55 text-slate-500 hover:bg-white/75 hover:text-slate-700"
                )}
              >
                {isTyping ? (
                  <Square className="h-4 w-4 fill-slate-900 animate-pulse" />
                ) : isRecording ? (
                  <StopCircle className="h-5 w-5 text-red-500" />
                ) : hasContent ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Image preview modal (light mode) */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-h-[80vh] max-w-[90vw] overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_25px_50px_rgba(0,0,0,0.15)] backdrop-blur-[24px]"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={selectedImage} alt="Preview" className="w-full max-h-[80vh] object-contain" />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute right-4 top-4 rounded-full border border-white/40 bg-white/50 p-2 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-xl hover:bg-white/70"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </motion.div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2">
            {commandSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.prefix}
                onClick={() => selectCommandSuggestion(index)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border border-white/50 bg-white/55 px-3 py-2 text-sm text-slate-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-200 hover:bg-white/70",
                  suggestion.hoverGlowClass
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {suggestion.icon}
                <span>{suggestion.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {!onSendMessage && (
      <AnimatePresence>
        {isTyping && (
          <motion.div
            className="fixed bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/40 bg-white/50 px-4 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_12px_40px_rgba(0,0,0,0.1)] backdrop-blur-[24px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex h-7 w-8 items-center justify-center rounded-full border border-white/40 bg-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] backdrop-blur-xl">
              <span className="text-xs font-medium text-slate-700">AI</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Thinking</span>
              <TypingDotsLight />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      )}

      {inputFocused && (
        <motion.div
          className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.04] bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 blur-[96px]"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 150,
            mass: 0.5,
          }}
        />
      )}
    </div>
  );
}

function TypingDotsLight() {
  return (
    <div className="flex items-center ml-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-slate-500 rounded-full mx-0.5"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [0.85, 1.1, 0.85],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: dot * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
