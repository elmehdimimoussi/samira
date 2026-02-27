# Implementation Plan: Customer Data Alignment and Drawer Autofill

**Branch**: `001-align-customer-model` | **Date**: 2026-02-22 | **Spec**: `/workspaces/samira/specs/001-align-customer-model/spec.md`
**Input**: Feature specification from `/workspaces/samira/specs/001-align-customer-model/spec.md`

## Summary

Implement Step 1 from the LC Pro implementation plan by aligning customer records
with required LC drawer fields and making drawer autocomplete populate all linked
form fields atomically. The approach updates customer capture/display/search,
adds pre-IPC validation, and preserves legacy records while improving data quality
and speed of LC form completion.

## Technical Context

**Language/Version**: JavaScript (ES modules), React 19, Electron 30  
**Primary Dependencies**: React Router, Sonner, Lucide React, Zod  
**Storage**: Local JSON database managed in Electron main process (`lc-bmci-data.json`)  
**Testing**: Vitest + Testing Library (JSDOM)  
**Target Platform**: Offline-first desktop app (Windows-focused Electron distribution)
**Project Type**: Desktop application (React renderer + Electron main/preload bridge)  
**Performance Goals**: Drawer suggestions appear within 150 ms for up to 500 local customer records, and selection applies mapped fields within one interaction cycle  
**Constraints**: Must remain offline-capable; renderer uses `window.electronAPI` only; all write flows validated before IPC; preserve compatibility with legacy customer records missing new fields  
**Scale/Scope**: Single feature slice affecting `CustomersPage` and drawer autocomplete in `FillingPage`, plus related tests and feature docs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Preview-first UX: PASS. No reduction of preview space; feature improves preview
  correctness by autofilling drawer data consistently.
- Modular boundaries: PASS WITH CONTROLLED EXCEPTION. `CustomersPage.jsx` will be
  reduced below 300 lines in this feature by extracting form responsibilities.
  `FillingPage.jsx` remains above threshold under a temporary exception documented
  in Complexity Tracking, limited to drawer autofill updates only.
- Custom hooks ownership: PASS. This feature introduces dedicated hooks for
  customer form state and drawer autocomplete state transitions.
- Data integrity: PASS. Customer schema/UI alignment includes account number,
  agency, and city; validation boundaries are defined before write IPC.
- Secure IPC: PASS. Renderer interactions remain through `window.electronAPI`
  with try/catch and user-facing failure messaging.
- Performance: PASS. Changes are low-cost form/list/autocomplete operations and do
  not introduce heavy rendering paths.

Initial Gate Decision: PASS (no unjustified constitutional violations)

## Project Structure

### Documentation (this feature)

```text
specs/001-align-customer-model/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── CustomersPage.jsx
│   └── FillingPage.jsx
├── components/
│   └── ui/
├── services/
└── __tests__/
    └── pages/

electron/
├── main.cjs
└── preload.cjs
```

**Structure Decision**: Single desktop app repository. Feature implementation is
localized to existing pages, test files, and renderer-side validation contracts.

## Phase 0 Research Output

Research findings are documented in:
- `/workspaces/samira/specs/001-align-customer-model/research.md`

All technical unknowns are resolved without pending clarifications.

## Phase 1 Design Output

Design artifacts created:
- `/workspaces/samira/specs/001-align-customer-model/data-model.md`
- `/workspaces/samira/specs/001-align-customer-model/contracts/customer-workflow-contract.md`
- `/workspaces/samira/specs/001-align-customer-model/quickstart.md`

Agent context update executed:
- `.specify/scripts/bash/update-agent-context.sh opencode`

Post-Design Constitution Re-check:
- Preview-first UX: PASS
- Modular boundaries: PASS (with explicit temporary exception for FillingPage)
- Custom hooks ownership: PASS
- Data integrity: PASS
- Secure IPC: PASS
- Performance: PASS

Final Gate Decision: PASS

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| `FillingPage.jsx` remains >300 lines in this feature | Step 1 scope requires only targeted drawer autofill behavior updates to minimize regression risk in a heavily coupled page | Full page split inside this slice would expand scope beyond Step 1 and delay delivery of required data-integrity fixes |
