# BistroFlow: Build Plan

- [x] 1. Scaffold the project (stack in `CLAUDE.md`), strict `tsconfig`, lint, `netlify.toml`, `.env.example`; first working commit
- [x] 2. Neon schema (tables, menu_items, ingredients, recipe_lines, orders, order_items) and migration
- [x] 3. `types/` interfaces and zod schemas
- [x] 4. Seed script: menu, recipes, tables, sample orders
- [x] 5. Table map UI
- [x] 6. Menu browser and order builder with modifiers
- [ ] 7. Place-order API with transactional inventory decrement
- [ ] 8. `useLiveOrders` hook (polling/SSE)
- [ ] 9. KDS board with status transitions
- [ ] 10. Close/pay flow (mock) and table release
- [ ] 11. Inventory page with reorder alerts
- [ ] 12. Basic role gating (waiter / kitchen / manager)
- [ ] 13. Responsive and touch-target pass for tablet and phone
- [ ] 14. Quality gate: `npm run build`, lint and `tsc --noEmit` all pass; no console errors; core flow tested at 375px and desktop
- [ ] 15. README: pitch, features, stack, architecture notes, screenshot placeholders, run steps, 3-bullet "what to demo to a recruiter", Phase 2 list
- [ ] 16. Deploy to Netlify, set env vars, verify the public URL end to end
- [ ] 17. Push to GitHub and update the live URL in `README.md` and the root `LINKS.md`
