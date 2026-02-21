/** In-memory store for pending study plan events before OAuth. Works for single-instance (e.g. local dev). On serverless (Vercel), use a persistent store (DB/Redis) keyed by pendingId so the callback can load events after redirect. */
const pending = new Map<
  string,
  { events: Array<{ title: string; date: string; startTime: string; endTime: string; subject?: string }>; createdAt: number }
>();
const TTL_MS = 15 * 60 * 1000; // 15 minutes

function prune() {
  const now = Date.now();
  Array.from(pending.entries()).forEach(([id, v]) => {
    if (now - v.createdAt > TTL_MS) pending.delete(id);
  });
}

export function setPending(
  id: string,
  events: Array<{ title: string; date: string; startTime: string; endTime: string; subject?: string }>
) {
  prune();
  pending.set(id, { events, createdAt: Date.now() });
}

export function getAndDeletePending(id: string) {
  const v = pending.get(id);
  pending.delete(id);
  return v?.events ?? null;
}

export function createPendingId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
