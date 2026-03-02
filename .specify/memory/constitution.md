<!--
  Sync Impact Report
  ===================================================
  Version change: 0.0.0 (template) → 1.0.0
  Modified principles: N/A (initial ratification)
  Added sections:
    - I. Code Quality & Modularity (new)
    - II. Testing Discipline (new)
    - III. User Experience Consistency (new)
    - IV. Performance & Responsiveness (new)
    - Technology Stack Constraints (new section)
    - Development Workflow (new section)
    - Governance (populated)
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible (Constitution Check section is generic)
    - .specify/templates/spec-template.md ✅ compatible (no constitution-specific references)
    - .specify/templates/tasks-template.md ✅ compatible (phase structure aligns with principles)
    - .specify/templates/checklist-template.md ✅ compatible (generic structure)
    - .specify/templates/agent-file-template.md ✅ compatible (no constitution references)
  Follow-up TODOs: None
  ===================================================
-->

# LC Pro Constitution

## Core Principles

### I. Code Quality & Modularity

- Every React component MUST have a single, well-defined responsibility.
  Page-level files serve as composition and layout layers only;
  business logic MUST be extracted into custom hooks (`src/hooks/`),
  and reusable UI elements MUST reside in `src/components/ui/`.
- All data crossing IPC boundaries or entering forms MUST be validated
  with Zod schemas defined in `src/validation/`. Schema definitions
  MUST be co-located by domain entity.
- ESLint MUST pass with zero errors before any code is merged.
  The `no-unused-vars` and `react-hooks/exhaustive-deps` rules
  MUST NOT be disabled via inline comments without a written
  justification in the PR description.
- Service modules in `src/services/` MUST be pure functions with no
  side effects or DOM dependencies, enabling deterministic unit testing.
- File size guideline: no single source file SHOULD exceed 300 lines.
  Files exceeding this threshold MUST be split or justified in the PR.

**Rationale**: Modular code with enforced boundaries reduces coupling,
simplifies reviews, and makes incremental feature delivery safe.

### II. Testing Discipline

- Every new service function and custom hook MUST ship with
  corresponding Vitest tests in `src/__tests__/`.
- Test file placement MUST mirror the source tree:
  `src/__tests__/services/` for services,
  `src/__tests__/components/` for components,
  `src/__tests__/pages/` for page-level integration tests.
- Tests MUST use `@testing-library/react` and
  `@testing-library/user-event` for component assertions.
  Direct DOM queries (e.g., `querySelector`) MUST NOT be used
  when a Testing Library query is available.
- The `npm test` command MUST exit with zero failures on the default
  branch at all times. A failing test on the default branch is treated
  as a P0 incident.
- Bug-fix PRs MUST include a regression test that fails without the
  fix and passes with it.
- Coverage SHOULD be monitored via `npm run test:coverage`. New code
  MUST NOT decrease overall line coverage below the current baseline.

**Rationale**: Consistent, well-placed tests catch regressions early
and give confidence during the modular refactoring this project
requires.

### III. User Experience Consistency

- All user-facing feedback (success, error, info) MUST use Sonner
  toast notifications. Ad-hoc `alert()` or `console.log` for user
  messaging is prohibited.
- Light and dark themes MUST be supported for every new UI element.
  Theme-dependent colors MUST use Tailwind CSS utility classes that
  include both light and `dark:` variants.
- Icon usage MUST exclusively use Lucide React. Mixing icon libraries
  or inline SVGs is prohibited.
- Interactive elements MUST be keyboard-accessible: focusable via Tab,
  activatable via Enter/Space, and dismissable via Escape where
  applicable (modals, fullscreen overlays, dropdowns).
- Layout MUST be responsive: desktop-first with usable fallbacks down
  to 768 px viewport width. The preview panel in Filling and Settings
  pages MUST occupy at least 65% of horizontal space on screens
  wider than 1024 px.
