# Implementation Plan: Compact Topbar Redesign

**Branch**: `[001-compact-topbar-redesign]` | **Date**: 2026-02-23 | **Spec**: `/workspaces/samira/specs/001-compact-topbar-redesign/spec.md`
**Input**: Feature specification from `/workspaces/samira/specs/001-compact-topbar-redesign/spec.md`

## Summary

Deliver a compact single-row topbar that increases visible workspace while preserving route correctness, active-state clarity, keyboard accessibility, and narrow-viewport horizontal reachability. Implementation keeps changes in app-shell UI composition and regression coverage, with Tailwind-first styling updates and explicit measurement protocol for workspace gain and navigation responsiveness.

## Technical Context

**Language/Version**: JavaScript (ES modules), React 19  
**Primary Dependencies**: React Router, Lucide React, Sonner, Tailwind CSS v4, Zod (unchanged; not newly introduced in this feature)  
**Storage**: N/A (no persistence model changes)  
**Testing**: Vitest + Testing Library (`npm test`), ESLint (`npm run lint`)  
**Target Platform**: Electron renderer UI (desktop-first, responsive to mobile-width viewports)
**Project Type**: Desktop application (Electron + React frontend)  
**Performance Goals**: Warm top-level navigation activation p95 <= 100 ms, no visible lag during topbar interactions, horizontal tab scrolling remains smooth at 390x844 and 320x568  
**Constraints**: Single-row compact topbar; Tailwind v4 as default styling system; no routing regressions; keyboard operability preserved; no direct Node access from renderer; supported viewport matrix 1440x900, 1024x600, 390x844, 320x568; zoom checks at 100/150/200%  
**Scale/Scope**: App shell only (primary `src/App.jsx`, regression checks in `src/__tests__/App.test.jsx`, and validation docs under spec folder)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gate Status (pre-research): PASS

- Preview-first UX: PASS - Compact topbar explicitly increases vertical workspace and supports preview prominence.
- Modular boundaries: PASS - Changes remain isolated to app-shell composition and tests; no new large feature modules.
- Custom hooks ownership: PASS - No complex business/designer/IPC state moved into UI components.
- Data integrity: PASS - No create/update flows or schema fields are changed; no zod boundary changes required.
- Secure IPC: PASS - No new renderer privileged access paths; existing `window.electronAPI` constraints unchanged.
- Performance: PASS - Plan includes measurable nav responsiveness target and verification method.
- UI and styling standards: PASS - Tailwind-first approach; no new custom CSS files introduced.

## Project Structure

### Documentation (this feature)

```text
specs/001-compact-topbar-redesign/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-navigation-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── App.jsx
├── __tests__/
│   └── App.test.jsx
├── components/
├── hooks/
├── pages/
└── index.css
```

**Structure Decision**: Single-project Electron renderer app. Implementation is limited to app-shell route navigation UI and related regression assertions; existing project boundaries remain unchanged.

## Phase 0: Research Plan

- Define measurable workspace-gain protocol (>=8%) that is stable for manual QA and lightweight CI checks.
- Define measurable topbar responsiveness method (<=100 ms p95) for warm navigation interactions.
- Confirm React Router top navigation semantics (landmark + links, not tablist widget semantics).
- Confirm Tailwind v4 utility-first patterns for compact topbar, active/focus differentiation, and horizontal overflow reachability without new custom CSS.
- Consolidate all decisions in `research.md` with decision/rationale/alternatives format.

## Phase 1: Design & Contracts Plan

- Model shell entities and behavior constraints in `data-model.md`.
- Define explicit UI navigation contract in `contracts/ui-navigation-contract.md` including route mapping, keyboard guarantees, viewport/zoom checks, and performance validation hooks.
- Define execution and verification workflow in `quickstart.md` with manual and automated quality gates.
- Update agent context via `.specify/scripts/bash/update-agent-context.sh opencode`.

## Post-Design Constitution Check

Gate Status (post-design): PASS

- Preview-first UX: PASS - Design artifacts require measurable vertical gain and preserve compact tabs.
- Modular boundaries: PASS - No cross-feature architecture expansion; shell-focused updates only.
- Custom hooks ownership: PASS - No new complex state ownership introduced in rendering components.
- Data integrity: PASS - No schema/persistence changes and no flow-level validation boundary changes.
- Secure IPC: PASS - Design introduces no new IPC operations or renderer Node access.
- Performance: PASS - Contract and quickstart include explicit responsiveness checks and regression evidence.
- UI and styling standards: PASS - Utility-first styling direction is preserved; no unjustified custom CSS additions.

## Complexity Tracking

No constitution violations require exceptions for this plan.
