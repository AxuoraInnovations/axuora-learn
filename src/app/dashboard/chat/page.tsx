"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type ClaudeChatInputPayload } from "@/components/chat/ClaudeChatInput";
import { AIAssistantInterface } from "@/components/dashboard/AIAssistantInterface";
import { MinimalChatInputBar } from "@/components/dashboard/MinimalChatInputBar";
import {
  QuickActionPanel,
  type QuickActionId,
  type QuickActionFormState,
} from "@/components/chat/ChatQuickActions";
import {
  AIMessageBubble,
  UserMessageBubble,
  TypingIndicator,
  type TypingPhase,
  type YouTubeVideoItem,
} from "@/components/chat/ChatMessageBubbles";
import { AgentPlan, type AgentTask } from "@/components/chat/AgentPlan";
import {
  sendChatMessage,
  generateFlashcards,
  saveFlashcardSet,
  analyzeAnswer,
  extractYouTube,
  type AnalysisResult,
} from "@/lib/api";

export type StudyPlanEvent = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  subject?: string;
};
// Compatible with AIMessageBubble’s StudyPlanEventItem

const CHAT_RETURN_STORAGE_KEY = "axuora_chat_return";

type Message = {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  type?: "text" | "voice" | "file";
  voiceDuration?: string;
  fileName?: string;
  youtubeVideos?: YouTubeVideoItem[];
  studyPlanEvents?: StudyPlanEvent[];
};

