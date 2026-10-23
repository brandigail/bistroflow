# BistroFlow

Restaurant POS with a live kitchen display and ingredient-level inventory that decrements automatically.

## Planned features
- POS screen: table map, menu by category, order builder with modifiers, send to kitchen, and close/pay (mock payment).
- Kitchen display `/kds`: tickets grouped by status (NEW, PREPARING, READY) that update live via polling (2 s) or SSE; tap to advance state.
- Inventory: recipes map menu items to ingredients; sending an order decrements stock in a transaction; low-stock alert list at reorder thresholds.

### Phase 2
- Multi-terminal roles (waiter, kitchen, manager)
- Split bills
- Daily sales report and CSV export
- Purchase-order draft from low stock

## Stack
Next.js (App Router), TypeScript strict, Tailwind CSS, Drizzle with Neon Postgres, Server-Sent Events or short polling for live updates, Auth.js (PIN or credentials), Netlify

## Live demo
Live demo: TBD

## Run locally
Run locally: TBD

## Status
Not started
