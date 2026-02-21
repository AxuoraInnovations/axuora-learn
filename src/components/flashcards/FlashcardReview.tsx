"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, RotateCcw, Check, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateNextReview, type Quality } from "@/lib/spaced-repetition";
import type { Flashcard } from "@/lib/api";

interface FlashcardReviewProps {
  cards: Flashcard[];
  onComplete: (results: { cardId: string; quality: Quality }[]) => void;
  onExit: () => void;
}

export function FlashcardReview({ cards, onComplete, onExit }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<{ cardId: string; quality: Quality }[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-[#333]">No cards to review!</p>
        <Button onClick={onExit} className="mt-4">Back to sets</Button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const speak = (text: string) => {
    if (!audioEnabled || typeof window === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleQuality = (quality: Quality) => {
    setResults([...results, { cardId: currentCard.id, quality }]);
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onComplete(results);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && audioEnabled) {
      speak(currentCard.back);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onExit}>
            ← Back
          </Button>
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="rounded-lg p-2 text-[#666] hover:bg-[#f0f0f0]"
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
        <div className="text-sm text-[#666]">
          Card {currentIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card */}
      <div className="perspective-1000 relative h-[320px] w-full">
        <motion.div
          className="relative h-full w-full cursor-pointer"
          onClick={flipCard}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute flex h-full w-full flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-center text-xl font-medium text-[#1a1a1a]">{currentCard.front}</p>
            {currentCard.hint && !isFlipped && (
              <p className="mt-4 text-center text-sm text-[#888] italic">💡 {currentCard.hint}</p>
            )}
            <p className="mt-6 text-xs text-[#999]">Click to reveal answer</p>
          </div>

          {/* Back */}
          <div
            className="absolute flex h-full w-full flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-primary/5 p-8 shadow-lg"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-center text-lg text-[#333]">{currentCard.back}</p>
            <p className="mt-6 text-xs text-[#999]">How well did you know this?</p>
          </div>
        </motion.div>
      </div>

      {/* Quality buttons (shown after flip) */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-3 gap-3"
          >
            <button
              type="button"
              onClick={() => handleQuality(2)}
              className="flex flex-col items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 hover:bg-red-100"
            >
              <X className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">Again</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuality(3)}
              className="flex flex-col items-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 p-4 hover:bg-yellow-100"
            >
              <RotateCcw className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">Hard</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuality(4)}
              className="flex flex-col items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 hover:bg-green-100"
            >
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Good</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuality(5)}
              className="col-span-3 flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 p-4 hover:bg-primary/20"
            >
              <ChevronRight className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Easy (Perfect recall)</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
