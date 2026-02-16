# Research: LC Preview Workspace Refactor

## Baseline Inventory (Task T001)

- Preview context 1: Fill page preview in `src/pages/FillingPage.jsx`.
- Preview context 2: Settings designer canvas preview in `src/pages/SettingsPage.jsx`.
- Additional preview context scan: no other bill preview surface found outside these two pages.
- Zoom entry points identified before refactor:
  - Fill: in-page zoom buttons and percentage indicator.
  - Settings: in-page zoom controls and transform scale.
  - Global: browser/Electron zoom shortcuts and ctrl/cmd+wheel input path.

## Decision 1: Use defense-in-depth to disable zoom inputs

- Decision: Disable zoom through multiple layers: remove zoom UI controls, intercept ctrl/cmd keyboard zoom shortcuts, block ctrl/cmd wheel zoom gestures, and lock Electron webContents zoom baseline.
- Rationale: Any single mechanism can be bypassed by another input path (menu roles, keyboard, wheel, gesture, or Chromium defaults). Layered controls ensure no scale drift across runtime contexts.
- Alternatives considered:
  - Only remove UI controls: rejected because shortcuts/gestures can still change scale.
  - Renderer-only keydown prevention: rejected because main-process and menu-driven zoom can still apply.
  - Allow bounded zoom range: rejected due to explicit requirement of no zoom behavior.

## Decision 2: Keep preview fit scaling automatic, not user-controlled

- Decision: Retain responsive fit-to-container scaling for preview rendering while removing any user multiplier/state.
- Rationale: The preview still must adapt to window size and remain readable, but users should not manipulate scale manually.
- Alternatives considered:
  - Fixed 1:1 rendering with scroll only: rejected because readability suffers at common desktop sizes.
  - Keep zoom state hidden: rejected because it still introduces accidental/indirect scale variability.

## Decision 3: Replace sidebar with compact top navigation to recover width

- Decision: Move primary route navigation from fixed-width left sidebar to low-height top bar.
- Rationale: Sidebar width is the largest persistent loss of preview workspace. A compact top bar reclaims horizontal space on all pages.
- Alternatives considered:
  - Collapsible sidebar: rejected because it still defaults to consuming width and adds state complexity.
  - Keep sidebar and only tweak page grids: rejected because reclaimed space is limited.

## Decision 4: Prioritize preview area in Fill and Settings layout rules

- Decision: Update Fill and Settings layout proportions and responsive rules to favor preview/canvas area while keeping form/properties usable.
- Rationale: Requirement explicitly prioritizes preview workspace and readability at 1366 and 1920 desktop widths.
- Alternatives considered:
  - Keep current 25% Fill form + fixed Settings properties widths: rejected for insufficient preview gain.
  - Aggressive full-screen-only preview: rejected because normal editing workflows need side panels.

## Decision 5: Preserve data and IPC contracts

- Decision: Do not introduce new persisted data keys or IPC endpoints for this feature.
- Rationale: Feature scope is UI behavior/layout only. Existing settings and frame persistence continue unchanged.
- Alternatives considered:
  - Add explicit "zoom disabled" setting flag: rejected as unnecessary and contrary to removing zoom preference.

## Decision 6: Validate by regression-focused manual checklist + existing automated tests

- Decision: Update existing Vitest suites affected by shell/layout/UI text and run manual smoke checks for print, resizing, multi-monitor DPI, and keyboard shortcuts.
- Rationale: Current repo has good unit/integration-level UI tests; this refactor is mostly UX behavior and layout, which requires manual visual validation.
- Alternatives considered:
  - Add new E2E framework: rejected to avoid introducing new tooling for this scope.
