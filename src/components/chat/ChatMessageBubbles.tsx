"use client";

import { useId, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThumbsUp, ThumbsDown, RotateCw, Copy, MoreHorizontal, Play, FileText, ChevronRight, CalendarPlus } from "lucide-react";
import { ShiningText } from "@/components/chat/ShiningText";
import { useAnimatedText } from "@/hooks/useAnimatedText";

/** Student-friendly typography: clear sections, bold headers; larger on desktop for comfort */
const aiMessageComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ children }) => (
    <h1 className="mt-6 mb-3 text-xl lg:text-2xl font-bold text-gray-900 tracking-tight first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-5 mb-2.5 text-lg lg:text-xl font-bold text-gray-900 border-l-4 border-blue-500/60 pl-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 mb-2 text-base lg:text-lg font-bold text-gray-800">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-3 mb-1.5 text-sm lg:text-base font-bold text-gray-800 uppercase tracking-wide">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-2.5 text-[15px] lg:text-base leading-relaxed lg:leading-7 text-gray-700">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">{children}</strong>
  ),
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
    return (
      <a
        href={href ?? "#"}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-blue-600 hover:text-blue-700 hover:underline underline-offset-2 font-medium break-all"
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="my-3 lg:my-4 space-y-1.5 lg:space-y-2 pl-5 list-disc text-gray-700 text-[15px] lg:text-base">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 lg:my-4 space-y-1.5 lg:space-y-2 pl-5 list-decimal text-gray-700 text-[15px] lg:text-base">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed lg:leading-7 pl-0.5">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 lg:my-4 pl-4 border-l-4 border-gray-300 text-gray-600 italic text-[15px] lg:text-base">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm lg:text-base font-medium text-gray-800">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-3 lg:my-4 overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm lg:text-base text-gray-800">
      {children}
    </pre>
  ),
};

const aiMessageProseClass =
  "max-w-none text-[#374151] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0";

