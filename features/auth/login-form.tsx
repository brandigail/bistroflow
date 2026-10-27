"use client";

import { useActionState, useState } from "react";
import type { StaffMember, StaffRole } from "@/types";
import { login } from "./actions";

const ROLE_BLURB: Record<StaffRole, string> = {
  waiter: "Takes orders, settles bills",
  kitchen: "Runs the kitchen display",
  manager: "Everything, plus inventory",
};

// Demo-only hints so recruiters can try every role. Real PINs are only ever stored hashed.
const DEMO_PINS: Record<StaffRole, string> = { waiter: "1111", kitchen: "2222", manager: "3333" };

export function LoginForm({ staff }: { staff: StaffMember[] }) {
  const [error, formAction, pending] = useActionState(login, null);
  // Controlled so a failed attempt (React resets uncontrolled fields) keeps the chosen person.
  const [selectedId, setSelectedId] = useState(staff[0]?.id ?? "");

  return (
    <form action={formAction} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="mb-1 text-sm font-medium text-muted">Who is signing in?</legend>
        {staff.map((member) => (
          <label
            key={member.id}
            className="flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 border-line bg-surface p-4 has-[:checked]:border-accent has-[:checked]:bg-accent/10"
          >
            <input
              type="radio"
              name="staffId"
              value={member.id}
              checked={selectedId === member.id}
              onChange={() => setSelectedId(member.id)}
              className="size-5 accent-[var(--accent)]"
            />
            <span className="flex-1">
              <span className="block font-semibold">{member.name}</span>
              <span className="block text-sm text-muted">{ROLE_BLURB[member.role]}</span>
            </span>
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted">Demo PIN {DEMO_PINS[member.role]}</span>
          </label>
        ))}
      </fieldset>

      <div>
        <label htmlFor="pin" className="mb-1 block text-sm font-medium text-muted">
          4-digit PIN
        </label>
        <input
          id="pin"
          name="pin"
          type="password"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          autoComplete="off"
          required
          className="min-h-12 w-full rounded-xl border-2 border-line bg-surface px-4 text-center text-2xl tracking-[0.5em]"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full rounded-xl bg-accent px-4 font-semibold text-accent-foreground disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
