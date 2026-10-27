"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 15_000;

const listeners = new Set<() => void>();
let snapshot = 0;
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    snapshot = Date.now();
    timer = setInterval(() => {
      snapshot = Date.now();
      listeners.forEach((l) => l());
    }, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) clearInterval(timer);
  };
}

/**
 * Current time in ms, refreshed every 15 s so ticket ages stay current. The server
 * snapshot is 0, so nothing time-dependent is computed during prerender; callers
 * only render time-based UI after data has loaded on the client.
 */
export function useNow(): number {
  return useSyncExternalStore(subscribe, () => snapshot, () => 0);
}
