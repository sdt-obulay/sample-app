# Copilot Instructions

## TypeScript
- Strict mode is enabled; no `any` types.
- Use 2-space indentation.
- Prefer `const` over `let` when reassignment is unnecessary.

## Project Structure
- Express route handlers live in `src/routes.ts`.
- Business logic lives in `src/tasks.ts`.
- Shared types are in `src/types.ts`; validation logic in `src/validation.ts`.

## Input Handling
- Validate all request bodies before use; return HTTP 400 on invalid input.
- Never construct a `RegExp` from user-supplied input.

## Quality Gates
- Every change must keep `npm run build`, `npm test`, and `npm run lint` green.
