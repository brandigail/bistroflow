# BistroFlow: POS and Hospitality Inventory

Read the portfolio-root `CLAUDE.md` first for global rules. This file is the brief for this project.

## What it is
A point-of-sale and kitchen system for restaurants. Waiters place orders against a table map, the kitchen display (KDS) updates ticket states live, and each order decrements ingredient stock with reorder alerts.

## Stack
Next.js (App Router), TypeScript strict, Tailwind CSS, Drizzle with Neon Postgres, Server-Sent Events or short polling for live updates, Auth.js (PIN or credentials). Hosted on Netlify. No WebSockets, no Supabase. No Supabase, no Vercel, no Gemini/OpenAI.

## MVP (build first)
1. POS screen: table map, menu by category, order builder with modifiers, send to kitchen, and close/pay (mock payment).
2. Kitchen display `/kds`: tickets grouped by status (NEW, PREPARING, READY) that update live via polling (2 s) or SSE; tap to advance state.
3. Inventory: recipes map menu items to ingredients; sending an order decrements stock in a transaction; low-stock alert list at reorder thresholds.

## Phase 2
Multi-terminal roles (waiter, kitchen, manager), Split bills, Daily sales report and CSV export, Purchase-order draft from low stock.

## Data model (put in `types/`)
```ts
export interface Table { id: string; label: string; seats: number; x: number; y: number }
export interface MenuItem { id: string; name: string; category: string; price: number; available: boolean }
export interface Ingredient { id: string; name: string; unit: string; stock: number; reorderLevel: number }
export interface RecipeLine { menuItemId: string; ingredientId: string; quantity: number }
export type TicketStatus = 'NEW' | 'PREPARING' | 'READY' | 'SERVED' | 'PAID';
export interface Order { id: string; tableId: string; status: TicketStatus; createdAt: string; items: OrderItem[] }
export interface OrderItem { id: string; menuItemId: string; quantity: number; notes: string }
```

## Rules specific to this project
- Netlify has no persistent WebSockets: isolate the live transport in one `useLiveOrders` hook (polling or SSE) so it can be swapped.
- Decrement inventory inside one DB transaction with the order insert; never let stock go negative silently.
- Seed a full menu, recipes, tables and a few in-flight orders so the KDS looks alive immediately.
- Design POS for touch targets (min 44px) on tablet widths as well as 375px.
- Seed realistic demo data so the app looks alive on first load without sign-up.

## Start here
1. Ask me for the Neon `DATABASE_URL`.
2. Scaffold Next.js + Tailwind + Drizzle, commit.
3. Work through `PLAN.md` from step 2.