function AnimatedMarkdownContent({ content }: { content: string }) {
  const displayContent = useAnimatedText(content, " ");
  return (
    <div className={aiMessageProseClass}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={aiMessageComponents}>
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}

/** Four-pointed star/diamond – vibrant blue, matches reference AI avatar */
function AIIcon() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 lg:h-8 lg:w-8 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
        fill={`url(#ai-diamond-${id})`}
        stroke="rgba(59, 130, 246, 0.4)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={`ai-diamond-${id}`} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** Extract first YouTube video ID from text (youtube.com/watch?v=ID or youtu.be/ID). */
function extractFirstYouTubeVideoId(text: string): string | null {
  const match = text.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export type YouTubeVideoItem = {
  id: string;
  title: string;
  channelTitle: string;
  description?: string;
  thumbnailUrl?: string;
};

export type StudyPlanEventItem = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  subject?: string;
};

/** Remove the raw JSON code block (and any trailing raw JSON) from message content so it doesn't show in the UI. */
function stripStudyPlanJsonBlock(content: string): string {
  let out = content;
  // Strip fenced block: ```json ... ``` or ``` ... ```
  out = out.replace(/```(?:json)?\s*[\s\S]*?"studyPlan"[\s\S]*?```/i, "");
  // Strip unfenced or truncated JSON from {"studyPlan": to end of content
  const studyPlanStart = out.search(/\{\s*"studyPlan"\s*:/i);
  if (studyPlanStart >= 0) out = out.slice(0, studyPlanStart);
  // Strip trailing fragment like }, { "title": "..." (leftover from truncated JSON)
  out = out.replace(/\}\s*,\s*\{\s*"title"\s*:[\s\S]*$/i, "");
  out = out.replace(/\n{3,}/g, "\n\n").trim();
  return out;
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function YouTubeVideosBlock({ videos }: { videos: YouTubeVideoItem[] }) {
  const featured = videos[0];
  const [playingId, setPlayingId] = useState(featured?.id ?? "");
  const carouselVideos = videos.slice(0, 6);
  const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
  const embedUrl = (id: string) => `https://www.youtube.com/embed/${id}?rel=0`;
  const selectedVideo = videos.find((v) => v.id === playingId) ?? featured;

  if (!featured) return null;

  return (
    <div className="mt-2 mb-4 space-y-4 max-w-2xl">
      {/* Single player: plays whichever video user picks from carousel */}
      <div className="rounded-lg border border-gray-200/80 bg-[#FAFAFA] overflow-hidden">
        <div className="aspect-video w-full bg-black">
          <iframe
            key={playingId}
            src={embedUrl(playingId || featured.id)}
            title={selectedVideo?.title ?? "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        {selectedVideo && (
          <div className="p-3 lg:p-4 space-y-1.5">
            <div className="flex items-start gap-2">
              <YouTubeIcon className="h-5 w-5 text-[#FF0000] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-gray-900 font-medium text-[15px] lg:text-base truncate pr-2">{selectedVideo.title}</p>
                <p className="text-gray-500 text-xs">youtube.com/watch</p>
                <a
                  href={watchUrl(selectedVideo.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium text-sm lg:text-base break-all"
                >
                  {selectedVideo.title}
                </a>
                {selectedVideo.description && (
                  <p className="text-gray-600 text-xs lg:text-sm mt-1.5 line-clamp-3 leading-relaxed">
                    {selectedVideo.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Carousel: click any thumbnail to play it in the embed above */}
      {carouselVideos.length > 0 && (
        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:thin]">
          {carouselVideos.map((v) => {
            const isActive = playingId === v.id;
            const btnClass = "flex-shrink-0 w-[200px] lg:w-[220px] snap-start group text-left rounded-lg transition-all" + (isActive ? " ring-2 ring-[#FF0000] ring-offset-2" : "");
            return (
            <button
              key={v.id}
              type="button"
              onClick={() => setPlayingId(v.id)}
              className={btnClass}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 border border-gray-200/80">
                <img
                  src={v.thumbnailUrl ?? `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="rounded-full bg-white/95 p-2 shadow-lg">
                    <Play className="h-6 w-6 text-[#FF0000] fill-[#FF0000]" />
                  </div>
                </div>
              </div>
              <p className="mt-1.5 text-xs lg:text-sm text-gray-700 font-medium line-clamp-2 leading-snug">{v.title}</p>
            </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AIMessageBubble({
  content,
  timestamp,
  youtubeVideos,
  studyPlanEvents,
  isLast,
  animateText,
  onReply,
  onGood,
  onBad,
  onRegenerate,
  onMore,
  onBeforeAddToCalendar,
}: {
  content: string;
  timestamp?: Date;
  /** When present, show featured video + carousel + explanation layout (after agent plan) */
  youtubeVideos?: YouTubeVideoItem[];
  /** When present, show Add to Google Calendar CTA (study plan flow) */
  studyPlanEvents?: StudyPlanEventItem[];
  isLast?: boolean;
  /** When true, typewriter animation for this message (use for last AI reply) */
  animateText?: boolean;
  onReply?: () => void;
  onGood?: () => void;
  onBad?: () => void;
  onRegenerate?: () => void;
  onMore?: () => void;
  /** Called before redirecting to Google OAuth so the chat can be restored on return */
  onBeforeAddToCalendar?: () => void;
}) {
  const time = timestamp ? formatTime(timestamp) : null;
  const hasYoutubeBlock = youtubeVideos && youtubeVideos.length > 0;
  const youtubeVideoId = !hasYoutubeBlock ? extractFirstYouTubeVideoId(content) : null;
  const hasStudyPlan = studyPlanEvents && studyPlanEvents.length > 0;
  const displayContent = hasStudyPlan ? stripStudyPlanJsonBlock(content) : content;

  const handleCopy = () => {
    void navigator.clipboard.writeText(content);
  };

  const handleAddToCalendar = async () => {
    if (!hasStudyPlan) return;
    try {
      const res = await fetch("/api/calendar/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: studyPlanEvents }),
      });
      const data = await res.json().catch(() => ({}));
      const pendingId = data?.pendingId;
      if (pendingId) {
        onBeforeAddToCalendar?.();
        window.location.href = `/api/auth/google?state=${encodeURIComponent(pendingId)}`;
      } else {
        window.alert("Could not start calendar setup. Please try again.");
      }
    } catch {
      window.alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex gap-3 lg:gap-4">
      <div className="flex h-8 w-8 lg:h-9 lg:w-9 shrink-0 items-center justify-center pt-0.5">
        <AIIcon />
      </div>
      <div className="min-w-0 flex-1">
        <div className="px-1 py-0.5 lg:px-0">
          {hasYoutubeBlock && <YouTubeVideosBlock videos={youtubeVideos} />}
          {animateText ? (
            <AnimatedMarkdownContent content={displayContent} />
          ) : (
            <div className={aiMessageProseClass}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={aiMessageComponents}>
                {displayContent}
              </ReactMarkdown>
            </div>
          )}
          {hasYoutubeBlock && youtubeVideos.length > 1 && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              <YouTubeIcon className="h-3.5 w-3.5 text-[#FF0000]" />
              <span>youtube +{youtubeVideos.length - 1}</span>
            </div>
          )}
          {!hasYoutubeBlock && youtubeVideoId && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200/80 bg-black/5 aspect-video max-w-xl">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
          {hasStudyPlan && (
            <div className="mt-6 max-w-md">
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80">
                  <h4 className="text-sm font-semibold text-gray-900">Add to Google Calendar</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    AxuoraLearn can add this study plan as events to your calendar. You’ll be asked to sign in with Google and allow access once.
                  </p>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCalendar}
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white bg-[#4285F4] hover:bg-[#3367D6] transition-colors shadow-sm"
                  >
                    <CalendarPlus className="h-4 w-4 shrink-0" />
                    Add to Google Calendar
                  </button>
                  <p className="text-xs text-gray-500">
                    If Google shows “Access blocked” or <strong>redirect_uri_mismatch</strong>, click “error details” on that page, copy the redirect URI shown there, and add it exactly (same protocol, host, port, path—no trailing slash) under your OAuth client’s “Authorized redirect URIs” in Google Cloud Console. Use the same origin you’re visiting (e.g. http://localhost:3000 or https://your-domain.com). If the app is in Testing, add your Google account as a test user.
                  </p>
                </div>
              </div>
            </div>
          )}
          {time && (
            <div className="mt-2 text-xs lg:text-sm text-[#9ca3af]">{time}</div>
          )}
        </div>
        {isLast && (
          <div className="mt-2 flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onGood?.()}
              className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#6b7280] transition-colors"
              aria-label="Good"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onBad?.()}
              className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#6b7280] transition-colors"
              aria-label="Bad"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onRegenerate?.()}
              className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#6b7280] transition-colors"
              aria-label="Regenerate"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#6b7280] transition-colors"
              aria-label="Copy"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                handleCopy();
                onMore?.();
              }}
              className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#6b7280] transition-colors"
              aria-label="More"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function UserMessageBubble({
  content,
  timestamp,
  displayName,
  type = "text",
  voiceDuration,
  fileName,
}: {
  content: string;
  timestamp?: Date;
  displayName?: string;
  type?: "text" | "voice" | "file";
  voiceDuration?: string;
  fileName?: string;
}) {
  const time = timestamp ? formatTime(timestamp) : null;
  return (
    <div className="flex flex-row-reverse gap-3 lg:gap-4">
      <div className="flex max-w-[85%] lg:max-w-[88%] flex-col items-end">
        <div className="rounded-2xl rounded-tr-md bg-white px-4 py-3 lg:px-5 lg:py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          {type === "voice" && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary/30"
              >
                <Play className="h-5 w-5 ml-0.5" />
              </button>
              <div className="flex flex-1 items-center gap-2">
                <div className="flex items-end gap-0.5 h-5">
                  {[10, 14, 8, 16, 12, 18, 10, 14].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-primary/50"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-[#64748b]">{voiceDuration ?? "0:00"}</span>
              </div>
            </div>
          )}
          {(type === "file" || fileName) && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-[#e2e8f0]">
                <FileText className="h-5 w-5 text-[#64748b]" />
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-medium text-[#1e293b]">{fileName}</p>
                <p className="text-xs text-[#64748b]">{content || "Attachment"}</p>
              </div>
            </div>
          )}
          {type === "text" && (
            <div className="whitespace-pre-wrap text-sm lg:text-base leading-relaxed lg:leading-7 text-[#374151]">{content}</div>
          )}
          {time && (
            <div className="mt-2 flex justify-end text-xs lg:text-sm text-[#9ca3af]">{time}</div>
          )}
        </div>
      </div>
    </div>
  );
}

const SHINING_CLASS =
  "inline-block bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base font-normal text-transparent";

export type TypingPhase = "thinking" | "reading" | "youtube" | "preparing" | "researching";

export function TypingIndicator({
  phase = "thinking",
  researching,
  studyPlanFlow,
}: {
  phase?: TypingPhase;
  researching?: boolean;
  studyPlanFlow?: boolean;
} = {}) {
  const label =
    phase === "youtube"
      ? studyPlanFlow
        ? "Building your schedule..."
        : "Searching on Youtube"
      : phase === "reading"
        ? "Read User request"
        : phase === "preparing"
          ? "Preparing your answer..."
          : phase === "researching"
            ? "Researching on the web"
            : "AxuoraLearn is thinking";

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center pt-0.5">
        <AIIcon />
      </div>
      <div className="flex flex-col gap-1 px-1 py-2">
        <div className="flex items-baseline gap-0.5">
          <ShiningText text={label} className={SHINING_CLASS} />
          <span className="inline-flex text-gray-500 overflow-hidden" aria-hidden>
            <span className="animate-thinking-dots">......</span>
          </span>
        </div>
        {researching && phase !== "youtube" && (
          <ShiningText
            text="Researching on the web"
            className={SHINING_CLASS + " text-sm"}
          />
        )}
      </div>
    </div>
  );
}
