"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generateFlashcards,
  saveFlashcardSet,
  getFlashcardSets,
  getFlashcards,
  type FlashcardSet,
  type Flashcard,
} from "@/lib/api";
import { getDueCards } from "@/lib/spaced-repetition";
import { FlashcardReview } from "@/components/flashcards/FlashcardReview";
import { updateFlashcard } from "@/lib/api";
import { calculateNextReview, type Quality } from "@/lib/spaced-repetition";

export default function FlashcardsPage() {
  const router = useRouter();
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [reviewingSet, setReviewingSet] = useState<{ set: FlashcardSet; cards: Flashcard[] } | null>(null);

  useEffect(() => {
    loadSets();
  }, []);

  const loadSets = async () => {
    try {
      const data = await getFlashcardSets();
      setSets(data);
    } catch (error) {
      console.error("Failed to load sets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const flashcards = await generateFlashcards(topic, count);
      const set = await saveFlashcardSet(topic, `AI-generated flashcards for ${topic}`, flashcards);
      await loadSets();
      setShowGenerator(false);
      setTopic("");
    } catch (error) {
      console.error("Failed to generate flashcards:", error);
      alert("Failed to generate flashcards. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const startReview = async (set: FlashcardSet) => {
    try {
      const allCards = await getFlashcards(set.id);
      const dueCards = getDueCards(allCards.map(c => ({ ...c, next_review: new Date(c.next_review) })));
      
      if (dueCards.length === 0) {
        alert("No cards due for review!");
        return;
      }
      
      // Convert back to Flashcard type
      const flashcardsDue: Flashcard[] = dueCards.map(card => ({
        ...allCards.find(c => c.id === card.id)!,
      }));
      
      setReviewingSet({ set, cards: flashcardsDue });
    } catch (error) {
      console.error("Failed to start review:", error);
    }
  };

  const handleReviewComplete = async (results: { cardId: string; quality: Quality }[]) => {
    try {
      for (const result of results) {
        const card = reviewingSet?.cards.find(c => c.id === result.cardId);
        if (!card) continue;
        
        const updated = calculateNextReview(result.quality, {
          ...card,
          next_review: new Date(card.next_review),
        });
        
        await updateFlashcard(card.id, {
          ease_factor: updated.ease_factor,
          interval: updated.interval,
          repetitions: updated.repetitions,
          next_review: updated.next_review.toISOString(),
        });
      }
      
      setReviewingSet(null);
      loadSets();
    } catch (error) {
      console.error("Failed to save review results:", error);
    }
  };

  if (reviewingSet) {
    return (
      <div className="min-h-full bg-primary-bg p-6">
        <FlashcardReview
          cards={reviewingSet.cards}
          onComplete={handleReviewComplete}
          onExit={() => setReviewingSet(null)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-primary-bg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-primary-bg p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Flashcards</h1>
          <Button onClick={() => setShowGenerator(!showGenerator)}>
            <Plus className="mr-2 h-4 w-4" />
            Generate new set
          </Button>
        </div>

        {/* Generator */}
        <AnimatePresence>
          {showGenerator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            >
              <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Generate flashcards</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic">Topic or subject</Label>
                  <Input
                    id="topic"
                    placeholder="e.g. Quadratic equations, Cell biology, Shakespeare Macbeth..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={generating}
                  />
                </div>
                <div>
                  <Label htmlFor="count">Number of cards</Label>
                  <Input
                    id="count"
                    type="number"
                    min={5}
                    max={30}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    disabled={generating}
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleGenerate} disabled={generating || !topic.trim()}>
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>Generate cards</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowGenerator(false)} disabled={generating}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sets grid */}
        {sets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e5e7eb] bg-white py-16 text-center">
            <p className="text-lg font-medium text-[#333]">No flashcard sets yet</p>
            <p className="mt-2 text-sm text-[#666]">Generate your first set to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sets.map((set) => (
              <motion.div
                key={set.id}
                className="flex flex-col justify-between rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm hover:shadow-md"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a1a]">{set.title}</h3>
                  {set.description && (
                    <p className="mt-1 text-sm text-[#666]">{set.description}</p>
                  )}
                  {set.tags && set.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {set.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => startReview(set)}
                  className="mt-4 w-full"
                  size="sm"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start review
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
