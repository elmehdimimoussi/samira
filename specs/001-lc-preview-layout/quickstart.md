# Quickstart: Validate LC Preview Workspace Refactor

## 1) Run automated checks

```bash
npm test
```

Expected:
- Existing tests pass after nav/zoom assertions are updated.

## 2) Run app in desktop mode

```bash
npm run electron:dev
```

## 3) Manual validation checklist

### Baseline capture protocol (Task T002 / T017)

- Before applying code changes, capture preview viewport width x height for Fill and Settings at:
  - 1366x768 window size
  - 1920x1080 window size
- After applying changes, capture the same values and compute:
  - `increase % = ((newArea - baselineArea) / baselineArea) * 100`
- Pass threshold: each page (Fill and Settings) is `>= 20%` at both widths.

Use this table for recording:

| Page | Window Size | Baseline (W x H) | New (W x H) | Baseline Area | New Area | Increase % | Pass (>=20%) |
|------|-------------|------------------|-------------|---------------|----------|------------|--------------|
| Fill | 1366x768 |  |  |  |  |  |  |
| Fill | 1920x1080 |  |  |  |  |  |  |
| Settings | 1366x768 |  |  |  |  |  |  |
| Settings | 1920x1080 |  |  |  |  |  |  |

Notes:
- Measure only the visible preview/canvas viewport, not the full window.
- Keep zoom at default OS/browser scale and use the same monitor for baseline/new comparison.

### Zoom removal

- Open Fill page and verify no zoom UI exists (no plus/minus, no percentage, no slider).
- Open Settings page designer/canvas and verify no zoom UI exists.
- If any other page/context shows bill preview, verify no zoom UI exists there too.
- Try ctrl/cmd + wheel on preview pages; verify scale does not change.
- Try ctrl/cmd + plus, minus, and reset shortcut pattern; verify scale does not change.
- Close and reopen app; verify no zoom preference is restored.

### Preview area enlargement

- Compare with baseline at 1366px width: preview visible area on Fill and Settings is at least 20% larger.
- Compare with baseline at 1920px width: preview visible area on Fill and Settings is at least 20% larger.
- Resize app between minimum and larger desktop sizes; preview remains readable and responsive.

### Navigation shell

- Verify left sidebar is removed.
- Verify compact top navigation is present and minimal in height.
- Verify top navigation switches between Fill, Clients, History, and Settings.
- Verify active state and keyboard navigation (Tab + Enter/Space) work.
- Verify page-shell route transition appears immediate (target: no visible lag above 200ms in normal desktop usage).

### Route-transition timing protocol (Task T024)

- Perform 10 route switches across Fill, Clients, History, Settings.
- Measure perceived shell transition with a stopwatch/video frame count.
- Record max observed transition; pass threshold is `<= 200ms` visible lag.

Use this run log:

| Run # | From -> To | Observed Lag (ms) | Pass (<=200ms) | Notes |
|-------|------------|-------------------|----------------|-------|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |
| 4 |  |  |  |  |
| 5 |  |  |  |  |
| 6 |  |  |  |  |
| 7 |  |  |  |  |
| 8 |  |  |  |  |
| 9 |  |  |  |  |
| 10 |  |  |  |  |

Summary:
- Max observed lag: `____ ms`
- Average observed lag: `____ ms`
- Result: `PASS / FAIL`

### Regression checks

- Fill workflow still works end-to-end.
- Settings save and reload workflow still works.
- History page remains accessible and functional.
- Printing flow still works.
- Validate behavior on DPI scaling and when moving window between monitors.

## 4) Acceptance criteria

- On Fill page, Settings page, and any other page showing the bill preview: there is no UI control for zoom and no input method changes scale (ctrl+wheel, +/- shortcuts, etc.).
- The preview area is noticeably larger than before on typical desktop widths (e.g., 1366px and 1920px wide).
- Sidebar is gone; navigation is via a compact top bar with tabs/links.
- No functional regressions: fill workflow still works, settings still save, history still accessible, printing (if exists) still works.

## 5) Validation log

- 2026-02-16: `npm test` passed (16 files, 234 tests).
- Pending manual checks: baseline 20% area measurement, route-transition timing capture, and full Electron manual checklist execution.

### T025 Final manual checklist sign-off

Mark each item after executing in Electron runtime:

| Checklist Item | Status (PASS/FAIL) | Evidence/Notes |
|----------------|--------------------|----------------|
| Fill page: no zoom UI, no zoom shortcut effect |  |  |
| Settings page: no zoom UI, no zoom shortcut effect |  |  |
| Any other preview context: no zoom behavior |  |  |
| Preview area >=20% increase at 1366 and 1920 |  |  |
| Sidebar removed, compact top nav active |  |  |
| Keyboard nav on top bar works (Tab + Enter/Space) |  |  |
| Fill workflow works end-to-end |  |  |
| Settings save + reload works |  |  |
| History page accessible and functional |  |  |
| Printing flow works |  |  |
| DPI / multi-monitor behavior acceptable |  |  |

Final sign-off:
- Reviewer: `____________`
- Date: `____________`
- Overall result: `PASS / FAIL`
