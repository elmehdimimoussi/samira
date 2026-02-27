# LC Pro - UI/UX & Code Enhancement Implementation Plan

## 1) Objective

Refactor and upgrade LC Pro to:
- maximize LC preview workspace in Filling and Settings flows,
- implement true fullscreen preview behavior,
- align customer data with LC Tire fields,
- split monolithic pages into modular components and custom hooks.

This plan follows the project constitution: preview-first UX, modular boundaries,
custom hooks, secure IPC, zod validation, and performance safeguards.

## 2) Current Baseline (Observed)

- `src/pages/FillingPage.jsx` is very large and mixes UI, state, and business logic.
- `src/pages/SettingsPage.jsx` is very large and mixes canvas logic, properties, and shell.
- `src/pages/CustomersPage.jsx` does not include all required LC Tire fields.
- Filling autocomplete currently populates only part of drawer data.
- Expanded preview is not true fullscreen today.
- Layout ratios still leave the preview area smaller than target.

## 3) Target Architecture

### 3.1 Filling Feature Split

Create:
- `src/components/filling/FillingForm.jsx`
- `src/components/filling/PreviewPanel.jsx`
- `src/hooks/useLCForm.js`

Responsibilities:
- `useLCForm`: form state, amount conversion, customer autocomplete, save/reset,
  frame mapping.
- `FillingForm`: accordion sections and input rendering only.
- `PreviewPanel`: preview rendering, scaling, fullscreen controls.

### 3.2 Settings Designer Split

Create:
- `src/components/settings/TemplateDesignerCanvas.jsx`
- `src/components/settings/TemplatePropertiesPanel.jsx`
- `src/hooks/useTemplateDesigner.js`

Responsibilities:
- `useTemplateDesigner`: frame CRUD, drag/resize, shortcuts, template image,
  import/export, scale state.
- `TemplateDesignerCanvas`: toolbar, canvas rendering, interaction shell.
- `TemplatePropertiesPanel`: selected frame editing and frame list/search.

### 3.3 Shared Fullscreen Pattern

Use a consistent fullscreen container:
- `fixed inset-0 z-[100] w-screen h-screen bg-slate-950`
- close button in top-right,
- Escape key exits,
- body scroll locked while fullscreen is active.

## 4) Step-by-Step Delivery

### Step 1 - Data Model + Customers + Autocomplete

Files:
- `src/pages/CustomersPage.jsx`
- `src/pages/FillingPage.jsx` (or `src/hooks/useLCForm.js` after extraction)
- tests:
  - `src/__tests__/pages/CustomersPage.test.jsx`
  - `src/__tests__/pages/FillingPage.test.jsx`

Changes:
1. Extend customer fields to include:
   - `name`, `address`, `account_number`, `agency`, `city`, `additional_info`.
2. Add `zod` validation before customer create/update IPC calls.
3. Update add/edit modal and table columns for new fields.
4. Extend customer search to include new fields.
5. Update drawer autocomplete mapping to set:
   - `drawerName`, `drawerAddress`, `accountNumber`, `agency`, `city`.

Acceptance checks:
- selecting a customer fills all required drawer fields at once,
- create/edit supports account number and agency,
- validation errors are user-friendly via toast.

### Step 2 - Compact Topbar Redesign

Files:
- `src/App.jsx`
- `src/index.css`
- `src/__tests__/App.test.jsx` (if labels/selectors change)

Changes:
1. Keep single-row compact topbar with brand, tabs, and tools.
2. Reduce topbar height, padding, and spacing.
3. Keep active states and keyboard accessibility.
4. Preserve mobile horizontal tab scrolling.

Acceptance checks:
- topbar is visually slimmer,
- no navigation regressions,
- more vertical workspace available.

### Step 3 - Layout Restructuring for Larger Preview

Files:
- `src/index.css`
- `src/pages/FillingPage.jsx` (or split components)
- `src/pages/SettingsPage.jsx` (or split components)

Changes:
1. Filling layout target:
   - form panel ~25-30%, preview panel ~70-75%.
2. Settings designer target:
   - properties ~25-30%, canvas ~70-75%.
3. Ensure `ResponsivePreviewWrapper` uses full parent dimensions.
4. Keep responsive fallbacks for medium/small screens.

Acceptance checks:
- preview dominates width on desktop,
- no cropping,
- responsive behavior remains usable.

### Step 4 - True Fullscreen Implementation

Files:
- `src/components/filling/PreviewPanel.jsx` (or `src/pages/FillingPage.jsx`)
- `src/components/settings/TemplateDesignerCanvas.jsx` (if fullscreen there)
- `src/index.css`
- optional: `src/hooks/useFullscreenPreview.js`

Changes:
1. Replace current expanded mode with viewport-covering overlay:
   - `fixed inset-0 z-[100] bg-slate-950`.
2. Keep preview centered and scaled to full viewport constraints.
3. Add visible close button in top corner.
4. Add Escape-to-close behavior.
5. Disable underlying body scroll while fullscreen is open.

Acceptance checks:
- overlay fully covers app,
- Escape exits fullscreen,
- no underlying scrollbars visible.

### Step 5 - Refactoring & Cleanup

Files:
- `src/pages/FillingPage.jsx`
- `src/pages/SettingsPage.jsx`
- new components/hooks listed above
- impacted tests:
  - `src/__tests__/pages/FillingPage.test.jsx`
  - `src/__tests__/pages/SettingsPage.test.jsx`

Changes:
1. Move complex state/business logic to hooks.
2. Keep page files as composition and layout layers.
3. Use `React.memo`, `useMemo`, and `useCallback` on heavy paths.
4. Ensure IPC calls remain wrapped in `try/catch` with user-friendly toasts.
5. Reduce monolithic file size and improve modular readability.

Acceptance checks:
- cleaner ownership boundaries,
- no regressions in fill/design/export flows,
- smoother canvas interactions.

## 5) Data & Validation Contract

Add renderer-side `zod` schemas before write IPC calls:
- Customer payload:
  - `name` required,
  - `address`, `account_number`, `agency`, `city`, `additional_info` optional strings.
- Operation payload validation before `operations:add`.

## 6) Test Strategy

Automated:
- Customers tests for new fields and search behavior.
- Filling tests for full autocomplete mapping.
- Fullscreen tests for overlay class and Escape close.
- Settings tests for designer continuity after split.

Manual QA:
1. End-to-end filling flow using customer autocomplete.
2. Preview scaling in normal and fullscreen.
3. Designer drag/resize with acceptable responsiveness.
4. Light/dark mode and mobile/desktop sanity checks.
5. Print and PDF export regression checks.

## 7) Risks & Mitigations

- Refactor can break tests -> update tests incrementally and keep stable labels.
- Fullscreen can conflict with modal layering -> reserve `z-[100]` for fullscreen.
- Drag performance can regress -> memoize handlers and avoid unnecessary rerenders.

## 8) Deliverables

- Compact top tabs app shell
- Preview-first layouts in Filling and Settings
- True fullscreen preview with dark overlay and Escape close
- Customer schema/UI aligned with LC fields
- Autocomplete that fills all drawer-related fields
- Refactored pages into components and hooks
- Updated tests and regression coverage
