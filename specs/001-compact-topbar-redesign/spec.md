# Feature Specification: Compact Topbar Redesign

**Feature Branch**: `[001-compact-topbar-redesign]`  
**Created**: 2026-02-23  
**Status**: Draft  
**Input**: User description: "Read STEPE 2 from docs/implementation-plan.md - and according to the best practices of Github's speckit, create the first spec"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Faster Workspace Access (Priority: P1)

As an LC operator, I want a slimmer topbar so I can see more of the working area while keeping navigation clear.

**Why this priority**: This change improves everyday efficiency in all main workflows by freeing vertical space immediately.

**Independent Test**: Open the application shell, move through all top-level sections, and verify content area height is visibly larger with no navigation breakage.

**Acceptance Scenarios**:

1. **Given** the application shell is loaded on a standard desktop viewport, **When** the topbar is displayed, **Then** visible main-content height increases by at least 8% versus baseline.
2. **Given** a user selects any top-level tab, **When** navigation occurs, **Then** the correct section opens and remains stable.
3. **Given** a section is active, **When** the topbar is rendered, **Then** the active tab remains clearly distinguishable from inactive tabs.

---

### User Story 2 - Keyboard-Accessible Navigation (Priority: P2)

As a keyboard-first user, I want all topbar controls to remain reachable and operable so I can navigate without a mouse.

**Why this priority**: Accessibility and operability are required for dependable use across user preferences and environments.

**Independent Test**: Use keyboard-only navigation from topbar start to end and confirm every control can be focused and activated with clear visual feedback.

**Acceptance Scenarios**:

1. **Given** keyboard-only interaction, **When** the user tabs through the topbar, **Then** each control receives visible focus in a logical order.
2. **Given** a topbar tab is focused, **When** the user activates it from keyboard input, **Then** the application navigates to the corresponding section.

---

### User Story 3 - Mobile Tab Reachability (Priority: P3)

As a mobile user, I want horizontal tab scrolling preserved so all tabs remain reachable on smaller screens.

**Why this priority**: The compact topbar must keep small-screen usability intact while improving workspace density.

**Independent Test**: View the app on a narrow viewport and verify all tabs can be discovered and selected via horizontal scrolling.

**Acceptance Scenarios**:

1. **Given** a narrow viewport, **When** all tabs cannot fit in one row width, **Then** the tab list remains horizontally scrollable.
2. **Given** the user scrolls the tabs and selects one, **When** selection occurs, **Then** navigation and active-state behavior match desktop behavior.

---

### Edge Cases

- Long tab labels reduce available horizontal room but must not make tabs unselectable.
- Very small viewport heights must keep topbar controls visible and operable.
- Rapid tab switching must not cause incorrect active-state highlighting.
- Increased browser zoom must preserve tab discoverability and control operability.

### Supported Viewports

- Desktop baseline: 1440x900.
- Narrow mobile checks: 390x844 and 320x568.
- Small-height stress check: 1024x600.
- Zoom checks: 100%, 150%, and 200%.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present a single-row topbar containing brand area, navigation tabs, and utility controls.
- **FR-002**: System MUST reduce the topbar vertical footprint compared with the existing baseline.
- **FR-003**: System MUST preserve current top-level navigation outcomes for all tabs.
- **FR-004**: System MUST preserve clear active-state visibility for the selected tab.
- **FR-005**: System MUST allow keyboard users to focus and activate every topbar control.
- **FR-006**: System MUST keep horizontal tab scrolling available on narrow viewports.
- **FR-007**: System MUST prevent topbar control overlap or clipping across supported viewport sizes.
- **FR-008**: System MUST retain navigation behavior parity between pointer and keyboard interactions.
- **FR-009**: System MUST provide a measurable increase in visible vertical workspace for main content on desktop layouts.

### Key Entities *(include if feature involves data)*

- **Topbar**: Application shell navigation surface that groups brand, primary tabs, and utility controls.
- **Navigation Tab**: Selectable item that routes users to a top-level section and reflects inactive, focused, and active states.
- **Utility Control**: Non-tab control in the topbar used for global actions while remaining keyboard reachable.

### Constitution Alignment *(mandatory for LC Pro)*

- **CA-001 Preview Impact**: The reduced topbar height increases available page workspace, improving preview prominence where preview panels are used.
- **CA-002 Component Boundaries**: Scope is limited to shell presentation and interaction behavior; business logic ownership remains unchanged.
- **CA-003 Hook Ownership**: No new complex state ownership is introduced; existing state hooks continue to own behavior.
- **CA-004 Data Integrity**: No data contracts are changed; existing field validation expectations are unaffected.
- **CA-005 IPC Safety**: No new bridge actions are required; current safe behavior and user feedback pathways remain intact.
- **CA-006 Performance**: Navigation interactions must remain responsive under normal usage with no visible lag introduced by the redesign.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can reach any top-level section from the topbar in one selection with no observed navigation errors during acceptance testing.
- **SC-002**: The main content area shows at least 8% more vertical space on standard desktop viewport compared to the pre-change baseline.
- **SC-003**: 100% of topbar controls are reachable and activatable using keyboard-only interaction in acceptance testing.
- **SC-004**: On narrow viewports, all top-level tabs remain reachable through horizontal scrolling with zero clipped or inaccessible tabs.
- **SC-005**: Post-change regression checks show no high-severity app-shell navigation defects.

## Assumptions

- Baseline comparison uses the application shell behavior immediately before this feature branch.
- Existing top-level sections and their labels remain unchanged by this feature.
- Supported viewports include desktop and mobile form factors already covered by current product QA.
- "Supported viewport sizes" for this feature means 1440x900, 390x844, 320x568, and 1024x600.
