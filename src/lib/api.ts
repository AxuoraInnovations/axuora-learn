import { createClient } from "@/lib/supabase/client";

export interface FlashcardSet {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  set_id: string;
  front: string;
  back: string;
  hint?: string;
  image_url?: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string;
  created_at: string;
}

export interface AnalysisResult {
  score: number;
  strengths: string[];
  missing: string[];
  improvements: string[];
  model_answer: string;
}

export async function generateFlashcards(topic: string, count = 10, difficulty = "medium") {
  const supabase = createClient();
  
  const { data, error } = await supabase.functions.invoke("generate-flashcards", {
    body: { topic, count, difficulty },
  });
  
  if (error) throw error;
  return data.flashcards as Array<{ front: string; back: string; hint?: string }>;
}

export async function saveFlashcardSet(title: string, description: string, flashcards: Array<{ front: string; back: string; hint?: string }>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");
  
  // Create set
  const { data: set, error: setError } = await supabase
    .from("flashcard_sets")
    .insert({ user_id: user.id, title, description })
    .select()
    .single();
  
  if (setError) throw setError;
  
  // Insert flashcards
  const { error: cardsError } = await supabase
    .from("flashcards")
    .insert(
      flashcards.map(card => ({
        set_id: set.id,
        front: card.front,
        back: card.back,
        hint: card.hint,
      }))
    );
  
  if (cardsError) throw cardsError;
  
  return set;
}

export async function getFlashcardSets() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");
  
  const { data, error } = await supabase
    .from("flashcard_sets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data as FlashcardSet[];
}

export async function getFlashcards(setId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("set_id", setId)
    .order("created_at", { ascending: true });
  
  if (error) throw error;
  return data as Flashcard[];
}

export async function updateFlashcard(id: string, updates: Partial<Flashcard>) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("flashcards")
    .update(updates)
    .eq("id", id);
  
  if (error) throw error;
}

export async function analyzeAnswer(question: string, answer: string, rubric?: string): Promise<AnalysisResult> {
  const supabase = createClient();
  
  const { data, error } = await supabase.functions.invoke("analyze-answer", {
    body: { question, answer, rubric },
  });
  
  if (error) throw error;
  
  // Save analysis to database
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("analyses").insert({
      user_id: user.id,
      question,
      answer,
      score: data.score,
      feedback: data,
    });
  }
  
  return data as AnalysisResult;
}

export async function extractYouTube(videoUrl: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.functions.invoke("extract-youtube", {
    body: { videoUrl },
  });
  
  if (error) throw error;
  return data;
}

const CHAT_REQUEST_TIMEOUT_MS = 60_000;

export async function sendChatMessage(
  messages: Array<{ role: string; content: string }>,
  feature = "chat",
  lastMessageImages?: Array<{ mimeType: string; data: string }>
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHAT_REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, feature, lastMessageImages: lastMessageImages ?? [] }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request took too long. Please try again or check your connection.");
    }
    throw err;
  }
  clearTimeout(timeoutId);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data.error ?? res.statusText;
    const details = data.details;
    const message =
      typeof details === "string" && details.length > 0
        ? `${typeof err === "string" ? err : "Error"}: ${details}`
        : typeof err === "string"
          ? err
          : "Chat request failed";
    throw new Error(message);
  }

  const reply = (data.reply as string) ?? "";
  const youtubeVideos = data.youtubeVideos as Array<{ id: string; title: string; channelTitle: string; description?: string; thumbnailUrl?: string }> | undefined;
  return youtubeVideos ? { reply, youtubeVideos } : reply;
}

export async function getUserProgress(userId: string, startDate: Date, endDate: Date) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split('T')[0])
    .lte("date", endDate.toISOString().split('T')[0])
    .order("date", { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function updateUserProgress(userId: string, updates: {
  study_time?: number;
  cards_reviewed?: number;
  lessons_completed?: number;
  quizzes_taken?: number;
  analyses_count?: number;
  topics?: string[];
}) {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  
  const { error } = await supabase
    .from("user_progress")
    .upsert({
      user_id: userId,
      date: today,
      ...updates,
    });
  
  if (error) throw error;
}
