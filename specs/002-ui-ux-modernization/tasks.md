# Tasks: UI/UX Modernization

**Input**: Design documents from `/specs/002-ui-ux-modernization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the styling system

- [X] T001 Update global CSS and Tailwind config to ensure `darkMode: 'class'` is fully configured in `src/index.css` or `tailwind.config.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI components and state management needed across multiple user stories

- [X] T002 Update `src/components/ThemeToggle.jsx` to properly maintain the `dark` class on the root HTML element and persist the `ThemeState`
- [X] T003 Create scalable, keyboard-accessible `Accordion` component in `src/components/ui/Accordion.jsx` using React state and Tailwind
- [X] T004 Create Vitest unit test in `src/__tests__/components/Accordion.test.jsx` to ensure accessibility and toggle state logic

**Checkpoint**: Foundation ready - basic theme context and shared UI components are complete.

---

## Phase 3: User Story 1 - Global Application Modernization (Priority: P1) 🎯 MVP

**Goal**: Establish a cohesive modern visual foundation, including consistent spacing, typography, and dark mode support across all main views.

**Independent Test**: Verify that the entire app toggles smoothly between light and dark modes, and that secondary pages have consistent visual rhythm and border radii.

### Implementation for User Story 1

- [X] T005 [P] [US1] Apply consistent layout structure and dark mode class variants (`dark:bg-slate-900`, etc.) in top-level app wrapper `src/App.jsx`
- [X] T006 [P] [US1] Refactor `src/pages/CustomersPage.jsx` to utilize consistent Tailwind spacing (e.g., `p-6`, `gap-4`, `rounded-xl`) and dark mode support
- [X] T007 [P] [US1] Refactor `src/pages/HistoryPage.jsx` to utilize consistent Tailwind spacing (e.g., `p-6`, `gap-4`, `rounded-xl`) and dark mode support
- [X] T008 [P] [US1] Refactor `src/pages/SettingsPage.jsx` layout shell for visual consistency and standard spacing
- [X] T009 [P] [US1] Refactor `src/pages/FillingPage.jsx` layout shell for visual consistency and standard spacing

**Checkpoint**: Core application layout is unified and toggles perfectly in dark mode.

---

## Phase 4: User Story 2 - Field Settings Interface Refinement (Priority: P1)

**Goal**: Refactor the side panel configuration for fields to reduce visual clutter and cognitive load.

**Independent Test**: Verify that a user can open the Settings page, click a field on the canvas, and see properties grouped logically within single-open Accordion panels.

### Implementation for User Story 2

- [X] T010 [US2] Update `src/components/settings/TemplatePropertiesPanel.jsx` to replace flat properties with logically grouped `Accordion` categories (General, Position, Appearance)
- [X] T011 [US2] Improve visual interactive feedback (focus rings, button styling) strictly within the properties panel in `src/components/settings/TemplatePropertiesPanel.jsx`

**Checkpoint**: Settings UI is less cluttered and utilizes the foundational Accordion component successfully.

---

## Phase 5: User Story 3 - Enhanced Filling Experience on the Filling Page (Priority: P2)

**Goal**: Implement "Focus Mode" during form filling to minimize distraction by highlighting the active field prominently and dimming the rest.

**Independent Test**: On the Filling page, clicking into one input should render it visually dominant (glow/ring) while immediately reducing the opacity/contrast of sibling inputs.

### Tests for User Story 3

- [X] T012 [P] [US3] Create unit tests in `src/__tests__/hooks/useFocusMode.test.js` to verify state transitions mapped to focus/blur events

### Implementation for User Story 3

- [X] T013 [P] [US3] Create `src/hooks/useFocusMode.js` hook to track `activeFieldId` and manage focus/blur event handlers
- [X] T014 [US3] Refactor `src/components/filling/FillingForm.jsx` to consume `useFocusMode`
- [X] T015 [US3] Add conditional Tailwind classes (e.g., `opacity-40 grayscale-50 delay-100`) to unfocused sibling inputs in `src/components/filling/FillingForm.jsx` 
- [X] T015b [US3] Integrate inline form validation error displays (FR-005) in `src/components/filling/FillingForm.jsx` utilizing fixed minimum heights or absolute positioning to avoid layout shift when errors appear

**Checkpoint**: The filling experience actively adapts dynamically to guide user attention without disruptive layout shifts when errors occur.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validations before merging.

- [X] T016 Audit and ensure complete keyboard navigability (focus states, Tab jumps, Enter/Space activation) in `TemplatePropertiesPanel.jsx` and `FillingForm.jsx`
- [X] T017 Audit color contrast dynamically in both light and dark modes to meet accessibility standards
- [X] T018 Run `npm test` and `npm run lint` to verify zero failing validations or coverage dips

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Stories (Phase 3+)**: US1, US2, and US3 can start in parallel after Foundational.
- **Polish (Final Phase)**: Depends on completion of all US implementations.

### Implementation Strategy

- Initial PR should cover Phase 1 & 2 alongside US1 to lay the groundwork and make immediate visual impact (MVP).
- Follow-up PRs can introduce the targeted behaviors: US2 (Settings Panel) and US3 (Focus Mode).
