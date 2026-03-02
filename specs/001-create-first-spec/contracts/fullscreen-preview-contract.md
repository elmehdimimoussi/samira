# Contract: Fullscreen Preview Behavior

## Purpose

Define expected user-visible behavior for fullscreen preview interactions across LC drafting and template workflows.

## Preconditions

- A preview is visible in standard mode.
- User has an in-progress LC draft or template context.

## Interaction Contract

1. User can enter fullscreen preview via explicit UI action.
2. In fullscreen mode, the preview occupies the full application viewport with clear visual focus.
3. User can exit fullscreen by:
   - activating the close control, or
   - pressing Escape.
4. On exit, user returns to prior page context with in-progress values preserved.

## Error and Recovery Contract

- If fullscreen transition fails, the user receives visible failure feedback and remains in a usable non-destructive state.
- Fullscreen entry/exit must not clear or mutate form values.

## Accessibility Contract

- Fullscreen controls are keyboard reachable.
- Escape-to-close is always available while fullscreen is active.

## Acceptance Signals

- Fullscreen entry and exit succeed in at least 95% of attempts without data loss.
- No background interaction blocks completion of core user tasks after exit.
