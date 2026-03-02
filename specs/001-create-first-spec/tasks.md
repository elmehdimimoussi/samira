# Tasks: LC Workspace and Workflow Modernization

**Input**: Design documents from `/specs/001-create-first-spec/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Include tests because the plan and constitution require regression-safe refactoring and new hook coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature folders and baseline refactor scaffolding.

- [X] T001 Create feature component directories in `src/components/filling/` and `src/components/settings/`
- [X] T002 Create hook test directory and placeholder index in `src/__tests__/hooks/`
- [X] T003 [P] Add feature section headers for new layout/fullscreen styles in `src/index.css`
- [X] T004 [P] Create feature QA tracking notes in `specs/001-create-first-spec/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared capabilities that block all user stories until complete.

**⚠️ CRITICAL**: No user story implementation begins before this phase is complete.

- [X] T005 Implement shared fullscreen state and Escape handling in `src/hooks/useFullscreen.js`
- [X] T006 [P] Add fullscreen overlay and reusable preview layout classes in `src/index.css`
- [X] T007 [P] Update responsive preview wrapper sizing behavior in `src/components/ResponsivePreviewWrapper.jsx`
- [X] T008 Reduce topbar/page-header vertical footprint in `src/App.jsx` and `src/index.css`
- [X] T009 Add fullscreen hook coverage tests in `src/__tests__/hooks/useFullscreen.test.js`

**Checkpoint**: Shared fullscreen/layout foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - Complete LC drafting with preview-first workspace (Priority: P1) 🎯 MVP

**Goal**: Deliver a preview-dominant filling experience with robust fullscreen behavior while preserving LC drafting flow.

**Independent Test**: Complete an LC draft from empty state, verify live preview updates, enter/exit fullscreen via button and Escape, and confirm data remains intact.

### Tests for User Story 1

- [X] T010 [P] [US1] Add LC form hook tests for state/save/reset in `src/__tests__/hooks/useLCForm.test.js`
- [X] T011 [P] [US1] Update filling page integration tests for preview/fullscreen flow in `src/__tests__/pages/FillingPage.test.jsx`

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement LC form orchestration hook in `src/hooks/useLCForm.js`
- [X] T013 [P] [US1] Build filling form component with section progress in `src/components/filling/FillingForm.jsx`
- [X] T014 [P] [US1] Build preview panel component for standard/fullscreen rendering in `src/components/filling/PreviewPanel.jsx`
- [X] T015 [US1] Refactor page composition to use `useLCForm` and new components in `src/pages/FillingPage.jsx`
- [X] T016 [US1] Tune filling layout widths and viewport height rules in `src/index.css`
- [X] T017 [US1] Ensure save success/failure user feedback is preserved in `src/pages/FillingPage.jsx`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Auto-fill drawer details from customer selection (Priority: P2)

**Goal**: Enable keyboard-accessible customer autocomplete that overwrites mapped drawer fields deterministically.

**Independent Test**: In LC drafting, use keyboard and mouse to select customers, confirm mapped fields overwrite in one action, and verify Escape closes suggestions without committing.

### Tests for User Story 2

- [X] T018 [P] [US2] Add keyboard navigation and overwrite behavior tests in `src/__tests__/hooks/useDrawerAutocomplete.test.js`
- [X] T019 [P] [US2] Extend filling page interaction coverage for autocomplete UX in `src/__tests__/pages/FillingPage.test.jsx`

### Implementation for User Story 2

- [X] T020 [US2] Add active index and keyboard handlers in `src/hooks/useDrawerAutocomplete.js`
- [X] T021 [US2] Integrate `onKeyDown` and selection commit behavior in `src/components/filling/FillingForm.jsx`
- [X] T022 [US2] Add active option highlighting and accessibility attributes in `src/components/filling/FillingForm.jsx`
- [X] T023 [US2] Enforce full mapped-field overwrite on selection in `src/hooks/useDrawerAutocomplete.js`
- [X] T024 [US2] Handle no-match and optional-field edge cases in `src/hooks/useDrawerAutocomplete.js`

**Checkpoint**: User Story 2 is independently functional and testable.

---

## Phase 5: User Story 3 - Manage template layout with stable editing experience (Priority: P3)

**Goal**: Refactor template designer into focused modules while preserving template editing, save/load, and related operations.

