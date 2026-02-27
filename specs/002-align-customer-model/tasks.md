# Tasks: Customer Data Alignment and Drawer Autofill

**Input**: Design documents from `/workspaces/samira/specs/001-align-customer-model/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test-authoring tasks are included because TDD was not explicitly requested in the feature spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared schema and constants used by story implementation.

- [X] T001 Create customer validation module in `src/validation/customerSchema.js`
- [X] T002 [P] Define shared empty customer form model in `src/pages/CustomersPage.jsx`
- [X] T003 [P] Create customer form hook scaffold in `src/hooks/useCustomerForm.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core changes that block all user stories in this feature.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Wire `zod` parse/validation flow into save/update path in `src/pages/CustomersPage.jsx`
- [X] T005 Expand customer search predicate for account and agency in `src/pages/CustomersPage.jsx`
- [X] T006 Add consistent success/error toast handling guardrails in `src/pages/CustomersPage.jsx`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Maintain complete customer records (Priority: P1) 🎯 MVP

**Goal**: Users can create/edit complete customer records with LC-required drawer fields.

**Independent Test**: Add and edit one customer with name/address/account/agency/city/additional info and verify all values appear correctly in the list.

### Implementation for User Story 1

- [X] T007 [US1] Add `account_number` and `agency` state fields in `src/pages/CustomersPage.jsx`
- [X] T008 [US1] Populate add/edit modal defaults with full customer fields in `src/pages/CustomersPage.jsx`
- [X] T009 [US1] Add account number input control to customer modal in `src/pages/CustomersPage.jsx`
- [X] T010 [US1] Add agency input control to customer modal in `src/pages/CustomersPage.jsx`
- [X] T011 [US1] Add account number and agency columns in customer table in `src/pages/CustomersPage.jsx`
- [X] T012 [US1] Update search placeholder copy for expanded searchable fields in `src/pages/CustomersPage.jsx`
- [X] T013 [US1] Extract customer add/edit modal form into `src/components/customers/CustomerFormModal.jsx` and integrate in `src/pages/CustomersPage.jsx`

**Checkpoint**: User Story 1 is functional and independently testable.

---

## Phase 4: User Story 2 - Autofill drawer data from customer selection (Priority: P2)

**Goal**: Customer selection in drawer autocomplete fills all linked drawer fields atomically.

**Independent Test**: In filling flow, select a customer and verify drawer name, address, account number, agency, and city update together.

### Implementation for User Story 2

- [X] T014 [US2] Create drawer autocomplete hook in `src/hooks/useDrawerAutocomplete.js`
- [X] T015 [US2] Extend customer-to-drawer field mapping for account number and agency in `src/hooks/useDrawerAutocomplete.js`
- [X] T016 [US2] Preserve non-selected typing behavior so only confirmed selection overwrites related fields in `src/hooks/useDrawerAutocomplete.js`
- [X] T017 [US2] Integrate drawer autocomplete hook into `src/pages/FillingPage.jsx`
- [X] T018 [US2] Ensure missing optional customer fields map to empty strings and partial-name matching stays stable in `src/hooks/useDrawerAutocomplete.js`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Prevent malformed customer updates (Priority: P3)

**Goal**: Invalid customer payloads are blocked before persistence with clear guidance.

**Independent Test**: Attempt customer save with invalid name and confirm blocking feedback, then correct and save successfully.

### Implementation for User Story 3

- [X] T019 [US3] Add trimmed-name required validation message mapping in `src/validation/customerSchema.js`
- [X] T020 [US3] Apply validation errors to user-facing toasts before IPC submit in `src/pages/CustomersPage.jsx`
- [X] T021 [US3] Prevent create/update IPC invocation when schema parsing fails in `src/pages/CustomersPage.jsx`
- [X] T022 [US3] Preserve existing customer records with empty optional fields during edit/save in `src/pages/CustomersPage.jsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cross-story quality checks.

- [X] T023 [P] Update feature quickstart verification notes in `specs/001-align-customer-model/quickstart.md`
- [ ] T024 Run end-to-end manual validation checklist from `specs/001-align-customer-model/quickstart.md`
- [X] T025 Run regression test command `npm test` from repository root `/workspaces/samira`
- [X] T026 Run lint command `npm run lint` from repository root `/workspaces/samira`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks user stories.
- **Phase 3 (US1)**: Depends on Phase 2; MVP delivery phase.
- **Phase 4 (US2)**: Depends on Phase 2 and customer data fields from US1.
- **Phase 5 (US3)**: Depends on Phase 2 and shared validation model from Setup.
- **Phase 6 (Polish)**: Depends on completion of desired user stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories.
- **US2 (P2)**: Depends on US1 customer field availability for full autofill mapping.
- **US3 (P3)**: Can run after foundational validation wiring and is independent from US2.

### Parallel Opportunities

- T002 and T003 can run in parallel in Setup.
- In US1, T009 and T010 can run in parallel after T008.
- In US2, T015 and T016 can run in parallel after T014.
- In US3, T020 and T022 can run in parallel after T019.
- In Polish, T023 can run in parallel with T024.

---

## Parallel Example: User Story 1

```bash
# After completing T008, implement modal inputs in parallel:
Task: "T009 [US1] Add account number input control in src/pages/CustomersPage.jsx"
Task: "T010 [US1] Add agency input control in src/pages/CustomersPage.jsx"
```

## Parallel Example: User Story 2

```bash
# After completing T014, evolve mapping behavior in parallel:
Task: "T015 [US2] Extend account/agency mapping in src/hooks/useDrawerAutocomplete.js"
Task: "T016 [US2] Preserve non-selected typing behavior in src/hooks/useDrawerAutocomplete.js"
```

## Parallel Example: User Story 3

```bash
# After completing T019, improve feedback and compatibility in parallel:
Task: "T020 [US3] Apply validation errors to user-facing toasts in src/pages/CustomersPage.jsx"
Task: "T022 [US3] Preserve legacy empty optional fields in src/pages/CustomersPage.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently via its checkpoint.
4. Demo customer data alignment before continuing.

### Incremental Delivery

1. Deliver US1 for complete customer records.
2. Deliver US2 for atomic drawer autofill.
3. Deliver US3 for malformed-input prevention and clearer feedback.
4. Run Polish phase validation gates.

### Parallel Team Strategy

1. One developer completes foundational wiring (Phase 1-2).
2. Then split work by story:
   - Developer A: US1
   - Developer B: US2
   - Developer C: US3
3. Merge and run Phase 6 quality gates together.

---

## Notes

- [P] tasks target different files or independent edit areas.
- Story labels ensure traceability back to `spec.md` priorities.
- Each story includes an independent test criterion for standalone verification.
