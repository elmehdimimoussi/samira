<!--
Sync Impact Report
- Version change: 1.0.0 -> 2.0.0
- Modified principles:
  - I. Spec-Driven Delivery (MUST) -> I. Preview-First User Experience (NON-NEGOTIABLE)
  - II. Minimal Change Surface (MUST) -> II. Modular Component Boundaries
  - III. Regression Safety (MUST) -> III. Predictable State via Custom Hooks
  - IV. Contract and Data Stability (MUST) -> IV. Data Integrity and Schema Alignment
  - V. Accessibility and Usability Baseline (MUST) -> V. Secure IPC and Responsive Performance
- Added sections:
  - UI and Styling Standards
  - Delivery Workflow and Quality Gates
- Removed sections:
  - Additional Constraints
  - Workflow and Quality Gates
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
  - ✅ not present (no action): .specify/templates/commands/*.md
- Deferred follow-up TODOs:
  - None
-->

# LC Pro Constitution

## Core Principles

### I. Preview-First User Experience (NON-NEGOTIABLE)
The application MUST maximize readability and prominence of the Lettre de Change
preview. Primary filling and design workflows MUST allocate about 70% or more of
desktop width to the preview canvas. Top-level navigation MUST use compact top tabs,
and the topbar MUST stay space-efficient with reduced visual chrome. Fullscreen
preview overlays MUST use `fixed inset-0 z-[100]` with a solid dark background and
MUST suppress underlying app scrollbars and UI visibility.
Rationale: LC accuracy depends on clear visual verification during data entry.

### II. Modular Component Boundaries
UI components MUST follow single responsibility. Any UI file exceeding 300 lines is
a refactor trigger unless an exception is documented in the implementation plan's
complexity tracking section. Form UI and preview UI MUST be separated, and the
template designer canvas MUST be separated from its properties panels.
Rationale: Smaller boundaries reduce regression risk and speed up iterative UX work.

### III. Predictable State via Custom Hooks
Complex form, business, designer, and IPC coordination logic MUST live in custom
hooks (for example `useLCForm`, `useTemplateDesigner`, `useCustomers`). Components
MUST remain focused on rendering and user interaction wiring. State transitions and
derived values MUST be explicit and centralized in hooks rather than duplicated in
multiple presentation components.
Rationale: Predictable state boundaries keep behavior testable and maintainable.

### IV. Data Integrity and Schema Alignment
Data entities and UI forms MUST mirror required LC domain fields exactly, including
`account_number`, `agency`, and `city` where applicable. All create and update flows
MUST validate payloads with `zod` before invoking IPC operations. Linked-entity
autocomplete interactions (such as drawer selection) MUST atomically populate all
related fields (address, account number, agency, city) in main form state.
Rationale: Domain correctness prevents banking-document errors and invalid storage.

### V. Secure IPC and Responsive Performance
The renderer process MUST NOT access Node.js modules directly and MUST communicate
through `window.electronAPI` exposed by `preload.cjs`. IPC calls MUST be wrapped in
`try/catch` and failures MUST surface friendly `sonner` toast messages. Heavy visual
components (notably LC canvas and draggable frames) MUST use `React.memo`, `useMemo`,
and `useCallback` where relevant to keep interactions smooth. Template image rendering
MUST use efficient scaling and avoid unnecessary DOM load.
Rationale: Security isolation and sustained responsiveness are core product qualities.

## UI and Styling Standards

- Tailwind CSS v4 is the default styling system for all UI work.
- Custom CSS files MAY be introduced only for complex animation cases or
  third-party overrides that Tailwind utilities cannot express cleanly.
- Layout work MUST ensure `ResponsivePreviewWrapper` fully consumes parent width and
  height across supported viewport sizes.
- Desktop-first workspace optimization MUST NOT regress mobile usability.
- Product direction is offline-first desktop behavior; changes MUST preserve local
  operation when network access is unavailable.

## Delivery Workflow and Quality Gates

- Each implementation plan MUST pass a constitution check for preview allocation,
  modular boundaries, hook ownership of complex state, schema alignment, IPC safety,
  and performance strategy.
- Each feature spec MUST declare impacts to UI space allocation, component/hook
  boundaries, schema/validation, IPC paths, and rendering performance.
- Tasks MUST explicitly include work items for zod validation, secure IPC handling,
  and performance safeguards when those concerns are in scope.
- Pull requests MUST include evidence that constitution-relevant constraints were
  verified (manual checks, automated tests, or both).

## Governance

- This constitution overrides conflicting local engineering habits and guidance.
- Amendments require: (1) a documented rationale, (2) updates to dependent templates
  under `.specify/templates/`, and (3) a Sync Impact Report in the constitution file.
- Versioning policy for this constitution follows semantic versioning:
  - MAJOR: incompatible principle removals or redefinitions.
  - MINOR: new principles/sections or materially expanded mandates.
  - PATCH: clarifications, wording improvements, typo/non-semantic edits.
- Compliance review is required for every plan and pull request that changes product
  behavior, data contracts, or UI architecture.

**Version**: 2.0.0 | **Ratified**: 2026-02-16 | **Last Amended**: 2026-02-22
