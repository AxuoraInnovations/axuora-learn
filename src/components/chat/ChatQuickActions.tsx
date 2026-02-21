"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Layers,
  Target,
  Youtube,
  Headphones,
  FileText,
  X,
  Loader2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type QuickActionId = "flashcards" | "fullmarks" | "youtube" | "lesson" | "notes";

export interface QuickActionFormState {
  topic?: string;
  count?: number;
  question?: string;
  answer?: string;
  rubric?: string;
  url?: string;
  notes?: string;
}

interface ChatQuickActionsProps {
  compact?: boolean;
  /** "row" = single row of icon+label buttons below input (image layout) */
  layout?: "grid" | "row";
  onOpenForm: (action: QuickActionId, state?: QuickActionFormState) => void;
}

const ACTIONS: {
  id: QuickActionId;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgLight: string;
}[] = [
  {
    id: "flashcards",
    label: "Flashcards",
    description: "Generate a set from any topic",
    icon: Layers,
    color: "text-violet-600",
    bgLight: "bg-violet-50 hover:bg-violet-100 border-violet-200",
  },
  {
    id: "fullmarks",
    label: "Full Marks",
    description: "Get feedback on your answer",
    icon: Target,
    color: "text-amber-600",
    bgLight: "bg-amber-50 hover:bg-amber-100 border-amber-200",
  },
  {
    id: "youtube",
    label: "YouTube",
    description: "Extract transcript from a video",
    icon: Youtube,
    color: "text-red-600",
    bgLight: "bg-red-50 hover:bg-red-100 border-red-200",
  },
  {
    id: "lesson",
    label: "Audio lesson",
    description: "Listen & learn a topic",
    icon: Headphones,
    color: "text-emerald-600",
    bgLight: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
  },
  {
    id: "notes",
    label: "Notes",
    description: "Summarize or quiz from notes",
    icon: FileText,
    color: "text-slate-600",
    bgLight: "bg-slate-50 hover:bg-slate-100 border-slate-200",
  },
];

/** Reference layout: 2x2 grid of white cards with title, description, arrow (new chat landing) */
export function QuickActionCards({ onOpenForm }: { onOpenForm: (id: QuickActionId) => void }) {
  const cardActions = ACTIONS.slice(0, 4);
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
      {cardActions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onOpenForm(action.id)}
            className="group relative flex flex-col items-start rounded-2xl border border-[#e5e7eb] bg-white p-5 text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-[#d1d5db]"
          >
            <span className="font-semibold text-[#1e293b]">{action.label}</span>
            <p className="mt-1.5 text-sm leading-snug text-[#6b7280]">{action.description}</p>
            <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#d1d5db] bg-white text-[#374151] transition-colors group-hover:border-[#9ca3af] group-hover:text-[#1e293b]">
              <ChevronRight className="h-4 w-4" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ChatQuickActions({ compact, layout = "grid", onOpenForm }: ChatQuickActionsProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[#64748b] mr-1">Quick:</span>
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onOpenForm(action.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-medium text-[#334155] shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              <Icon className="h-3.5 w-3.5" />
              {action.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (layout === "row") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onOpenForm(action.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-center text-sm font-medium text-[#64748b] mb-4">
        What would you like to do?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              type="button"
              onClick={() => onOpenForm(action.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`group flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${action.bgLight} border`}
            >
              <div className={`rounded-lg p-2.5 ${action.bgLight} border`}>
                <Icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-[#1e293b]">{action.label}</span>
                <p className="mt-0.5 text-xs text-[#64748b]">{action.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#94a3b8] transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-[#94a3b8]">
        Or type anything below — I can help with all of these and more.
      </p>
    </div>
  );
}

interface QuickActionPanelProps {
  action: QuickActionId;
  onClose: () => void;
  onSubmit: (state: QuickActionFormState) => void;
  loading?: boolean;
}

export function QuickActionPanel({ action, onClose, onSubmit, loading }: QuickActionPanelProps) {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [rubric, setRubric] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === "flashcards" && !topic.trim()) return;
    if (action === "fullmarks" && (!question.trim() || !answer.trim())) return;
    if (action === "youtube" && !url.trim()) return;
    if (action === "lesson" && !topic.trim()) return;
    if (action === "notes" && !notes.trim()) return;
    onSubmit({
      topic: topic || undefined,
      count,
      question: question || undefined,
      answer: answer || undefined,
      rubric: rubric || undefined,
      url: url || undefined,
      notes: notes || undefined,
    });
  };

  const config = ACTIONS.find((a) => a.id === action);
  const Icon = config?.icon ?? Sparkles;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="rounded-2xl border border-[#e2e8f0] bg-white shadow-lg overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-4 py-3 bg-[#f8fafc]">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold text-[#1e293b]">{config?.label ?? action}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#1e293b]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {action === "flashcards" && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Quadratic equations, Cell biology"
                  className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Number of cards</label>
                <input
                  type="number"
                  min={5}
                  max={30}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10) || 10)}
                  className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </>
          )}

          {action === "fullmarks" && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Question</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Paste the exam question..."
                  rows={2}
                  className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Your answer</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Paste your answer..."
                  rows={3}
                  className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Marking rubric (optional)</label>
                <textarea
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  placeholder="Paste the marking scheme if you have it..."
                  rows={1}
                  className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>
            </>
          )}

          {action === "youtube" && (
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1.5">YouTube URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
            </div>
          )}

          {action === "lesson" && (
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1.5">Topic for your lesson</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, Newton's Laws"
                className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
            </div>
          )}

          {action === "notes" && (
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1.5">Paste your notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste or type your notes. I can summarize, make flashcards, or quiz you."
                rows={5}
                className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                required
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Working...
                </>
              ) : (
                "Go"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
