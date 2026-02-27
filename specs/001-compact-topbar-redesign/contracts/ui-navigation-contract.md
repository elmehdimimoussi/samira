# UI Contract: App-Shell Topbar Navigation

## Purpose

Define user-visible contract guarantees for the compact topbar redesign, including route correctness, accessibility, responsive reachability, workspace gain, and responsiveness checks.

## Contract Surface

### Navigation Semantics

- Top-level navigation is exposed in a labeled primary navigation landmark.
- Destinations are route links (React Router `NavLink` semantics), not ARIA tablist widgets.
- Active destination is represented via route-derived active styling and `aria-current="page"` behavior.

### Route Destination Mapping

| Navigation Label | Destination Path |
|------------------|------------------|
| Remplissage | `/` |
| Clients | `/customers` |
| Historique | `/history` |
| Parametres | `/settings` |

## Behavioral Guarantees

1. Selecting or keyboard-activating a destination opens the mapped route.
2. Exactly one top-level destination is active for a resolved top-level route.
3. Unknown routes resolve to the Not Found surface.
4. Topbar remains single-row and does not clip or overlap controls across supported viewport matrix.
5. On narrow widths, top-level destinations remain reachable through horizontal scrolling.
6. Desktop baseline content area gains at least 8% vertical space versus baseline shell.
7. Warm top-level navigation interactions meet responsiveness target (p95 <= 100 ms).

## Accessibility Guarantees

- All topbar interactive controls are keyboard focusable and activatable.
- Focus order remains logical from left-to-right within shell controls.
- Focus-visible styling is always present on keyboard focus.
- Active, hover, and focus-visible states remain visually distinguishable.

## Supported Viewport and Zoom Matrix

- Viewports: 1440x900, 1024x600, 390x844, 320x568.
- Zoom levels: 100%, 150%, 200%.

## Error Conditions

- Route mapping mismatch between visible destination and actual route transition.
- Multiple active destinations or no active destination for a matched top-level route.
- Any unreachable destination/control by keyboard-only navigation.
- Overflow clipping where destinations exist but cannot be reached by horizontal scrolling.
- Regression below 8% desktop workspace gain target.
- Navigation responsiveness exceeding p95 100 ms threshold under warm interaction checks.

## Verification Mapping

- Automated (`src/__tests__/App.test.jsx`): route mapping, unknown-route fallback, keyboard activation coverage, active-state singularity assertions.
- Manual (`specs/001-compact-topbar-redesign/quickstart.md`): viewport/zoom clipping checks, narrow-width horizontal reachability, workspace gain measurement, and responsiveness sampling protocol.
