# Data Model: Compact Topbar Redesign

## Overview

This feature introduces no persistence changes. The model captures UI entities, measurable constraints, and behavioral transitions needed to implement and verify compact topbar behavior.

## Entities

### Topbar

- Purpose: Application shell header containing brand area, primary route navigation, and utility controls.
- Fields:
  - `rowMode`: enum (`single-row`) - required.
  - `density`: enum (`compact`) - required.
  - `heightPx`: number - measured for baseline and redesign comparisons.
  - `hasPrimaryNavLandmark`: boolean - required true.
  - `isOverflowScrollable`: boolean - true on narrow widths.
  - `supportsZoomLevels`: set (`100`, `150`, `200`) for acceptance coverage.
- Validation rules:
  - Must remain a single row across supported viewport matrix.
  - Must not clip or overlap interactive controls at supported viewport sizes and zoom levels.
  - Must expose labeled primary navigation landmark.

### NavigationItem

- Purpose: Route destination control inside topbar.
- Fields:
  - `label`: non-empty string.
  - `path`: route path string.
  - `icon`: visual symbol reference.
  - `description`: optional string for assistive hints/tooltips.
  - `isActive`: derived boolean based on current route.
  - `isFocusable`: derived boolean expected true for visible item.
  - `isKeyboardActivatable`: derived boolean expected true.
- Validation rules:
  - `label` and `path` are mandatory for each item.
  - Route mapping is one-to-one with top-level destinations.
  - Exactly one route item is active for a matching top-level route context.
  - Active, focus-visible, and hover states must remain visually distinguishable.

### UtilityControl

- Purpose: Non-route interactive topbar control (for example theme toggle).
- Fields:
  - `id`: stable identifier.
  - `label`: non-empty string or accessible name.
  - `isVisible`: boolean.
  - `isFocusable`: boolean.
  - `supportsKeyboardActivation`: boolean.
- Validation rules:
  - Visible controls must be reachable via keyboard tab order.
  - Presence must not break compact single-row topbar or overflow behavior.

### WorkspaceMetric

- Purpose: Acceptance measurement of vertical content-area gain.
- Fields:
  - `viewport`: enum (`1440x900`, `1024x600`, `390x844`, `320x568`).
  - `baselineContentHeightPx`: number.
  - `redesignContentHeightPx`: number.
  - `gainPercent`: number computed as `((redesign - baseline) / baseline) * 100`.
- Validation rules:
  - On desktop baseline viewport, `gainPercent >= 8` is required.
  - Measurement method must be consistent between baseline and redesigned shells.

## Relationships

- One `Topbar` contains many `NavigationItem` entities.
- One `Topbar` contains zero or more `UtilityControl` entities.
- `WorkspaceMetric` compares shell states before and after topbar redesign.
- `NavigationItem.isActive` is derived from router location state.

## State Transitions

### NavigationItem state

- `inactive` -> `focused`: keyboard user tabs to the item.
- `focused` -> `active`: user activates item (Enter/click) and route change succeeds.
- `active` -> `inactive`: another item becomes active after route transition.

### Topbar overflow state

- `fully-visible` -> `overflowing`: horizontal content width exceeds viewport width.
- `overflowing` -> `scrolling`: user pans horizontally to reveal hidden destinations.
- `overflowing` -> `fully-visible`: viewport grows or content density decreases.

## Non-Persistent Constraints

- No backend schema changes.
- No IPC contract changes.
- No data migration requirements.
