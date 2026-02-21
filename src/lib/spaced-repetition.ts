// SM-2 Spaced Repetition Algorithm Implementation
// Based on SuperMemo SM-2 algorithm

export interface Card {
  id: string;
  ease_factor: number; // Default: 2.5
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  next_review: Date;
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5; // 0-5 rating

/**
 * Calculate next review schedule based on SM-2 algorithm
 * @param quality - User's self-assessment (0=complete blackout, 5=perfect recall)
 * @param card - Current card state
 * @returns Updated card with new schedule
 */
export function calculateNextReview(quality: Quality, card: Card): Card {
  let { ease_factor, interval, repetitions } = card;

  // If quality < 3, reset the card
  if (quality < 3) {
    repetitions = 0;
    interval = 0;
  } else {
    // Successful recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  }

  // Update ease factor
  ease_factor = Math.max(
    1.3,
    ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const next_review = new Date();
  next_review.setDate(next_review.getDate() + interval);

  return {
    ...card,
    ease_factor,
    interval,
    repetitions,
    next_review,
  };
}

/**
 * Get cards that are due for review
 */
export function getDueCards(cards: Card[]): Card[] {
  const now = new Date();
  return cards.filter(card => new Date(card.next_review) <= now);
}

/**
 * Get study statistics
 */
export function getStudyStats(cards: Card[]) {
  const now = new Date();
  const dueToday = cards.filter(c => new Date(c.next_review) <= now);
  const dueThisWeek = cards.filter(c => {
    const diff = (new Date(c.next_review).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  });
  
  return {
    total: cards.length,
    dueToday: dueToday.length,
    dueThisWeek: dueThisWeek.length,
    averageEase: cards.reduce((sum, c) => sum + c.ease_factor, 0) / cards.length || 2.5,
  };
}
