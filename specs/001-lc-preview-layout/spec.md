# Feature Specification: LC Preview Workspace Refactor

**Feature Branch**: `001-lc-preview-layout`  
**Created**: 2026-02-16  
**Status**: Draft  
**Input**: User description: "Read @docs/implementaion-paln.md and according to the best practices of Github's speckit, create the first spec"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Remove Preview Zoom Controls (Priority: P1)

As an LC operator preparing bills, I want the preview to stay at a stable scale so I cannot accidentally zoom in or out and lose layout consistency while filling or reviewing data.

**Why this priority**: Unwanted zoom changes directly disrupt the core fill-and-verify workflow and can cause user mistakes.

**Independent Test**: Can be fully tested by opening each page that shows the preview and confirming there is no zoom UI and no input method that changes scale.

**Acceptance Scenarios**:

1. **Given** the user is on the Fill page preview, **When** the user looks for zoom controls, **Then** no zoom buttons, slider, or percentage readout are shown.
2. **Given** the user is on the Settings preview and any other preview context, **When** the user uses ctrl/cmd + wheel or ctrl/cmd + plus/minus/zero, **Then** preview scale does not change.
3. **Given** the user closes and reopens the app, **When** they return to a preview page, **Then** no zoom preference has been saved or restored.

---

### User Story 2 - Maximize Preview Workspace (Priority: P2)

As an LC operator, I want the bill preview to take a significantly larger visible area so I can verify content quickly and readably at common desktop window sizes.

**Why this priority**: Bigger preview visibility improves speed and confidence in data verification during daily operations.

**Independent Test**: Can be tested by comparing before/after at 1366px and 1920px widths and confirming preview visible area increases by at least 20% while remaining readable.

**Acceptance Scenarios**:

1. **Given** the app is opened on a common desktop width, **When** the Fill page is displayed, **Then** preview area is larger than before and remains readable.
2. **Given** the app window is resized across supported desktop sizes, **When** preview pages are viewed, **Then** the preview adapts responsively and remains the dominant visual work area without clipping core content.
3. **Given** the user is on Settings with preview/editor visible, **When** they work with fields, **Then** the preview/canvas area remains spacious enough for practical positioning and review.

---

### User Story 3 - Replace Sidebar with Compact Top Navigation (Priority: P3)

As an LC operator, I want a compact top navigation bar so I can switch quickly between Fill, Clients, History, and Settings without sacrificing horizontal preview space.

**Why this priority**: Navigation is essential, but moving it to a compact top bar recovers width for the primary preview workflow.

**Independent Test**: Can be tested by removing the sidebar, confirming top navigation is present, and validating route switching for all four sections.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the main layout appears, **Then** the left sidebar is absent and a compact top bar is present.
2. **Given** the top navigation is visible, **When** the user selects Fill, Clients, History, or Settings, **Then** the correct page opens and active state is clearly indicated.
3. **Given** keyboard-only navigation, **When** the user tabs through top navigation, **Then** links are reachable and operable.

---

### Edge Cases

- What happens when the app is at minimum supported window size? Preview should remain readable and no zoom controls or zoom input behavior should appear.
- What happens on high-DPI or mixed-DPI monitors? Preview scale should remain stable and not change through zoom shortcuts.
- What happens when printing is triggered from Fill after layout changes? The print flow should still produce expected output.
- What happens when users frequently switch routes? Form state and page accessibility should remain intact during navigation.

## Non-Functional Requirements

- **NFR-001**: At 1366px and 1920px desktop widths, preview visible area on Fill and Settings MUST increase by at least 20% compared with the pre-refactor baseline.
- **NFR-002**: Route switching via top navigation MUST feel immediate in normal desktop usage, with no visible lag above 200ms for page shell transitions.
- **NFR-003**: Top navigation MUST be keyboard-operable, including tab focus visibility and activation using Enter/Space.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST remove all user-visible zoom controls from every bill preview context, including Fill and Settings.
- **FR-002**: The system MUST prevent zoom scale changes through keyboard shortcuts (including plus, minus, and reset patterns) wherever the app preview is used.
- **FR-003**: The system MUST prevent zoom scale changes through ctrl/cmd + wheel gestures in preview workflows.
- **FR-004**: The system MUST NOT persist, restore, or expose a user zoom preference for bill preview surfaces.
- **FR-005**: The system MUST provide a preview visible-area increase of at least 20% on Fill and Settings compared with the previous layout baseline at 1366px and 1920px widths.
- **FR-006**: The system MUST prioritize preview workspace over navigation width usage in the default desktop layout.
- **FR-007**: The system MUST replace left sidebar navigation with a compact top navigation bar that supports switching between Fill, Clients, History, and Settings.
- **FR-008**: The system MUST preserve existing functional workflows for fill submission, settings save/reload, history access, and printing.
- **FR-009**: The system MUST preserve route-level access and active-state visibility for primary navigation destinations.
- **FR-010**: The system MUST maintain keyboard accessibility for primary navigation interactions.

### Key Entities *(include if feature involves data)*

- **Preview Workspace**: The visible bill preview area on pages where the bill is shown; key attributes include visibility size, readability, and non-zoomable behavior.
- **Primary Navigation Item**: A top bar entry representing one major app section (Fill, Clients, History, Settings); key attributes include label, destination, and active state.
- **Session UI State**: In-session user context that must remain stable through layout changes, including selected route, fill form progress, and settings editing context.

## Assumptions

- The four primary navigation destinations remain the same as current app routes (Fill, Clients, History, Settings).
- This feature is UI-focused and does not introduce new business data structures.
- Existing print and history workflows are considered mandatory regressions to protect.
- "Noticeably larger" preview area is validated by side-by-side baseline comparison at typical desktop widths.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing, 100% of pages that display the bill preview show no zoom UI controls.
- **SC-002**: In acceptance testing, 100% of tested zoom input attempts (ctrl/cmd + wheel and ctrl/cmd plus/minus/reset patterns) do not change preview scale.
- **SC-003**: At desktop widths of 1366px and 1920px, measured preview visible area is at least 20% larger than the previous UI baseline on Fill and Settings.
- **SC-004**: During regression checks, fill workflow completion, settings saving, history access, and printing each succeed with no blocking issues.
