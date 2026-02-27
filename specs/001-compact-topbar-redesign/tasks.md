# Tasks: Compact Topbar Redesign

**Input**: Design documents from `/workspaces/samira/specs/001-compact-topbar-redesign/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The feature spec requires independent verification per story; this task list includes targeted updates to existing app-shell regression tests and manual validation evidence.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align feature documents and validation protocols before code changes.

- [X] T001 Align route label spelling across validation docs in `specs/001-compact-topbar-redesign/contracts/ui-navigation-contract.md`
- [X] T002 [P] Add baseline vs redesigned workspace measurement worksheet details in `specs/001-compact-topbar-redesign/quickstart.md`
- [X] T003 [P] Add nav responsiveness evidence capture template (20-sample p95 protocol) in `specs/001-compact-topbar-redesign/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared app-shell structure and guardrails used by all stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Define a single-source `navItems` contract (label/path/icon/description) in `src/App.jsx`
- [X] T005 Implement Tailwind-first topbar shell structure with explicit navigation landmark semantics in `src/App.jsx`
- [X] T006 [P] Add/adjust route mapping and unknown-route fallback coverage in `src/__tests__/App.test.jsx`
- [X] T007 [P] Add reusable workspace gain and latency calculation helpers in `src/__tests__/appShellMetrics.js`
- [X] T008 Remove or trim conflicting legacy `.topbar*` selectors after Tailwind migration in `src/index.css`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Faster Workspace Access (Priority: P1) 🎯 MVP

**Goal**: Deliver a slimmer single-row topbar that increases visible workspace while preserving route correctness.

**Independent Test**: Run shell at desktop baseline (1440x900), verify all top-level routes work, and confirm measured `main` workspace gain is at least 8% versus baseline.

### Implementation for User Story 1

- [X] T009 [US1] Reduce topbar vertical density (height, paddings, gaps) using Tailwind utility classes in `src/App.jsx`
- [X] T010 [US1] Ensure active destination remains visually distinct under compact density in `src/App.jsx`
- [X] T011 [US1] Add active-state singularity and compact-shell regression assertions in `src/__tests__/App.test.jsx`
- [X] T012 [US1] Add workspace gain threshold assertions using shared metrics helpers in `src/__tests__/App.test.jsx`
- [X] T013 [US1] Finalize US1 manual verification wording and pass/fail thresholds in `specs/001-compact-topbar-redesign/quickstart.md`

**Checkpoint**: User Story 1 is independently functional and demo-ready as MVP.

---

## Phase 4: User Story 2 - Keyboard-Accessible Navigation (Priority: P2)

**Goal**: Keep all topbar navigation and utility controls fully keyboard reachable and activatable.

**Independent Test**: Using keyboard only (Tab, Shift+Tab, Enter), verify focus order, activation, and visible focus indication across all topbar interactive controls.

### Implementation for User Story 2

- [X] T014 [US2] Ensure all topbar controls expose keyboard-focusable semantics and accessible names in `src/App.jsx`
- [X] T015 [US2] Implement explicit focus-visible styling distinct from active/hover states with Tailwind classes in `src/App.jsx`
- [X] T016 [US2] Extend keyboard traversal and activation regression checks for top navigation and utility controls in `src/__tests__/App.test.jsx`
- [X] T017 [US2] Add keyboard-only validation notes for focus order and activation parity in `specs/001-compact-topbar-redesign/quickstart.md`

**Checkpoint**: User Stories 1 and 2 both pass independent validation.

---

## Phase 5: User Story 3 - Mobile Tab Reachability (Priority: P3)

**Goal**: Preserve horizontal tab reachability on narrow screens and prevent clipping/overlap at supported small-height and zoom conditions.

**Independent Test**: At 390x844 and 320x568, verify tabs scroll horizontally and all destinations are reachable; at 1024x600 with zoom 100/150/200, verify controls remain visible and operable.

### Implementation for User Story 3

- [X] T018 [US3] Implement single-row horizontal overflow behavior with non-shrinking nav items in `src/App.jsx`
- [X] T019 [US3] Add narrow-width and small-height anti-clipping layout safeguards in `src/App.jsx`
- [X] T020 [US3] Extend responsive regression checks for overflow reachability and no-clipping behavior in `src/__tests__/App.test.jsx`
- [X] T021 [US3] Update viewport/zoom matrix validation steps in `specs/001-compact-topbar-redesign/quickstart.md`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cross-story verification, quality gates, and evidence capture.

- [X] T022 [P] Capture measured workspace gain and p95 nav latency evidence in `specs/001-compact-topbar-redesign/quickstart.md`
- [X] T023 Run targeted shell regression command `npm test -- src/__tests__/App.test.jsx` from `/workspaces/samira`
- [X] T024 Run full quality gates `npm test && npm run lint` from `/workspaces/samira`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2; delivers MVP.
- **Phase 4 (US2)**: Depends on Phase 2; functionally independent from US1 but validated against compact layout.
- **Phase 5 (US3)**: Depends on Phase 2; functionally independent from US1 but validated against compact layout.
- **Phase 6 (Polish)**: Depends on completion of selected user stories.

### User Story Dependencies

- **US1 (P1)**: Independent after Foundational phase.
- **US2 (P2)**: Independent after Foundational phase.
- **US3 (P3)**: Independent after Foundational phase.

### Parallel Opportunities

- T002 and T003 can run in parallel during Setup.
- T006 and T007 can run in parallel during Foundational work.
- T014 and T016 can run in parallel after T005.
- T018 and T020 can run in parallel after T005.
- T022 can run in parallel with T023 once implementation is complete.

---

## Parallel Example: User Story 1

```bash
# After T009, behavioral assertion work and manual-verification wording can proceed in parallel:
Task: "T011 [US1] Add compact-shell and active-state assertions in src/__tests__/App.test.jsx"
Task: "T013 [US1] Finalize US1 verification wording in specs/001-compact-topbar-redesign/quickstart.md"
```

## Parallel Example: User Story 2

```bash
# After T014, test and docs updates can proceed in parallel:
Task: "T016 [US2] Extend keyboard regression checks in src/__tests__/App.test.jsx"
Task: "T017 [US2] Add keyboard-only validation notes in specs/001-compact-topbar-redesign/quickstart.md"
```

## Parallel Example: User Story 3

```bash
# After T018, responsive tests and matrix-document updates can proceed in parallel:
Task: "T020 [US3] Extend responsive regression checks in src/__tests__/App.test.jsx"
Task: "T021 [US3] Update viewport/zoom matrix validation in specs/001-compact-topbar-redesign/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently with workspace gain threshold and route regression checks.
4. Demo MVP before proceeding to US2/US3.

### Incremental Delivery

1. Deliver US1 (compact workspace gain + route stability).
2. Deliver US2 (keyboard operability and focus clarity).
3. Deliver US3 (mobile/zoom reachability without clipping).
4. Execute Phase 6 quality gates and evidence capture.

### Parallel Team Strategy

1. One developer completes Setup + Foundational tasks.
2. After Phase 2, split work by story:
   - Developer A: US1 compact density + workspace assertions.
   - Developer B: US2 keyboard/focus behavior.
   - Developer C: US3 mobile/zoom reachability.
3. Rejoin for Phase 6 validation commands and evidence capture.

---

## Notes

- [P] tasks target independent files or no direct dependency surfaces.
- Story labels map implementation work directly to prioritized user stories in `spec.md`.
- Each story has independent test criteria and a standalone validation checkpoint.
