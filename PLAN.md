# Verification Plan — POST /tasks refactor matches RESEARCH.md §3

Verify-only checklist. Confirms the layer split described in [RESEARCH.md](RESEARCH.md) §3 is realized in the current code. No source or test edits.

## Phase A — Baseline

- [ ] 1. `npm run build` exits 0.
- [ ] 2. `npm run lint` exits 0.
- [ ] 3. `npm test` reports 37/37 passing; record this as the baseline signature. (Deviation from the prompt: `filterByMinPriority` uses `>=`, so the test labelled "currently failing" in [src/tasks.test.ts](src/tasks.test.ts) actually passes — the source and test are already consistent.)

## Phase B — Layer checks

- [ ] 4. Validation layer: [src/validation.ts](src/validation.ts) exports `validateCreateTask(body: unknown)` returning the discriminated `{ ok: true; value } | { ok: false; error }` result, imports no Express, never throws, trims the title, enforces non-empty title, title ≤ 200 chars, and integer priority 1..5.
- [ ] 5. Validation error strings are exactly `title is required and must be a non-empty string`, `title must be 200 characters or fewer`, and `priority is required and must be an integer between 1 and 5` — matching the assertions in [src/routes.test.ts](src/routes.test.ts).
- [ ] 6. Domain layer: `createTask(input, deps)` in [src/tasks.ts](src/tasks.ts) reads `id` from `deps.nextId()`, reads `createdAt` from `deps.now().toISOString()`, hardcodes `done: false`, and does not reference `./store`.
- [ ] 7. Transport layer: the `POST /tasks` handler in [src/routes.ts](src/routes.ts) is a thin adapter — calls `validateCreateTask`, returns 400 with `{ error: parsed.error }` on `!ok`, calls `createTask(parsed.value, { nextId: taskStore.nextId, now: () => new Date() })`, calls `taskStore.add`, returns 201 with the task. No inline validation. No inline `Task` object literal.
- [ ] 8. Storage layer: [src/store.ts](src/store.ts) exports `taskStore = { add, list, nextId }` alongside the loose `addTask`, `getAllTasks`, `getNextId` exports (RESEARCH.md §3.2 step 6).

## Phase C — Test seams

- [ ] 9. [src/validation.test.ts](src/validation.test.ts) covers every rejection case from RESEARCH.md §3.5 (missing title, empty/whitespace title, non-string title, length 201, priority not integer, priority 0, priority 6, priority non-number, missing priority, null body) plus a trim happy path and the length-200 boundary.
- [ ] 10. The `createTask` block in [src/tasks.test.ts](src/tasks.test.ts) pins the exact `Task` shape with `nextId: () => 42` and a fixed clock, asserts `done: false`, and asserts the injected clock is used instead of the real one.
- [ ] 11. The `POST /tasks` block in [src/routes.test.ts](src/routes.test.ts) asserts the 201 body shape (id, title, priority, done=false, ISO createdAt) and asserts 400 responses with the exact validation error strings.

## Phase D — Out-of-scope guardrails

- [ ] 12. `GET /tasks/search` in [src/routes.ts](src/routes.ts) is unchanged — the inline `q`/`toLowerCase`/`filter` stays; RESEARCH.md §3.2 step 5 defers this.
- [ ] 13. `filterByMinPriority` in [src/tasks.ts](src/tasks.ts) still uses `>=` (inclusive threshold). The related test in [src/tasks.test.ts](src/tasks.test.ts) currently passes; leave both untouched.

## Phase E — Publish

- [ ] 14. This checklist lives at [PLAN.md](PLAN.md), replacing the stale refactor plan.
- [ ] 15. Re-run `npm run build && npm test && npm run lint`; confirm the Phase A signature is unchanged and `git diff -- src/` is empty.
