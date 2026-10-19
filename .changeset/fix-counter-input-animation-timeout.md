---
"@klear/klear360": patch
---

fix(CounterInput): don't let a stale animation timeout clear a newer animation early

`CounterInput`'s slide-up/slide-down animation class was cleared by an untracked `setTimeout`.
Clicking increment/decrement again within 300ms of a previous click scheduled a second timeout
without cancelling the first, so the first timeout could fire mid-animation and wipe the class
~100-200ms early, cutting the newer animation short. The timeout is now tracked in a ref, cleared
before scheduling a new one, and cleaned up on unmount.