- Fullscreen overlays MUST use the shared pattern:
  `fixed inset-0 z-[100] bg-slate-950`, with a visible close button
  and Escape-to-close behavior, and MUST lock body scroll.

**Rationale**: Uniform interaction patterns reduce cognitive load for
users and prevent inconsistency as the UI grows.

### IV. Performance & Responsiveness

- React components rendering frequently (e.g., preview panels, canvas
  interactions) MUST use `React.memo`, `useMemo`, or `useCallback`
  to prevent unnecessary re-renders. Memoization decisions MUST be
  justified by measurable render frequency, not applied speculatively.
- Event handlers attached to high-frequency events (drag, resize,
  scroll, input) MUST be debounced or throttled where the callback
  performs expensive operations (DOM measurement, IPC calls, large
  state updates).
- The Vite production build (`npm run build`) MUST complete without
  warnings. Bundle size regressions exceeding 50 KB (gzipped) MUST
  be justified.
- Electron IPC calls MUST be wrapped in `try/catch` with user-friendly
  error toasts. Long-running IPC operations SHOULD show a loading
  indicator.
- PDF generation and image capture (`jsPDF`, `html2canvas`) MUST NOT
  block the main thread for more than 2 seconds on reference hardware.
  If exceeded, the operation MUST be deferred or chunked.

**Rationale**: A desktop application handling financial documents must
feel instantaneous; perceived latency erodes user trust and
productivity.

## Technology Stack Constraints

- **Runtime**: Electron 30 (Chromium) + Node.js ≥ 18
- **UI**: React 19, React Router 7, Tailwind CSS 4, Lucide React,
  Sonner
- **Validation**: Zod
- **PDF**: jsPDF + html2canvas
- **Build**: Vite 7, PostCSS, electron-builder
- **Testing**: Vitest 4, @testing-library/react,
  @testing-library/user-event, jsdom
- **Linting**: ESLint 9 with react-hooks and react-refresh plugins
- **Data**: Local JSON file (`lc-bmci-data.json` in AppData).
  No external network calls for data persistence.
- New runtime dependencies MUST NOT be added without documented
  justification (bundle size impact, license compatibility, and
  maintenance status). Prefer extending existing libraries before
  adding new ones.

## Development Workflow

- **Branch strategy**: Feature branches off `main`. Branch naming
  follows the pattern `###-feature-name` (e.g., `001-compact-topbar`).
- **Quality gate before merge**:
  1. `npm test` — all tests pass.
  2. `npm run lint` — zero ESLint errors.
  3. Manual smoke test of affected pages in both light and dark mode.
- **Commit messages**: Use conventional commits
  (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`).
- **Feature delivery**: Each feature MUST be delivered as an
  independently testable user story increment. Partial implementations
  MUST NOT be merged unless gated behind a feature flag or
  non-reachable code path.
- **Documentation**: Changes to public-facing behavior MUST update
  the relevant section in `README.md` or `docs/`.

## Governance

- This constitution is the authoritative source of project standards.
  Where it conflicts with ad-hoc practices or external guides, this
  document prevails.
- Amendments require:
  1. A written proposal describing the change and its rationale.
  2. Version increment following semantic versioning (see below).
  3. Update of `LAST_AMENDED_DATE`.
  4. Propagation check across `.specify/templates/` and `AGENTS.md`.
- **Versioning policy**:
  - MAJOR: Principle removed, redefined, or backward-incompatible
    governance change.
  - MINOR: New principle or section added, or material expansion of
    existing guidance.
  - PATCH: Wording clarification, typo fix, non-semantic refinement.
- Compliance review: Every PR MUST be checked against the active
  principles. Reviewers SHOULD reference the specific principle
  number (e.g., "P-II: missing regression test") when requesting
  changes.
- Runtime development guidance is maintained in `AGENTS.md`.

**Version**: 1.0.0 | **Ratified**: 2026-03-02 | **Last Amended**: 2026-03-02
