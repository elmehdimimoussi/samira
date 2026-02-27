# Feature Specification: Customer Data Alignment and Drawer Autofill

**Feature Branch**: `001-align-customer-model`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "Read step 1 from docs/implementation-plan.md and, according to Spec-Kit best practices, create the first spec"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Maintain complete customer records (Priority: P1)

As a back-office user, I can create and edit customer records with all required
LC drawer fields so records are complete and reusable.

**Why this priority**: Accurate and complete customer records are the foundation
for all later LC form automation and document correctness.

**Independent Test**: Add and edit a customer with all required fields, then
verify the customer list reflects each saved value correctly.

**Acceptance Scenarios**:

1. **Given** a user opens the add-customer flow, **When** they submit required
   identity data and optional drawer details, **Then** a new customer record is
   saved with the entered values.
2. **Given** an existing customer record, **When** a user updates account,
   agency, city, or additional details, **Then** the updated values are visible
   immediately in the customer list and subsequent edits.

---

### User Story 2 - Autofill drawer data from customer selection (Priority: P2)

As a user filling an LC, I can select a saved customer and automatically fill all
related drawer fields in one action.

**Why this priority**: This reduces manual entry time and prevents mismatched
drawer data across fields.

**Independent Test**: Select a customer from drawer search and confirm all linked
drawer fields update at once in the form.

**Acceptance Scenarios**:

1. **Given** a saved customer with address, account number, agency, and city,
   **When** the user selects that customer in the drawer input, **Then** the
   form updates drawer name, address, account number, agency, and city together.
2. **Given** a saved customer with missing optional fields, **When** selected,
   **Then** available values are filled and missing values remain empty without
   blocking the user.

---

### User Story 3 - Prevent malformed customer updates (Priority: P3)

As a user, I receive clear validation feedback when customer inputs are invalid,
so only clean and usable customer data is stored.

**Why this priority**: Data quality safeguards reduce downstream LC errors and
support reliable customer reuse.

**Independent Test**: Attempt to save invalid customer input, verify save is
blocked with clear feedback, then correct values and save successfully.

**Acceptance Scenarios**:

1. **Given** invalid customer input, **When** the user submits, **Then** the
   system rejects the save and explains what must be corrected.
2. **Given** corrected valid input after an error, **When** the user submits,
   **Then** the system saves successfully and reflects updated data.

---

### Edge Cases

- When multiple customers share similar names in drawer search, the user MUST see
  multiple selectable suggestions and the selected record MUST determine the
  applied drawer values.
- When legacy customer records do not contain newly required drawer fields, the
  records MUST remain visible and editable, and missing fields MUST be displayed
  as empty values.
- When a user types a drawer name and then selects a different customer from
  suggestions, the selected customer values MUST replace current drawer fields in
  a single atomic update.
- When customer save/update/delete fails unexpectedly, the system MUST keep the
  existing persisted state unchanged and MUST show a failure message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow users to create customer records with the
  fields: name, address, account number, agency, city, and additional
  information.
- **FR-002**: The system MUST require customer name before a customer record can
  be saved.
- **FR-003**: The system MUST allow users to edit any existing customer field.
- **FR-004**: The system MUST display customer list columns for name, address,
  account number, agency, city, and additional information.
- **FR-005**: The system MUST support customer search by name, address, account
  number, agency, and city.
- **FR-006**: The system MUST preserve previously saved customer records and keep
  them visible even if some newly introduced fields are empty.
- **FR-007**: In the LC filling flow, customer selection for drawer data MUST
  update drawer name, address, account number, agency, and city in a single
  action.
- **FR-008**: The system MUST validate customer input before save/update and MUST
  reject invalid payloads by blocking submission and showing an explicit error
  message that identifies the invalid field.
- **FR-009**: The system MUST keep existing drawer values unchanged when a user
  does not confirm a customer selection.
- **FR-010**: The system MUST provide user-visible feedback for successful and
  failed customer create, update, and delete actions.

### Key Entities *(include if feature involves data)*

- **Customer**: A reusable business party profile used for LC drawer selection,
  with attributes: name, address, account number, agency, city, additional
  information, and audit timestamps.
- **LC Drawer Form Segment**: The subset of LC form fields representing the
  selected drawer party: drawer name, address, account number, agency, city.
- **Drawer Autocomplete Result**: A candidate customer shown during drawer search
  and selectable to populate the LC drawer form segment.

### Constitution Alignment *(mandatory for LC Pro)*

- **CA-001 Preview Impact**: This feature does not reduce preview area or alter
  fullscreen behavior; it improves data consistency for preview content.
- **CA-002 Component Boundaries**: Customer data entry and drawer selection logic
  remain isolated from preview rendering responsibilities.
- **CA-003 Hook Ownership**: Customer lookup and drawer autofill state transitions
  are centralized in form-state ownership boundaries, not scattered across UI
  fragments.
- **CA-004 Data Integrity**: Customer fields in storage and customer forms are
  aligned with required LC drawer fields, and invalid input is rejected before
  persistence.
- **CA-005 IPC Safety**: All persistence actions continue through the existing
  secure application bridge, with user-friendly failure feedback.
- **CA-006 Performance**: Autocomplete and autofill interactions maintain
  responsive typing and selection behavior for normal desktop datasets.

### Assumptions and Dependencies

- Existing customer records may have missing newer fields and remain valid.
- Drawer autocomplete behavior continues to trigger after minimum name input.
- This scope only covers Step 1 from the implementation plan and excludes
  topbar, fullscreen redesign, and large component extraction work.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In user testing, at least 95% of selected customers populate all
  available drawer fields in one action without manual correction.
- **SC-002**: Users can create or update a complete customer profile (including
  account number, agency, and city) in under 90 seconds median time.
- **SC-003**: At least 90% of malformed customer submissions are blocked before
  save, with users able to correct and resubmit successfully on first retry.
- **SC-004**: Manual entry steps for drawer fields are reduced by at least 60%
  when a matching customer already exists.