**Independent Test**: Edit a frame, save, reload, and confirm persisted layout; verify designer and general settings tabs remain usable.

### Tests for User Story 3

- [X] T025 [P] [US3] Add template designer hook tests for frame CRUD and interactions in `src/__tests__/hooks/useTemplateDesigner.test.js`
- [X] T026 [P] [US3] Update settings page integration tests for refactored layout behavior in `src/__tests__/pages/SettingsPage.test.jsx`

### Implementation for User Story 3

- [X] T027 [P] [US3] Implement template designer state and handlers in `src/hooks/useTemplateDesigner.js`
- [X] T028 [P] [US3] Build canvas and toolbar module in `src/components/settings/TemplateDesignerCanvas.jsx`
- [X] T029 [P] [US3] Build properties and frame list module in `src/components/settings/TemplatePropertiesPanel.jsx`
- [X] T030 [US3] Refactor settings page composition using extracted modules in `src/pages/SettingsPage.jsx`
- [X] T031 [US3] Adjust designer split layout and responsive behavior in `src/index.css`

**Checkpoint**: User Story 3 is independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final regression checks, cross-story alignment, and documentation sync.

- [X] T032 [P] Verify contracts and acceptance alignment in `specs/001-create-first-spec/contracts/fullscreen-preview-contract.md` and `specs/001-create-first-spec/contracts/customer-autocomplete-contract.md`
- [X] T033 [P] Update final manual QA outcomes in `specs/001-create-first-spec/quickstart.md`
- [X] T034 Run full validation commands and capture status notes in `specs/001-create-first-spec/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: starts immediately.
- **Phase 2 (Foundational)**: depends on Phase 1; blocks all story phases.
- **Phase 3 (US1)**: depends on Phase 2; forms MVP.
- **Phase 4 (US2)**: depends on Phase 2 and integrates with US1 filling modules.
- **Phase 5 (US3)**: depends on Phase 2; independent from US2; can run in parallel with Phase 4 after Phase 2.
- **Phase 6 (Polish)**: depends on all targeted stories being complete.

### User Story Dependencies

- **US1 (P1)**: no user-story dependency after foundational completion.
- **US2 (P2)**: depends on US1 component split in `src/components/filling/FillingForm.jsx`.
- **US3 (P3)**: no dependency on US1/US2 logic after foundational completion.

### Parallel Opportunities

- Setup tasks `T003` and `T004` can run in parallel after `T001`/`T002`.
- Foundational tasks `T006` and `T007` can run in parallel after `T005` starts.
- US1 tasks `T012`, `T013`, and `T014` can run in parallel before integration task `T015`.
- US2 tests `T018` and `T019` can run in parallel; implementation tasks `T023` and `T024` can run in parallel after `T020`.
- US3 tasks `T027`, `T028`, and `T029` can run in parallel before composition task `T030`.

---

## Parallel Example: User Story 1

```bash
Task: "Implement LC form orchestration hook in src/hooks/useLCForm.js"
Task: "Build filling form component in src/components/filling/FillingForm.jsx"
Task: "Build preview panel component in src/components/filling/PreviewPanel.jsx"
```

## Parallel Example: User Story 2

```bash
Task: "Add keyboard navigation tests in src/__tests__/hooks/useDrawerAutocomplete.test.js"
Task: "Extend filling page autocomplete tests in src/__tests__/pages/FillingPage.test.jsx"
```

## Parallel Example: User Story 3

```bash
Task: "Implement template designer hook in src/hooks/useTemplateDesigner.js"
Task: "Build TemplateDesignerCanvas in src/components/settings/TemplateDesignerCanvas.jsx"
Task: "Build TemplatePropertiesPanel in src/components/settings/TemplatePropertiesPanel.jsx"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and run independent test criteria.
3. Demo preview-first drafting + fullscreen behavior before expanding scope.

### Incremental Delivery

1. Deliver US1 as MVP.
2. Add US2 autocomplete keyboard workflow and re-run filling regressions.
3. Add US3 template management refactor and run settings regressions.
4. Finish with Phase 6 cross-cutting validation.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. Then split: one engineer on US2, one on US3, while US1 owner handles merge/integration checkpoints.
3. Rejoin for polish and full validation.

---

## Notes

- Tasks follow strict checklist format with IDs, optional `[P]`, required `[USx]` labels for story tasks, and exact file paths.
- Each user story phase includes an independent test criterion for standalone verification.
