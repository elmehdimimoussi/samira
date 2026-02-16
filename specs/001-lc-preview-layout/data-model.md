# Data Model: LC Preview Workspace Refactor

## Overview

This feature is UI-focused and introduces no new persisted domain entities. The model below defines UI state and behavioral constraints that must remain consistent during the refactor.

## Entities

### 1) PreviewWorkspace

- Description: A render surface where the bill preview is displayed (Fill preview and Settings designer/canvas preview).
- Fields:
  - `context` (enum): `fill`, `settings`, `other-preview-context`
  - `visibleAreaPriority` (enum): `high` (must favor preview space over navigation width)
  - `scaleMode` (enum): `auto-fit-only`
  - `zoomControlVisible` (boolean): must always be `false`
  - `zoomInputAllowed` (boolean): must always be `false`
- Validation rules:
  - No zoom UI controls rendered for any preview context.
  - No keyboard/wheel input changes scale.
  - Preview remains readable across supported desktop sizes.

### 2) PrimaryNavigationItem

- Description: A top-bar entry for primary route switching.
- Fields:
  - `label` (string): one of Fill/Remplissage, Clients/Data, History/Registry, Settings
  - `route` (string): existing route destination
  - `isActive` (boolean): active route indicator
  - `isKeyboardReachable` (boolean): tab-focusable and operable
- Validation rules:
  - Sidebar navigation is absent.
  - All primary destinations remain reachable.
  - Active state is visible.

### 3) SessionUIState

- Description: Existing in-session state that must survive layout changes without regressions.
- Fields:
  - `currentRoute` (string)
  - `fillFormState` (object)
  - `settingsEditorState` (object)
  - `historyFiltersState` (object)
- Validation rules:
  - Route changes via top navigation do not break page accessibility.
  - Fill and Settings workflows continue to function normally.

## Relationships

- `PrimaryNavigationItem` controls `SessionUIState.currentRoute`.
- `SessionUIState.currentRoute` determines active `PreviewWorkspace.context`.
- `PreviewWorkspace` behavior constraints (no zoom + larger visible area) apply wherever preview is rendered.

## State Transitions

### Navigation Transition

1. User selects a top-bar navigation item.
2. `currentRoute` updates to the selected route.
3. Destination page renders with correct active top-nav state.

### Preview Interaction Transition

1. User opens Fill or Settings preview.
2. Preview renders in `auto-fit-only` scale mode.
3. Zoom attempts via controls/shortcuts/wheel are ignored.
4. Preview remains visible and readable as window size changes.
