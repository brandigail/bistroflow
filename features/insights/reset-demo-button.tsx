"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ResetDemoButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function reset() {
    if (!window.confirm("Reset the demo to its starting state? Orders, stock and sales history will be reloaded.")) return;
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/demo/reset", { method: "POST" });
      if (!response.ok) {
        const body: { error?: string } = await response.json().catch(() => ({}));
        setMessage({ ok: false, text: body.error ?? "Could not reset the demo." });
        return;
      }
      setMessage({ ok: true, text: "Demo data reset." });
      router.refresh();
    } catch {
      setMessage({ ok: false, text: "Network error. The demo was not reset." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={reset} disabled={busy} className="btn btn-outline text-sm">
        <RotateCcw aria-hidden className={`size-4 ${busy ? "animate-spin" : ""}`} />
        {busy ? "Resetting…" : "Reset demo data"}
      </button>
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`text-sm ${message.ok ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
