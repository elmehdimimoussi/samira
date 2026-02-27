# Quickstart: Compact Topbar Redesign

## Goal

Validate that compact topbar behavior meets functional, accessibility, responsiveness, and measurable workspace-gain requirements before implementation handoff.

## Prerequisites

- Dependencies installed (`npm install`).
- Baseline branch/build available for before/after workspace comparison.
- App runs locally in Electron renderer flow.

## Run

```bash
npm run electron:dev
```

## Automated Quality Gates

```bash
npm test -- src/__tests__/App.test.jsx
npm test
npm run lint
```

## Manual Validation Matrix

- Viewports: 1440x900, 1024x600, 390x844, 320x568.
- Zoom: 100%, 150%, 200%.

## Manual Validation Checklist

1. Confirm topbar remains a single compact row on all supported viewports.
2. Confirm all top-level destinations are present and selectable: Remplissage, Clients, Historique, Parametres.
3. Confirm each destination routes correctly and unknown routes still show Not Found view.
4. Confirm exactly one top-level destination appears active for current top-level route.
5. Perform keyboard-only navigation (Tab, Shift+Tab, Enter) and confirm every topbar control is focusable and activatable.
6. Confirm focus-visible styling is clear and distinct from hover and active styles.
7. At 390x844 and 320x568, confirm horizontal scrolling reveals all off-screen destinations and no control clipping occurs.
8. At 1024x600 and all zoom levels (100/150/200), confirm controls remain visible and operable without overlap.
9. Test rapid destination switching and confirm active-state accuracy remains stable.

## Workspace Gain Measurement Protocol

1. On baseline build, open same route and viewport (1440x900), then record `main` content visible height.
2. On redesigned build, repeat under identical conditions.
3. Compute gain:

```text
gainPercent = ((redesignHeight - baselineHeight) / baselineHeight) * 100
```

4. Pass condition: `gainPercent >= 8`.

### Workspace Evidence Worksheet

| Scenario | Baseline Height (px) | Redesigned Height (px) | Gain % | Pass/Fail | Notes |
|----------|----------------------|-------------------------|--------|-----------|-------|
| Desktop 1440x900 | TBD | TBD | TBD | TBD | Same route and zoom |

## Navigation Responsiveness Protocol

1. Use warm app state (after initial navigation is complete).
2. In DevTools Performance or User Timing marks, sample top-level destination activations.
3. Collect at least 20 interactions across available destinations.
4. Pass condition: p95 activation latency <= 100 ms with no visible lag.

### Latency Evidence Worksheet

| Sample Set | Input Type | Sample Count | p95 (ms) | Threshold | Pass/Fail | Notes |
|------------|------------|--------------|----------|-----------|-----------|-------|
| Warm navigation | Mouse + Keyboard | 20+ | TBD | <= 100 | TBD | Capture via DevTools/User Timing |

## Expected Results

- All app-shell navigation contracts pass.
- Accessibility checks pass for keyboard-only use.
- Mobile and zoom scenarios preserve reachability without clipping.
- Desktop workspace gain target (>=8%) is met.
- Navigation responsiveness target (p95 <= 100 ms) is met.
