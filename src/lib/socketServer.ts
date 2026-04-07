import type { Server as SocketIOServer } from "socket.io";

declare global {
  // eslint-disable-next-line no-var
  var _io: SocketIOServer | undefined;
}

/** Store the Socket.IO server instance on globalThis (same pattern as Prisma). */
export function setIO(io: SocketIOServer) {
  globalThis._io = io;
}

/** Retrieve the Socket.IO server instance. Returns null if not initialised. */
export function getIO(): SocketIOServer | null {
  return globalThis._io ?? null;
}

// ── Convenience emitters ─────────────────────────────────────────────

export interface LikesUpdatedPayload {
  slug: string;
  likesCount: number;
}

export interface ReviewAddedPayload {
  slug: string;
  review: {
    id: string;
    rating: number;
    body: string | null;
    createdAt: string;
    author: { id: string; username: string };
    images: { id: string; url: string }[];
  };
  rating: number;
  reviewsCount: number;
}

export interface ReviewDeletedPayload {
  slug: string;
  reviewId: string;
  rating: number;
  reviewsCount: number;
}

/** Emit a likes-updated event to everyone watching a recipe. */
export function emitLikesUpdated(slug: string, likesCount: number) {
  const io = getIO();
  if (!io) return;
  io.to(`recipe:${slug}`).emit("recipe:likes-updated", {
    slug,
    likesCount,
  } satisfies LikesUpdatedPayload);
}

/** Emit a review-added event to everyone watching a recipe. */
export function emitReviewAdded(payload: ReviewAddedPayload) {
  const io = getIO();
  if (!io) return;
  io.to(`recipe:${payload.slug}`).emit("recipe:review-added", payload);
}

/** Emit a review-deleted event to everyone watching a recipe. */
export function emitReviewDeleted(payload: ReviewDeletedPayload) {
  const io = getIO();
  if (!io) return;
  io.to(`recipe:${payload.slug}`).emit("recipe:review-deleted", payload);
}
