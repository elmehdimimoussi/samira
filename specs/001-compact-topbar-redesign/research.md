# Phase 0 Research: Compact Topbar Redesign

## Clarifications Resolved

All Technical Context unknowns are resolved for this feature. No remaining `NEEDS CLARIFICATION` items.

## Decision 1: Route navigation semantics use landmark + links

- Decision: Keep top-level navigation as route links within a labeled `<nav>` region (`NavLink`), not an ARIA `tablist` widget.
- Rationale: Route changes are page navigation semantics; links preserve expected keyboard and assistive-technology behavior, and React Router provides `aria-current="page"` for active state.
- Alternatives considered:
  - ARIA `tablist`/`tab` pattern: rejected because it is intended for same-page panel switching with arrow-key model.
  - Generic clickable containers: rejected because they reduce semantic and keyboard reliability.

## Decision 2: Tailwind-first compact topbar implementation

- Decision: Use Tailwind v4 utility classes as the default topbar styling approach, with active state derived from `aria-current` and explicit `focus-visible` styles.
- Rationale: This aligns with constitution styling rules and minimizes stylesheet drift while keeping state styling explicit in JSX.
- Alternatives considered:
  - Add/expand custom topbar CSS in `src/index.css`: rejected for constitution misalignment and higher drift risk.
  - Icon-only compact nav: rejected because destination discoverability degrades.

## Decision 3: Mobile reachability via horizontal overflow pattern

- Decision: Implement single-row mobile nav with horizontal overflow (`overflow-x-auto`, non-shrinking items, no wrapping).
- Rationale: Keeps all destinations reachable on narrow widths without increasing topbar height.
- Alternatives considered:
  - Multi-row wrapping: rejected because it conflicts with compact-height objective.
  - Collapsible menu for this scope: rejected because it changes interaction model beyond feature intent.

## Decision 4: Workspace gain measurement protocol

- Decision: Use a hybrid verification model: manual pixel measurement in running Electron app for source-of-truth and lightweight budget assertions in tests/docs for regression guardrails.
- Rationale: jsdom layout measurements are not reliable for exact rendered pixel geometry; manual Electron measurement ensures correctness while testable budgets prevent drift.
- Alternatives considered:
  - Automated pixel layout assertions only in Vitest: rejected due to DOM layout limitations.
  - Manual-only checks: rejected because they do not protect future regressions.

## Decision 5: Navigation responsiveness verification method

- Decision: Validate warm navigation activation with a p95 <= 100 ms target using repeatable manual timing protocol (DevTools Performance/User Timing), and record evidence in verification notes.
- Rationale: A percentile-based threshold avoids anecdotal judgment and is practical for app-shell interaction checks.
- Alternatives considered:
  - Subjective visual checks only: rejected as non-measurable.
  - Heavy E2E perf harness for this feature: deferred to future if perf instability appears.

## Decision 6: Accessibility state distinction requirements

- Decision: Require visual distinction between active, hover, and keyboard focus-visible states for topbar controls.
- Rationale: Prevents ambiguity for keyboard users and keeps active route understandable during navigation.
- Alternatives considered:
  - Active-only styling without distinct focus ring: rejected because keyboard state becomes ambiguous.
  - Focus style only on some controls: rejected because it violates full keyboard reachability goals.

## Decision 7: Regression coverage layering

- Decision: Keep app-shell regression checks focused on route mapping, unknown-route fallback, keyboard activation, and presence of mobile-overflow affordance contracts.
- Rationale: Layered checks isolate failures and remain maintainable for shell-level changes.
- Alternatives considered:
  - One broad snapshot test: rejected due to brittleness and poor diagnostic value.
  - E2E-only validation: rejected for slower feedback and over-scoped setup.