function parseStudyPlanFromContent(content: string): StudyPlanEvent[] | undefined {
  const match = content.match(/```(?:json)?\s*\{[\s\S]*?"studyPlan"[\s\S]*?\}\s*```/);
  if (!match) return undefined;
  try {
    const jsonStr = match[0].replace(/```json?\s*|\s*```/g, "").trim();
    const data = JSON.parse(jsonStr) as { studyPlan?: StudyPlanEvent[] };
    const list = data?.studyPlan;
    if (Array.isArray(list) && list.length > 0 && list.every((e) => e?.title && e?.date)) {
      return list;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function formatAnalysisForChat(r: AnalysisResult): string {
  return [
    `**Score: ${r.score}/100**`,
    "",
    "**Strengths**",
    ...r.strengths.map((s) => `• ${s}`),
    "",
    "**What's missing**",
    ...r.missing.map((m) => `• ${m}`),
    "",
    "**How to improve**",
    ...r.improvements.map((i) => `• ${i}`),
    "",
    "**Model answer**",
    r.model_answer,
  ].join("\n");
}

export default function DashboardChatPage() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [quickAction, setQuickAction] = useState<QuickActionId | null>(null);
  const [quickActionLoading, setQuickActionLoading] = useState(false);
  const [displayName, setDisplayName] = useState<string>("there");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [typingPhase, setTypingPhase] = useState<TypingPhase>("thinking");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calendar = searchParams.get("calendar");
    if (!calendar || typeof window === "undefined") return;
    if (calendar === "success") {
      const count = searchParams.get("count");
      setFeedbackMessage(count ? `Added ${count} events to your Google Calendar.` : "Study plan added to your Google Calendar.");
    } else if (calendar === "no_events") {
      setFeedbackMessage("Session expired or the request couldn’t be completed. Please click “Add to Google Calendar” again from the study plan message.");
    } else if (calendar === "error" || calendar === "denied") {
      setFeedbackMessage(calendar === "denied" ? "Calendar access was denied." : "Could not add to Calendar. Please try again.");
    }
    const raw = sessionStorage.getItem(CHAT_RETURN_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Array<{ role: string; content: string; createdAt: string; [k: string]: unknown }>;
        if (Array.isArray(parsed) && parsed.length > 0) {
          const restored: Message[] = parsed.map((m) => ({
            ...m,
            role: m.role as "user" | "assistant",
            createdAt: new Date(m.createdAt),
            youtubeVideos: m.youtubeVideos as Message["youtubeVideos"],
            studyPlanEvents: m.studyPlanEvents as Message["studyPlanEvents"],
          }));
          setMessages(restored);
        }
      } catch {
        /* ignore */
      }
      sessionStorage.removeItem(CHAT_RETURN_STORAGE_KEY);
    }
    window.history.replaceState({}, "", "/dashboard/chat");
  }, [searchParams]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      const name =
        session?.user?.user_metadata?.full_name ||
        session?.user?.user_metadata?.name ||
        session?.user?.email?.split("@")[0];
      if (name) setDisplayName(name);
    });
  }, []);

  const handleSendMessage = async (data: ClaudeChatInputPayload) => {
    const userMessage = data.message || "Sent files / pasted content";
    const trimmed = userMessage.trim();

    // Slash commands: open quick action panel without sending a message
    if (trimmed === "/flashcards") {
      setQuickAction("flashcards");
      return;
    }
    if (trimmed === "/fullmarks") {
      setQuickAction("fullmarks");
      return;
    }
    if (trimmed === "/youtube") {
      setQuickAction("youtube");
      return;
    }
    if (trimmed === "/lesson") {
      setQuickAction("lesson");
      return;
    }
    if (trimmed === "/notes") {
      setQuickAction("notes");
      return;
    }

    const now = new Date();
    const hasFiles = (data.files?.length ?? 0) > 0;
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        createdAt: now,
        type: hasFiles ? "file" : "text",
        fileName: data.files?.[0]?.file?.name,
      },
    ]);
    setLoading(true);
    setTypingPhase("thinking");
    const isYoutubeFlow = /\b(help|learn|explain|understand)\b/i.test(trimmed);
    try {
      let lastMessageImages: Array<{ mimeType: string; data: string }> | undefined;
      if (data.files?.length) {
        const imageFiles = data.files.filter((f) => f.file.type.startsWith("image/"));
        if (imageFiles.length > 0) {
          const base64List = await Promise.all(
            imageFiles.map((f) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string;
                  const base64 = result.includes(",") ? result.split(",")[1] : result;
                  resolve(base64 ?? "");
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(f.file);
              })
            )
          );
          lastMessageImages = imageFiles.map((f, i) => ({
            mimeType: f.file.type || "image/png",
            data: base64List[i] ?? "",
          }));
        }
      }
      const result = await sendChatMessage(
        [...messages, { role: "user", content: userMessage }],
        "chat",
        lastMessageImages
      );
      const replyContent = typeof result === "string" ? result : result.reply;
      const videos = typeof result === "object" && result.youtubeVideos ? result.youtubeVideos : undefined;
      const studyPlanEvents = parseStudyPlanFromContent(replyContent);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyContent, createdAt: new Date(), youtubeVideos: videos, studyPlanEvents },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      const message = error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message,
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickActionSubmit = async (state: QuickActionFormState) => {
    const action = quickAction;
    if (!action) return;
    setQuickActionLoading(true);
    setQuickAction(null);

    const userLabel =
      action === "flashcards"
        ? `Generate flashcards: ${state.topic}`
        : action === "fullmarks"
          ? "Analyze my answer"
          : action === "youtube"
            ? `Extract transcript: ${state.url}`
            : action === "lesson"
              ? `Audio lesson: ${state.topic}`
              : "Summarize / quiz from notes";

    const now = new Date();
    setMessages((prev) => [...prev, { role: "user", content: userLabel, createdAt: now }]);

    try {
      if (action === "flashcards" && state.topic) {
        const cards = await generateFlashcards(state.topic, state.count ?? 10);
        const set = await saveFlashcardSet(
          state.topic,
          `Generated from chat: ${state.topic}`,
          cards
        );
        const list = cards
          .slice(0, 5)
          .map((c, i) => `${i + 1}. **${c.front}** → ${c.back}`)
          .join("\n");
        const more = cards.length > 5 ? `\n... and ${cards.length - 5} more.` : "";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I created **${cards.length} flashcards** on "${state.topic}".\n\n${list}${more}\n\nYou can review them from your dashboard when you're ready.`,
            createdAt: new Date(),
          },
        ]);
      } else if (action === "fullmarks" && state.question && state.answer) {
        const result = await analyzeAnswer(state.question, state.answer, state.rubric);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: formatAnalysisForChat(result), createdAt: new Date() },
        ]);
      } else if (action === "youtube" && state.url) {
        const data = await extractYouTube(state.url);
        const transcriptSnippet =
          typeof data.transcript === "string" && data.transcript.length > 400
            ? data.transcript.slice(0, 400) + "..."
            : data.transcript;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `**${data.title}**\n\nTranscript:\n\n${transcriptSnippet}\n\nYou can download the full transcript from the video page.`,
            createdAt: new Date(),
          },
        ]);
      } else if (action === "lesson" && state.topic) {
        const lessonResult = await sendChatMessage(
          [
            ...messages,
            { role: "user", content: userLabel },
            {
              role: "user",
              content: `Create a short audio-lesson script (text) for the topic: ${state.topic}. Structure it with an intro, key points, and a quick recap. Keep it concise so a student could read it in under 2 minutes.`,
            },
          ],
          "chat"
        );
        const lessonContent = typeof lessonResult === "string" ? lessonResult : lessonResult.reply;
        setMessages((prev) => [...prev, { role: "assistant", content: lessonContent, createdAt: new Date() }]);
      } else if (action === "notes" && state.notes) {
        const notesResult = await sendChatMessage(
          [
            ...messages,
            { role: "user", content: userLabel },
            {
              role: "user",
              content: `Here are my notes. Please: 1) Summarize the main ideas in a few bullet points, and 2) Suggest 2–3 practice questions I could test myself on.\n\n${state.notes}`,
            },
          ],
          "chat"
        );
        const notesContent = typeof notesResult === "string" ? notesResult : notesResult.reply;
        setMessages((prev) => [...prev, { role: "assistant", content: notesContent, createdAt: new Date() }]);
      }
    } catch (error) {
      console.error("Quick action error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again or ask me in the chat.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setQuickActionLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2) return;
    const last = messages[messages.length - 1];
    if (last.role !== "assistant") return;
    const withoutLastReply = messages.slice(0, -1);
    const lastUser = [...withoutLastReply].reverse().find((m) => m.role === "user");
    if (!lastUser) return;

    setMessages(withoutLastReply);
    setLoading(true);
    try {
      const result = await sendChatMessage(
        withoutLastReply.map((m) => ({ role: m.role, content: m.content })),
        "chat"
      );
      const replyContent = typeof result === "string" ? result : result.reply;
      const videos = typeof result === "object" && result.youtubeVideos ? result.youtubeVideos : undefined;
      const studyPlanEvents = parseStudyPlanFromContent(replyContent);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyContent, createdAt: new Date(), youtubeVideos: videos, studyPlanEvents },
      ]);
    } catch (error) {
      console.error("Regenerate error:", error);
      const message = error instanceof Error ? error.message : "Sorry, I couldn’t regenerate. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: message, createdAt: new Date() },
      ]);
    } finally {
      setLoading(false);
      setTypingPhase("thinking");
    }
  };

  const lastMsg = messages[messages.length - 1];
  const isYoutubeFlow =
    loading &&
    messages.length > 0 &&
    lastMsg?.role === "user" &&
    /\b(help|learn|explain|understand)\b/i.test(lastMsg.content ?? "");
  const studyPlanIntent = /\b(study\s*plan|schedule|calendar|exam\s*prep|prepare\s*for\s*exam|hours\s*per\s*day|add\s*to\s*(my\s*)?calendar)\b/i;
  const isStudyPlanFlow =
    loading &&
    messages.length > 0 &&
    lastMsg?.role === "user" &&
    messages.some((m) => m.role === "user" && studyPlanIntent.test(m.content ?? ""));

  useEffect(() => {
    if (!isYoutubeFlow && !isStudyPlanFlow) return;
    const t1 = setTimeout(() => setTypingPhase("reading"), 400);
    const t2 = setTimeout(() => setTypingPhase("youtube"), 1000);
    const t3 = setTimeout(() => setTypingPhase("preparing"), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isYoutubeFlow, isStudyPlanFlow]);

  const youtubePlanTasks: AgentTask[] = [
    {
      id: "1",
      title: "Read user request",
      description: "Understand what the user wants to learn or have explained",
      status: typingPhase === "thinking" ? "in-progress" : "completed",
      priority: "high",
      level: 0,
      dependencies: [],
      subtasks: [],
    },
    {
      id: "2",
      title: "Search YouTube",
      description: "Find relevant videos for the topic",
      status:
        typingPhase === "youtube"
          ? "in-progress"
          : typingPhase === "reading"
            ? "in-progress"
            : "pending",
      priority: "high",
      level: 0,
      dependencies: [],
      subtasks: [],
    },
    {
      id: "3",
      title: "Prepare answer",
      description: "Pick the best video and write the reply",
      status: typingPhase === "preparing" ? "in-progress" : typingPhase === "youtube" ? "pending" : "pending",
      priority: "medium",
      level: 0,
      dependencies: [],
      subtasks: [],
    },
  ];

  const studyPlanTasks: AgentTask[] = [
    {
      id: "1",
      title: "Understand your goals",
      description: "What exams and when",
      status: typingPhase === "thinking" ? "in-progress" : "completed",
      priority: "high",
      level: 0,
      dependencies: [],
      subtasks: [],
    },
    {
      id: "2",
      title: "Ask questions",
      description: "Subjects, hours per day, preferences",
      status:
        typingPhase === "youtube"
          ? "in-progress"
          : typingPhase === "reading"
            ? "in-progress"
            : "pending",
      priority: "high",
      level: 0,
      dependencies: [],
      subtasks: [],
    },
    {
      id: "3",
      title: "Build your schedule",
      description: "Create the study plan",
      status: typingPhase === "preparing" ? "in-progress" : typingPhase === "youtube" ? "pending" : "pending",
      priority: "high",
      level: 0,
      dependencies: [],
      subtasks: [],
    },
    {
      id: "4",
      title: "Ready for Calendar",
      description: "Add to Google Calendar when you grant permission",
      status: "pending",
      priority: "medium",
      level: 0,
      dependencies: [],
      subtasks: [],
    },
  ];

  const showFeedback = (text: string) => {
    setFeedbackMessage(text);
    setTimeout(() => setFeedbackMessage(null), 2000);
  };

  useEffect(() => {
    if (loading) {
      bottomSentinelRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [loading]);

  useEffect(() => {
    bottomSentinelRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messages.length]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex min-h-full flex-col">
      {!hasMessages ? (
        /* New chat: dark ThinkAI-style intro (full-bleed dark background) */
        <div className="flex flex-1 flex-col min-h-full min-w-0">
          <div className="flex flex-1 flex-col overflow-y-auto relative min-h-0">
            <AIAssistantInterface
              userName={displayName}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      ) : (
        /* Conversation: same background as intro – no box around AI messages */
        <>
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#F7F7F7]">
            {feedbackMessage && (
              <div className="shrink-0 px-6 py-2 text-center text-sm text-gray-600 bg-gray-100/90 border-b border-gray-200/80 animate-fade-in">
                {feedbackMessage}
              </div>
            )}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 p-6 lg:p-8">
              <div className="mx-auto max-w-3xl lg:max-w-4xl space-y-6 lg:space-y-8">
                {messages.map((msg, i) =>
                  msg.role === "assistant" ? (
                    <AIMessageBubble
                      key={i}
                      content={msg.content}
                      timestamp={msg.createdAt}
                      youtubeVideos={msg.youtubeVideos}
                      studyPlanEvents={msg.studyPlanEvents}
                      isLast={i === messages.length - 1 && !loading}
                      animateText={i === messages.length - 1 && !loading}
                      onBeforeAddToCalendar={() => {
                        const payload = messages.map((m) => ({
                          ...m,
                          createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
                        }));
                        sessionStorage.setItem(CHAT_RETURN_STORAGE_KEY, JSON.stringify(payload));
                      }}
                      onGood={() => showFeedback("Thanks for your feedback!")}
                      onBad={() => showFeedback("Feedback recorded.")}
                      onRegenerate={handleRegenerate}
                    />
                  ) : (
                    <UserMessageBubble
                      key={i}
                      content={msg.content}
                      timestamp={msg.createdAt}
                      displayName={displayName}
                      type={msg.type ?? "text"}
                      fileName={msg.fileName}
                    />
                  )
                )}
                {loading && (
                  <TypingIndicator phase={typingPhase} studyPlanFlow={isStudyPlanFlow && !isYoutubeFlow} />
                )}
                {loading && isYoutubeFlow && (
                  <div className="mt-4 max-w-xl">
                    <AgentPlan tasks={youtubePlanTasks} />
                  </div>
                )}
                {loading && isStudyPlanFlow && !isYoutubeFlow && (
                  <div className="mt-4 max-w-xl">
                    <AgentPlan tasks={studyPlanTasks} />
                  </div>
                )}
                <div ref={bottomSentinelRef} className="h-0 w-full shrink-0" aria-hidden />
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center w-full py-4 lg:py-6 px-4 min-h-0">
              <MinimalChatInputBar
                placeholder="Ask anything"
                onSendMessage={handleSendMessage}
              />
              <p className="text-xs text-gray-500 mt-3 text-center">
                AxuoraLearn can sometimes produce inaccurate responses, so double-checking is crucial.
              </p>
            </div>
          </div>
          {quickAction && (
            <QuickActionPanel
              action={quickAction}
              onClose={() => setQuickAction(null)}
              onSubmit={handleQuickActionSubmit}
              loading={quickActionLoading}
            />
          )}
        </>
      )}
    </div>
  );
}
