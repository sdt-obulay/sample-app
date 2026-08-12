---
name: api-validation-rules
description: Validation and error-response rules for task endpoints.
---

Use for endpoint edits in `src/routes.ts` and `src/tasks.ts`.

Rules:
1. Validate every request body and route param.
2. Return 400 with a short error message on invalid input.
3. Never build a RegExp from user input.
4. Keep changes minimal and avoid unrelated refactors.
