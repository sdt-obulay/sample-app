# Plan: Verify POST /tasks refactor matches RESEARCH.md

Rewrite [PLAN.md](PLAN.md) as a small, ordered, testable checklist that confirms `RESEARCH.md` §3 is fully realized in the current code. Scope is verification only — no source changes expected. Persisted to session memory for handoff.

**Steps**

Phase A — Baseline
1. Run `npm run build`, `npm test`, `npm run lint`. Record: build clean, lint clean, exactly one Jest failure = the planted off-by-one in [src/tasks.test.ts](src/tasks.test.ts) `'includes tasks exactly equal to the threshold (currently failing)'`. Any other failure = stop.

Phase B — Layer checks *(parallel)*
2. Validation: [src/validation.ts](src/validation.ts) — `validateCreateTask(body: unknown)` returns the discriminated result, no Express, no throw, trims title, enforces the three RESEARCH.md rules; error strings match [src/routes.test.ts](src/routes.test.ts) `POST /tasks` assertions.
3. Domain: [src/tasks.ts](src/tasks.ts) — `createTask(input, deps)` reads `id` from `deps.nextId()`, `createdAt` from `deps.now().toISOString()`, hardcodes `done: false`, imports nothing from `./store`.
4. Transport: `POST /tasks` in [src/routes.ts](src/routes.ts) is a thin adapter — `validateCreateTask` → 400 on `!ok` → `createTask(parsed.value, { nextId: taskStore.nextId, now: () => new Date() })` → `taskStore.add` → 201. No inline validation, no inline `Task` literal.
5. Storage: [src/store.ts](src/store.ts) exports `taskStore = { add, list, nextId }` and keeps the loose exports (RESEARCH.md §3.2 step 6).

Phase C — Test seams *(parallel with Phase B)*
6. [src/validation.test.ts](src/validation.test.ts) covers every rejection case from RESEARCH.md §3.5 plus a trim happy path and the length-200 boundary.
7. [src/tasks.test.ts](src/tasks.test.ts) `createTask` block pins the exact `Task` shape with fixed `nextId` and clock, asserts `done: false`, asserts injected clock is used.
8. [src/routes.test.ts](src/routes.test.ts) `POST /tasks` block asserts 201 body shape and 400 with the exact validation error strings (contract lock).

Phase D — Out-of-scope guardrails *(parallel with Phase B)*
9. `GET /tasks/search` in [src/routes.ts](src/routes.ts) is unchanged — inline filter stays. RESEARCH.md §3.2 step 5 defers this.
10. `filterByMinPriority` in [src/tasks.ts](src/tasks.ts) still uses `>=` and the planted failing test in [src/tasks.test.ts](src/tasks.test.ts) is still failing.

Phase E — Publish
11. Write the checklist into [PLAN.md](PLAN.md) at repo root, replacing the stale plan. Numbered checkboxes only, one link per file reference, no code blocks, no rollback section.
12. Re-run `npm run build && npm test && npm run lint` and confirm the Phase A signature is unchanged.

**Relevant files**
- [PLAN.md](PLAN.md) — target of the rewrite (currently describes work already done).
- [RESEARCH.md](RESEARCH.md) — source of truth for the layer split (§3).
- [src/routes.ts](src/routes.ts), [src/validation.ts](src/validation.ts), [src/tasks.ts](src/tasks.ts), [src/store.ts](src/store.ts) — layer-check targets.
- [src/validation.test.ts](src/validation.test.ts), [src/tasks.test.ts](src/tasks.test.ts), [src/routes.test.ts](src/routes.test.ts) — test-seam targets from RESEARCH.md §3.5.

**Verification**
1. `npm run build` exits 0.
2. `npm test` shows the same one planted failure as Phase A, no others.
3. `npm run lint` exits 0.
4. `git diff -- src/` is empty (no source drift).
5. `git diff -- PLAN.md` shows only the rewrite.

**Decisions**
- Verify-only, per your answer. No source or test edits.
- `GET /tasks/search` extraction and the `filterByMinPriority` off-by-one are excluded — RESEARCH.md scopes them out.
- New `PLAN.md` drops the "green gate after every step" pattern from the stale version because no steps mutate code.
