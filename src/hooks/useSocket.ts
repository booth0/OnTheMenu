"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

/**
 * Connect to the Socket.IO server and join the room for a specific recipe.
 * Returns a stable socket ref that stays connected for the lifetime of the hook.
 */
export function useRecipeSocket(
  slug: string | undefined,
  handlers: {
    onLikesUpdated?: (data: { slug: string; likesCount: number }) => void;
    onReviewAdded?: (data: {
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
    }) => void;
    onReviewDeleted?: (data: {
      slug: string;
      reviewId: string;
      rating: number;
      reviewsCount: number;
    }) => void;
  }
) {
  const socketRef = useRef<Socket | null>(null);
  // Keep handler refs stable to avoid re-subscribing on every render
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!slug) return;

    const socket = io({
      path: "/api/socketio",
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-recipe", slug);
    });

    socket.on("recipe:likes-updated", (data) => {
      handlersRef.current.onLikesUpdated?.(data);
    });

    socket.on("recipe:review-added", (data) => {
      handlersRef.current.onReviewAdded?.(data);
    });

    socket.on("recipe:review-deleted", (data) => {
      handlersRef.current.onReviewDeleted?.(data);
    });

    return () => {
      socket.emit("leave-recipe", slug);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [slug]);
}
