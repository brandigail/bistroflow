"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KitchenOrder } from "@/types";

const DEFAULT_INTERVAL_MS = 2000;

export interface LiveOrders {
  orders: KitchenOrder[];
  /** True until the first successful response. */
  loading: boolean;
  /** Set when the last poll failed; cleared by the next success. Last good data is kept. */
  error: string | null;
  /** Fetch immediately, e.g. right after a status change. */
  refresh: () => Promise<void>;
}

/**
 * The only place the live transport lives. Netlify has no persistent WebSockets,
 * so this short-polls; swap the body of `fetchOrders` / the scheduling for SSE
 * without touching any consumer.
 */
export function useLiveOrders(intervalMs: number = DEFAULT_INTERVAL_MS): LiveOrders {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef<AbortController | null>(null);

  const fetchOrders = useCallback(async () => {
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    try {
      const response = await fetch("/api/orders", { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body: { orders: KitchenOrder[] } = await response.json();
      setOrders(body.orders);
      setError(null);
      setLoading(false);
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(e instanceof Error ? e.message : "Connection lost");
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;

    // Schedule the next poll only after the previous one settles, so slow responses never overlap.
    const loop = async () => {
      await fetchOrders();
      if (!stopped && !document.hidden) timer = setTimeout(loop, intervalMs);
    };
    const onVisibility = () => {
      clearTimeout(timer);
      if (!document.hidden) void loop();
    };

    void loop();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopped = true;
      clearTimeout(timer);
      inFlight.current?.abort();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchOrders, intervalMs]);

  return { orders, loading, error, refresh: fetchOrders };
}
