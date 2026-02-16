# Tasks: LC Preview Workspace Refactor

**Input**: Design documents from `/specs/001-lc-preview-layout/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Keep existing Vitest coverage aligned with UI changes; no new test framework.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label for story-phase tasks only (`[US1]`, `[US2]`, `[US3]`)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish baseline and coverage inventory used by implementation and validation.

- [X] T001 Inventory all preview rendering contexts and zoom entry points in `specs/001-lc-preview-layout/research.md`
- [ ] T002 Record pre-refactor preview-area baseline measurements for 1366px and 1920px in `specs/001-lc-preview-layout/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core constraints shared by all stories (zoom lock, fit-only scale contract, and persistence audit).

**⚠️ CRITICAL**: No user story work should start until this phase is complete.

- [X] T003 Implement main-process zoom lock and zoom-shortcut interception in `electron/main.cjs`
- [X] T004 Implement renderer wheel-zoom prevention guard in `electron/preload.cjs`
- [X] T005 Refactor shared preview wrapper to fit-only scaling API in `src/components/ResponsivePreviewWrapper.jsx`
- [X] T006 Audit and remove any zoom preference persistence reads/writes in `src/pages/FillingPage.jsx`
- [X] T007 [P] Audit and remove any zoom preference persistence reads/writes in `src/pages/SettingsPage.jsx`

**Checkpoint**: Foundation ready - story work can proceed.

---

## Phase 3: User Story 1 - Remove Preview Zoom Controls (Priority: P1) 🎯 MVP

**Goal**: Ensure no page with bill preview exposes zoom controls or accepts zoom-changing input methods.

**Independent Test**: On Fill, Settings, and all identified preview contexts, confirm no zoom UI and no scale change from ctrl/cmd wheel/plus/minus/reset.

### Implementation for User Story 1

- [X] T008 [US1] Remove Fill-page zoom state, controls, and zoom prop usage in `src/pages/FillingPage.jsx`
- [X] T009 [US1] Remove Settings-page zoom state/controls and keep drag-resize accuracy without user zoom in `src/pages/SettingsPage.jsx`
- [X] T010 [US1] Apply no-zoom behavior to any additional discovered preview context in `src/pages/FillingPage.jsx`
- [X] T011 [P] [US1] Update Fill-page preview assertions for no-zoom behavior in `src/__tests__/pages/FillingPage.test.jsx`
- [X] T012 [P] [US1] Update Settings-page assertions to remove zoom UI expectations in `src/__tests__/pages/SettingsPage.test.jsx`

**Checkpoint**: US1 is independently functional and testable.

---

## Phase 4: User Story 2 - Maximize Preview Workspace (Priority: P2)

**Goal**: Increase visible, readable preview area on Fill and Settings by at least 20% at 1366px and 1920px.

**Independent Test**: At 1366px and 1920px widths, measured preview area on Fill and Settings is at least 20% larger than baseline and remains readable during resize.

### Implementation for User Story 2

- [X] T013 [US2] Rebalance Fill layout proportions and preview height behavior in `src/index.css`
- [X] T014 [US2] Rebalance Settings designer layout and canvas viewport sizing in `src/index.css`
- [X] T015 [US2] Align Fill preview container structure/classes with enlarged layout intent in `src/pages/FillingPage.jsx`
- [X] T016 [US2] Align Settings canvas container structure/classes with enlarged layout intent in `src/pages/SettingsPage.jsx`
- [X] T017 [US2] Add measurement instructions and pass thresholds for preview-area increase in `specs/001-lc-preview-layout/quickstart.md`

**Checkpoint**: US2 is independently functional and testable.

---

## Phase 5: User Story 3 - Replace Sidebar with Compact Top Navigation (Priority: P3)

**Goal**: Replace left sidebar with compact top navigation while preserving route access and keyboard operability.

**Independent Test**: Sidebar is absent, compact top navigation is present, all four routes are reachable, and keyboard navigation (Tab + Enter/Space) works with visible focus.

### Implementation for User Story 3

- [X] T018 [US3] Refactor app shell from sidebar to compact top navigation in `src/App.jsx`
- [X] T019 [US3] Replace sidebar styles with top-navigation styles and update print selectors in `src/index.css`
- [X] T020 [US3] Update app-shell routing/navigation assertions for top-bar behavior in `src/__tests__/App.test.jsx`
- [X] T021 [US3] Add keyboard focus and keyboard activation assertions for top navigation in `src/__tests__/App.test.jsx`

**Checkpoint**: US3 is independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, explicit regression checks, and quality verification.

- [X] T022 [P] Remove dead zoom/sidebar styling residues and normalize shared layout classes in `src/index.css`
- [X] T023 [P] Add explicit regression verification steps for settings save/reload, history access, and printing in `specs/001-lc-preview-layout/quickstart.md`
- [ ] T024 Validate top-nav route-switch responsiveness target and record observed timings in `specs/001-lc-preview-layout/quickstart.md`
- [ ] T025 Run full quickstart checklist and record final outcomes in `specs/001-lc-preview-layout/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2; can proceed independently of US1 and US3.
- **Phase 5 (US3)**: Depends on Phase 2; can proceed independently of US1 and US2.
- **Phase 6 (Polish)**: Depends on completion of selected user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after foundational phase; no dependency on US2/US3.
- **US2 (P2)**: Starts after foundational phase; no dependency on US1/US3.
- **US3 (P3)**: Starts after foundational phase; no dependency on US1/US2.

### Within Each User Story

- Remove/replace obsolete behavior first, then align tests and validation notes.
- Complete story-specific updates before cross-cutting polish tasks.

---

## Parallel Opportunities

- **Phase 2**: T006 and T007 can run in parallel.
- **US1**: T011 and T012 can run in parallel once T008 and T009 are complete.
- **Polish**: T022 and T023 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "Update Fill-page preview assertions for no-zoom behavior in src/__tests__/pages/FillingPage.test.jsx"
Task: "Update Settings-page assertions to remove zoom UI expectations in src/__tests__/pages/SettingsPage.test.jsx"
```

## Parallel Example: Foundational

```bash
Task: "Audit and remove any zoom preference persistence reads/writes in src/pages/FillingPage.jsx"
Task: "Audit and remove any zoom preference persistence reads/writes in src/pages/SettingsPage.jsx"
```

## Parallel Example: Polish

```bash
Task: "Remove dead zoom/sidebar styling residues and normalize shared layout classes in src/index.css"
Task: "Add explicit regression verification steps for settings save/reload, history access, and printing in specs/001-lc-preview-layout/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate no-zoom behavior independently using quickstart checklist.

### Incremental Delivery

1. Deliver US1 (zoom removal) as MVP.
2. Deliver US2 (preview workspace increase).
3. Deliver US3 (top navigation shell).
4. Finish with Phase 6 polish and full regression pass.

### Parallel Team Strategy

1. One engineer completes foundational zoom guards.
2. After Phase 2, assign:
   - Engineer A: US1 (zoom behavior removal)
   - Engineer B: US2 (preview workspace expansion)
   - Engineer C: US3 (top navigation shell)
3. Merge and run Phase 6 cross-cutting validation.

---

## Notes

- All tasks follow required checklist format: checkbox, task ID, optional `[P]`, required `[USx]` in story phases, and explicit file path.
- Scope remains UI-only: no new IPC or data-schema contracts.
- Validate printing, resize, DPI, multi-monitor behavior, and route-switch responsiveness before closure.
