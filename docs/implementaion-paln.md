# Implementation Plan: LC Preview Zoom Removal, Layout Expansion, and Top Navigation

**Branch**: `001-lc-preview-layout-refactor` | **Date**: 2026-02-16 | **Status**: Planning
**Input**: User request to remove zoom from LC preview, enlarge preview area, and replace sidebar with compact top navigation.

## Summary

This plan refactors the Electron + React UI to remove all zoom behavior from the bill preview experience, increase visible preview space across the app, and replace the left sidebar with a compact top bar.

Primary outcomes:
- No zoom slider/buttons, no ctrl+wheel zoom, no keyboard shortcuts that change scale, and no zoom preference persistence.
- Larger, responsive preview area on Fill and Settings (and any shared preview usage).
- Sidebar removed and replaced by a compact top navigation for Fill, Clients/Data, History/Registry, and Settings.

Why:
- Faster daily workflow with fewer controls to manage.
- Better readability and working area at common desktop sizes.
- Cleaner, modern layout with less horizontal waste.

## Technical Context

**Language/Version**: JavaScript (ES modules), React 19.2, Electron 30, Vite 7
**Primary Dependencies**: react-router-dom, tailwindcss, lucide-react, sonner, html2canvas, jspdf
**Storage**: Local JSON file in Electron main process (`lc-bmci-data.json`), with settings map
**Testing**: Vitest + Testing Library (jsdom)
**Target Platform**: Electron desktop app, Windows packaging targets (NSIS + portable)
**Project Type**: Single-project Electron + React frontend
**Constraints**:
- No new libraries unless strictly needed (not expected)
- Preserve current fill/save/history/settings workflows
- Preserve print/PDF behavior
- Keep route structure stable (`/`, `/customers`, `/history`, `/settings`)

## Constitution Check

Constitution files inspected:
- `.specify/memory/constitution.md` (template placeholders, no enforced project-specific gates)
- `memory/constitution.md` (not present)

Practical gates enforced for this plan:
- Keep architecture simple and UI-focused: PASS
- Avoid introducing dependencies: PASS
- Preserve existing persistence/IPC contracts: PASS
- Maintain or update existing tests affected by UI changes: PASS

## Architecture / Approach

### 1) Remove zoom behavior fully

Scope of current zoom behavior found:
- `src/pages/FillingPage.jsx`:
  - `zoomLevel` state
  - Zoom buttons and percentage label in preview header
  - `zoomMultiplier` passed to responsive wrapper
- `src/components/ResponsivePreviewWrapper.jsx`:
  - `zoomMultiplier` multiplied into final transform scale
- `src/pages/SettingsPage.jsx`:
  - `zoomLevel` state
  - `zoomIn`, `zoomOut`, `zoomReset`
  - Toolbar zoom controls + percentage display
  - Canvas transform scale

Planned changes:
- Remove all zoom UI controls and zoom state from Fill and Settings pages.
- Convert responsive preview wrapper to fit-only scaling (no user multiplier input).
- Keep Settings drag/resize coordinate math correct using runtime fit scale (internal), not user zoom.
- Prevent renderer/page zoom shortcuts globally in Electron main window:
  - Block ctrl/cmd + wheel zoom gestures
  - Block ctrl/cmd + plus/minus/0 shortcuts
  - Lock zoom factor/limits at webContents level
- Keep zoom persistence absent (no settings/localStorage/sessionStorage zoom keys).

### 2) Enlarge preview visible area on all relevant pages

Current limiting factors:
- Sidebar consumes fixed horizontal width.
- Fill layout allocates substantial width to form panel.
- Settings designer uses split layout where canvas can be constrained.

Planned changes:
- Recover horizontal space globally by replacing sidebar with compact top nav.
- Fill page layout:
  - Increase preview pane share of width.
  - Keep form usable but secondary to preview area.
  - Improve preview fit behavior for 1366px and 1920px widths.
- Settings page layout:
  - Prioritize canvas footprint while preserving property panel usability.
  - Ensure readable, stable preview without manual zoom controls.
- Keep responsive breakpoints for smaller windows without breaking workflow.

### 3) Replace sidebar with compact top bar navigation

Current nav shell:
- Sidebar in `src/App.jsx` with NavLink items and ThemeToggle in footer.

Planned shell update:
- Remove sidebar markup and related styles.
- Add compact top bar with route links/tabs for:
  - Remplissage (Fill)
  - Clients (Clients/Data)
  - Historique (History/Registry)
  - Parametres (Settings)
- Preserve route behavior and active state via NavLink.
- Keep keyboard accessibility (tab order, visible focus, clear active state).
- Place utilities like theme toggle in top bar without increasing height significantly.

## Files Likely To Change

- `src/App.jsx`
- `src/index.css`
- `src/components/ResponsivePreviewWrapper.jsx`
- `src/pages/FillingPage.jsx`
- `src/pages/SettingsPage.jsx`
- `electron/main.cjs`
- `src/__tests__/App.test.jsx`
- `src/__tests__/pages/SettingsPage.test.jsx`
- `src/__tests__/pages/FillingPage.test.jsx` (only if assertions require layout selector updates)

## Testing Strategy

Use existing test stack only.

Automated checks:
- Update and run current Vitest suites impacted by app shell/nav and Settings zoom controls.
- Command: `npm test`

Manual smoke/regression checks:
- Fill page:
  - No zoom controls
  - No scale change via ctrl+wheel or keyboard shortcuts
  - Preview area visibly larger
- Settings designer:
  - No zoom controls
  - Frame drag/resize remains accurate
  - Existing non-zoom shortcuts still function
- Navigation:
  - Sidebar removed
  - Top bar links switch pages correctly
- Cross-cutting:
  - Printing still works
  - PDF export still works
  - Window resize, DPI scaling, and multi-monitor behavior remains stable

## Rollout / Backout

Rollout:
1. Implement UI and Electron zoom-lock changes in one feature branch.
2. Run automated tests and manual smoke checklist.
3. Validate in Electron dev runtime before packaging.

Backout:
1. Revert refactor commit(s) to restore previous sidebar and zoom behavior.
2. Re-run smoke checks (navigation, fill, settings, print/PDF).
3. Ship previous known-good build if any blocking layout regression appears.

## Project Structure

### Source Code (repository root)

```text
electron/
  main.cjs

src/
  App.jsx
  index.css
  components/
    ResponsivePreviewWrapper.jsx
  pages/
    FillingPage.jsx
    SettingsPage.jsx
    CustomersPage.jsx
    HistoryPage.jsx
  __tests__/
    App.test.jsx
    pages/
      FillingPage.test.jsx
      SettingsPage.test.jsx
```

**Structure Decision**: Keep current single-project Electron + React structure; apply localized UI shell, page layout, and interaction changes only.

## Complexity Tracking

No constitution violations identified that require exceptions.
