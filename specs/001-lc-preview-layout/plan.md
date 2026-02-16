# Implementation Plan: LC Preview Workspace Refactor

**Branch**: `001-lc-preview-layout` | **Date**: 2026-02-16 | **Spec**: `/workspaces/samira/specs/001-lc-preview-layout/spec.md`
**Input**: Feature specification from `/specs/001-lc-preview-layout/spec.md`

## Summary

Remove all zoom behavior from bill preview surfaces, increase preview-visible workspace, and replace the sidebar with a compact top navigation bar. The approach keeps existing routes and workflows unchanged while refactoring shared layout and preview scaling behavior to reduce accidental UI actions and improve readability at desktop sizes.

## Technical Context

**Language/Version**: JavaScript ES modules, React 19.2, Electron 30, Vite 7  
**Primary Dependencies**: `react-router-dom`, `tailwindcss`, `lucide-react`, `sonner`, `html2canvas`, `jspdf`  
**Storage**: Local JSON file (`lc-bmci-data.json`) via Electron IPC settings/customers/operations/frames  
**Testing**: Vitest + Testing Library (`jsdom`)  
**Target Platform**: Electron desktop app, Windows packaging (NSIS + portable, x64/ia32)
**Project Type**: Single-project frontend desktop app (`src/` + `electron/`)  
**Performance Goals**: Maintain responsive preview readability at 1200x700, 1366-wide, and 1920-wide; no perceptible delay in route switching under normal desktop usage  
**Constraints**: No new libraries; preserve existing fill/settings/history/printing flows; block all scale-changing zoom inputs; keep keyboard-accessible navigation  
**Scale/Scope**: 4 primary routes, 2 preview-intensive pages (Fill + Settings), shared app shell and CSS system

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Validated against `.specify/memory/constitution.md` (v1.0.0):

- I. Spec-Driven Delivery: PASS (`spec.md`, `plan.md`, `tasks.md` aligned)
- II. Minimal Change Surface: PASS (no new dependencies; targeted shell/layout/preview files)
- III. Regression Safety: PASS (test updates + quickstart regression checklist required)
- IV. Contract and Data Stability: PASS (no new IPC/data contract changes)
- V. Accessibility and Usability Baseline: PASS (top-nav keyboard access and desktop readability required)

Post-design re-check (Phase 1): PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-lc-preview-layout/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── openapi.yaml
│   └── README.md
└── tasks.md
```

### Source Code (repository root)

```text
electron/
├── main.cjs
└── preload.cjs

src/
├── App.jsx
├── index.css
├── components/
│   └── ResponsivePreviewWrapper.jsx
├── pages/
│   ├── FillingPage.jsx
│   ├── SettingsPage.jsx
│   ├── CustomersPage.jsx
│   └── HistoryPage.jsx
└── __tests__/
    ├── App.test.jsx
    └── pages/
        ├── FillingPage.test.jsx
        └── SettingsPage.test.jsx
```

**Structure Decision**: Keep current single-project Electron + React architecture. Implement all changes in existing shell, page, component, and style files with test updates in the existing Vitest suite.

## Complexity Tracking

No constitution violations require exception tracking.
