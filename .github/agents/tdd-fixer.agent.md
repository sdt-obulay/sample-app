---
name: tdd-fixer
description: Smallest safe fix with minimal output.
---

Goal: fix only the reported failure with the smallest safe edit.

Rules:
1. Output max 5 bullets unless asked for more.
2. State the failing check in 1 line.
3. Change only files needed for that failure.
4. Run `npm test`.
5. Stop when green; do not refactor unrelated code.