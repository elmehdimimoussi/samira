# LC Pro — UI/UX & Code Enhancement Implementation Plan

**Version**: 1.0 | **Created**: 2026-03-02 | **Branch**: `main`

---

## 1. Overview

This plan covers a full UI/UX redesign and code refactoring of LC Pro to:

- Maximize the LC preview workspace on Filling and Settings pages.
- Implement true fullscreen preview with dark overlay and Escape-to-close.
- Reduce topbar vertical footprint via compact top-tabs design.
- Align the customer data model with all LC Tiré fields.
- Populate all drawer fields at once when selecting a customer via autocomplete.
- Improve autocomplete keyboard navigation (arrow keys, Enter, Escape).
- Split monolithic page files into focused components and custom hooks.
- Enforce Zod validation on all customer write operations.

---

## 2. Current Baseline

| File | Lines | Role |
|------|------:|------|
| `src/pages/SettingsPage.jsx` | 1 130 | Template designer (canvas, drag/resize, properties, tabs, backup) — monolithic |
| `src/pages/FillingPage.jsx` | 772 | LC form, autocomplete, preview, PDF/print — monolithic |
| `src/index.css` | 656 | All layout, component, and page-specific styles |
| `src/pages/CustomersPage.jsx` | 267 | CRUD table, search, modals |
| `src/App.jsx` | 87 | Shell: topbar, router |
| `src/components/customers/CustomerFormModal.jsx` | 79 | Add/edit customer form in a modal |
| `src/components/ResponsivePreviewWrapper.jsx` | 74 | Scale-to-fit wrapper (ResizeObserver) |
| `src/hooks/useDrawerAutocomplete.js` | 70 | Autocomplete filter/select logic |
| `src/hooks/useCustomerForm.js` | 43 | Customer form state hook |
| `src/validation/customerSchema.js` | 30 | Zod schema for customer payload |

### Key observations

1. **Topbar** (`App.jsx`): Single-row `h-14 / md:h-15` header with logo, nav tabs, theme toggle, and version badge. Already compact but can be tightened further.
2. **FillingPage layout**: CSS grid `minmax(300px, 380px) minmax(0, 1fr)` — form ≈ 35–40 %, preview ≈ 60–65 %. Target is ≈ 25–30 % / 70–75 %.
3. **Fullscreen**: Current expansion uses `fixed inset-3 z-50` with a `modal-overlay` click-to-close backdrop — not true fullscreen, retains padding, no Escape support, no dark overlay.
4. **Settings designer layout**: CSS grid `minmax(0, 1fr) 300px` — canvas left, properties right. Good ratio already, but canvas can expand and properties can shrink.
5. **Customer model**: Already aligned (`name`, `address`, `account_number`, `agency`, `city`, `additional_info`). Schema and form modal are in place and correct. **No data-model changes needed.**
6. **Autocomplete**: Populates all drawer fields via `mapCustomerToDrawerFields`. Works, but has no keyboard navigation (arrow keys/Enter). Uses `onPointerDown` + `onBlur` with a 200 ms `setTimeout` hack.
7. **Zod validation**: Active for customer create/update. Customer schema covers all fields. No changes needed unless scope expands.

---

## 3. Constitution Compliance Check

| Principle | Status |
|-----------|--------|
| **I. Code Quality & Modularity** — SRP, hooks, 300-line limit | ⚠ `FillingPage` (772 L) and `SettingsPage` (1 130 L) violate the 300-line guideline. Refactoring is a primary deliverable. |
| **II. Testing Discipline** — New code needs tests, mirrored tree | ✅ Tests exist for pages and services. New hooks/components will get tests. |
| **III. UX Consistency** — Sonner toasts, Lucide icons, keyboard access, dark/light, responsive | ⚠ Autocomplete lacks keyboard navigation. Fullscreen lacks Escape close. Both addressed in this plan. |
| **IV. Performance** — Memoization, debounce, IPC try/catch | ⚠ Some handlers in FillingPage are not memoized. Will be addressed during hook extraction. |

---

## 4. Target Architecture

### 4.1  New files to create

```
src/
├── components/
│   └── filling/
│       ├── FillingForm.jsx          # Accordion form (inputs only)
│       └── PreviewPanel.jsx         # Preview container, fullscreen toggle
│   └── settings/
│       ├── TemplateDesignerCanvas.jsx   # Toolbar + canvas + drag interactions
│       └── TemplatePropertiesPanel.jsx  # Selected-frame editor + frame list
├── hooks/
│   ├── useLCForm.js                 # Form state, amount conversion, reset, save, getFrameValue
│   ├── useTemplateDesigner.js       # Frame CRUD, drag/resize, keyboard shortcuts, import/export
│   └── useFullscreen.js             # Shared fullscreen state: open/close, Escape, body scroll lock
```

### 4.2  Files to modify

| File | Change |
|------|--------|
| `src/App.jsx` | Reduce topbar height/spacing. Tighten padding. |
| `src/index.css` | Update `.filling-layout` grid to `minmax(260px, 0.3fr) 1fr`. Update fullscreen classes. Adjust `.designer-layout` properties width. Reduce `.page-header` padding. |
| `src/pages/FillingPage.jsx` | Thin composition layer: imports `useLCForm`, `<FillingForm>`, `<PreviewPanel>`. Target ≤ 150 lines. |
| `src/pages/SettingsPage.jsx` | Thin composition layer: imports `useTemplateDesigner`, `<TemplateDesignerCanvas>`, `<TemplatePropertiesPanel>`. Target ≤ 200 lines. |
| `src/hooks/useDrawerAutocomplete.js` | Add keyboard navigation state: `activeIndex`, arrow key handlers, Enter to select, Escape to close. |
| `src/components/ResponsivePreviewWrapper.jsx` | Remove hardcoded `paddingTop: 12px` to maximize available height. |

---

## 5. Step-by-Step Delivery

### Step 1 — Compact Topbar Redesign

**Files**: `src/App.jsx`, `src/index.css`

**Changes**:

1. Reduce topbar from `h-14 / md:h-15` → `h-10 / md:h-11`.
2. Reduce horizontal padding from `px-3 / md:px-5` → `px-2 / md:px-3`.
3. Shrink logo container: hide subtitle on screens < `lg`, reduce icon from `h-8 w-8` → `h-7 w-7`.
4. Tighten nav pills: reduce `px-2.5 py-1.5` → `px-2 py-1`, font from `text-[13px]` → `text-xs`.
5. Reduce `.page-header` vertical padding from `py-4` → `py-2.5` and font sizes proportionally.

**Acceptance**:
- Topbar visually slimmer; all tabs still accessible.
- No navigation regressions.
- ~30–40 px more vertical workspace reclaimed.
- Mobile horizontal scroll still works.
- Dark/light mode correct.

---

### Step 2 — Layout Restructuring for Larger Preview

**Files**: `src/index.css`, `src/components/ResponsivePreviewWrapper.jsx`

**Changes**:

1. **Filling layout**: Change grid from `minmax(300px, 380px) minmax(0, 1fr)` to `minmax(240px, 0.28fr) 1fr` so the form panel targets ~25–28% and the preview ~72–75%.
2. **Settings designer layout**: Change from `minmax(0, 1fr) 300px` to `1fr minmax(240px, 280px)` — slightly narrower properties panel.
3. **ResponsivePreviewWrapper**: Remove the 12 px top/bottom padding and pass through the full container height. Change the wrapper `overflow-auto` → `overflow-hidden` to prevent internal scrollbars eating space.
4. Set `.filling-preview` height from `h-[calc(100vh-170px)]` to `h-[calc(100vh-130px)]` (reclaimed from topbar shrink).
5. Set `.designer-layout` height from `calc(100vh - 170px)` to `calc(100vh - 130px)`.

**Acceptance**:
- Preview occupies ≥ 70% of horizontal space on desktop (> 1024 px).
- No cropping of the LC preview.
- Responsive stacking at ≤ 1024 px still works.
- Accordion form scrolls independently without affecting the preview.

---

### Step 3 — True Fullscreen Implementation

**Files**: `src/hooks/useFullscreen.js` (new), `src/pages/FillingPage.jsx`, `src/index.css`

**Changes**:

1. Create `useFullscreen` hook:
   - `isFullscreen` boolean state.
   - `openFullscreen()` / `closeFullscreen()` toggles.
   - `useEffect` that listens for `Escape` keydown → close.
   - `useEffect` that sets `document.body.style.overflow = 'hidden'` when open, restores on close/unmount.
2. Replace the current `isExpanded` + `fixed inset-3 z-50` approach in `FillingPage` with the fullscreen hook.
3. Fullscreen overlay markup:
   ```jsx
   {isFullscreen && (
     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950">
       <button onClick={closeFullscreen} className="absolute top-4 right-4 ...">
         <X size={20} />
       </button>
       <ResponsivePreviewWrapper ...>{/* preview content */}</ResponsivePreviewWrapper>
     </div>
   )}
   ```
4. Remove the old `modal-overlay` click handler for expand mode.
5. Add corresponding CSS: `.fullscreen-overlay { @apply fixed inset-0 z-[100] flex items-center justify-center bg-slate-950; }`.

**Acceptance**:
- Overlay fully covers the app window with solid dark background.
- Close button visible in the top-right corner.
- Escape exits fullscreen.
- No underlying scrollbars visible.
- Works on both Filling and Settings pages (reusable hook).

---

### Step 4 — Autocomplete Keyboard Navigation

**Files**: `src/hooks/useDrawerAutocomplete.js`, `src/pages/FillingPage.jsx` (or `src/components/filling/FillingForm.jsx` after split)

**Changes**:

1. Add to `useDrawerAutocomplete`:
   - `activeIndex` state (default: `-1`).
   - `handleKeyDown(e)`:
     - `ArrowDown` → increment `activeIndex` (clamp to list length − 1).
     - `ArrowUp` → decrement `activeIndex` (clamp to 0).
     - `Enter` → select `filteredCustomers[activeIndex]` if valid, prevent form submit.
     - `Escape` → close dropdown, reset `activeIndex`.
   - Reset `activeIndex` to `0` whenever `filteredCustomers` changes.
   - Return `activeIndex` and `handleKeyDown` from the hook.
2. In the autocomplete input: attach `onKeyDown={handleKeyDown}`.
3. In the dropdown list: apply `aria-activedescendant`, highlight the active item with a distinct background class.
4. Ensure each dropdown item has `role="option"` with an `id` for `aria-activedescendant`.
5. Auto-scroll the active item into view using `scrollIntoView({ block: 'nearest' })`.

**Acceptance**:
- Arrow keys navigate the dropdown.
- Enter selects the highlighted customer and fills all drawer fields.
- Escape closes the dropdown without selecting.
- Mouse interaction still works unchanged.
- Screen-reader attributes present.

---

### Step 5 — FillingPage Refactoring

**Files**: `src/pages/FillingPage.jsx` (reduce), `src/hooks/useLCForm.js` (new), `src/components/filling/FillingForm.jsx` (new), `src/components/filling/PreviewPanel.jsx` (new)

**Changes**:

1. **`useLCForm` hook** (≤ 200 lines):
   - All `formData` state and `setFormData`.
   - `handleInputChange`, `handleAmountChange` (amount formatting + text conversion).
   - `applySelectedCustomer` callback.
   - `getFrameValue(frameType)` mapping function.
   - `sectionStatus` and `completedSections` memos.
   - `saveOperation` (IPC call).
   - `confirmReset` / `resetForm` logic.
   - `checkClonedOperation` on mount.
   - Load customers, frames, template image on mount.
   - Returns everything the form and preview need.

2. **`<FillingForm>` component** (≤ 250 lines):
   - Receives form state/handlers via props from the hook.
   - Renders progress steps, Accordion sections, and `NextButton`.
   - Includes autocomplete input with keyboard navigation.

3. **`<PreviewPanel>` component** (≤ 150 lines):
   - Receives `frames`, `getFrameValue`, `imageDimensions`, `templateImage`, `previewScale`, fullscreen controls.
   - Renders preview header, `ResponsivePreviewWrapper`, and frame overlays.

4. **`FillingPage`** becomes a thin layout shell (≤ 100 lines):
   - Imports `useLCForm`, `useFullscreen`, `<FillingForm>`, `<PreviewPanel>`.
   - Renders page header + actions, the two-column grid, fullscreen overlay, and reset confirm modal.

**Acceptance**:
- No functional regressions in filling, save, print, PDF export, clone-from-history.
- `FillingPage.jsx` ≤ 150 lines. No file exceeds 300 lines.
- All existing `FillingPage.test.jsx` tests pass (update selectors if needed).

---

### Step 6 — SettingsPage Refactoring

**Files**: `src/pages/SettingsPage.jsx` (reduce), `src/hooks/useTemplateDesigner.js` (new), `src/components/settings/TemplateDesignerCanvas.jsx` (new), `src/components/settings/TemplatePropertiesPanel.jsx` (new)

**Changes**:

1. **`useTemplateDesigner` hook** (≤ 300 lines):
   - `frames`, `selectedFrame`, `isDragging`, `isResizing`, `showGrid`, `testMode` state.
   - Frame CRUD: `addFrame`, `duplicateFrame`, `deleteFrame`, `updateFrame`, `resetToDefaults`.
   - Drag/resize: `handleMouseDown`, `handleMouseMove`, `handleMouseUp`, `getDocumentPoint`.
   - Keyboard shortcuts effect (arrow keys, Delete, Ctrl+D/G/T, Escape).
   - `saveFrames` IPC call.
   - Template image: `handleTemplateUpload`, `resetTemplateImage`.
   - Import/export: `exportTemplateConfig`, `importTemplateConfig`.
   - Load frames and template on mount.
   - Returns all state and handlers.

2. **`<TemplateDesignerCanvas>` component** (≤ 250 lines):
   - Toolbar (add, grid, test, template upload, import/export, reset).
   - Canvas area with `ResponsivePreviewWrapper`, frame overlays, drag handles.
   - Footer info bar (selected frame position/size, shortcut hints).

3. **`<TemplatePropertiesPanel>` component** (≤ 250 lines):
   - When a frame is selected: Identity/Position/Appearance accordion editors, Duplicate/Delete buttons.
   - When no frame is selected: searchable frame list with enable/disable toggles.

4. **`SettingsPage`** becomes a thin layout shell (≤ 200 lines):
   - Tab switcher (Designer / General).
   - Designer tab: `<TemplateDesignerCanvas>` + `<TemplatePropertiesPanel>` in a grid.
   - General tab: print options, PDF options, backup/restore cards.
   - Confirm modals for delete and reset.

**Acceptance**:
- No regressions in frame drag/resize, keyboard shortcuts, save/load, template upload, import/export, backup/restore.
- `SettingsPage.jsx` ≤ 200 lines. No file exceeds 300 lines.
- All existing `SettingsPage.test.jsx` tests pass.

---

### Step 7 — Tests & Polish

**Files**: `src/__tests__/` (new + updated test files)

**Changes**:

1. **New unit tests**:
   - `src/__tests__/hooks/useLCForm.test.js` — form state, amount conversion, save, reset, cloned operation.
   - `src/__tests__/hooks/useTemplateDesigner.test.js` — frame CRUD, drag/resize updates, keyboard shortcut effects.
   - `src/__tests__/hooks/useFullscreen.test.js` — open/close, Escape listener, body scroll lock.
   - `src/__tests__/hooks/useDrawerAutocomplete.test.js` — keyboard navigation (ArrowDown/Up, Enter, Escape), filter, select.

2. **Updated page tests**:
   - `src/__tests__/pages/FillingPage.test.jsx` — update selectors if component restructuring changes DOM.
   - `src/__tests__/pages/SettingsPage.test.jsx` — update selectors if component restructuring changes DOM.

3. **Verify all tests pass**: `npm test`

4. **Lint check**: `npm run lint` — zero errors.

5. **Manual QA checklist**:
   - [ ] End-to-end filling flow: create LC, select customer (keyboard + mouse), save, print, PDF export.
   - [ ] Clone from history → form pre-filled correctly.
   - [ ] Fullscreen: open, Escape to close, close button, no scroll bleed.
   - [ ] Preview scale responds to window resize.
   - [ ] Settings: drag/resize frames, keyboard shortcuts, save, template upload, import/export, reset to defaults.
   - [ ] Settings general tab: backup/restore.
   - [ ] Light & dark mode on all pages.
   - [ ] Responsive at 768 px and 1024 px breakpoints.
   - [ ] Topbar navigation, mobile horizontal scroll.
   - [ ] Customer CRUD: add, edit, delete, search across all fields.

**Acceptance**:
- `npm test` exits 0. `npm run lint` exits 0.
- Coverage does not decrease below current baseline.

---

## 6. Additional Improvements (Included)

Beyond the user's explicit requirements, the following enhancements are included in the steps above for a better overall result:

| Enhancement | Step | Rationale |
|-------------|------|-----------|
| **Shared `useFullscreen` hook** | 3 | Reusable across Filling and Settings pages, replacing ad-hoc expand logic in both. |
| **Autocomplete `aria-activedescendant`** | 4 | Screen-reader support for keyboard navigation. |
| **Auto-scroll active autocomplete item** | 4 | Prevents the highlighted item from being outside the visible area. |
| **Reduced `ResponsivePreviewWrapper` padding** | 2 | Gains ~24 px of preview height at no visual cost. |
| **Memoization of handlers in hooks** | 5, 6 | `useCallback` for `applySelectedCustomer`, `getFrameValue`, drag/resize handlers — prevents unnecessary child re-renders (P-IV compliance). |
| **Body scroll lock in fullscreen** | 3 | Prevents background page scrolling under the overlay. |
| **Print style update** | 7 | Verify that print CSS still hides the correct elements after component restructuring. |

---

## 7. Data & Validation Contract

**No data model changes needed.** The current customer schema already covers all required LC Tiré fields:

```js
// src/validation/customerSchema.js (existing, no changes)
{
  name: z.string().trim().min(1, 'Le nom est obligatoire'),
  address: optionalTrimmedString,
  account_number: optionalTrimmedString,
  agency: optionalTrimmedString,
  city: optionalTrimmedString,
  additional_info: optionalTrimmedString,
}
```

The autocomplete mapping in `useDrawerAutocomplete.js` already maps all fields:

```js
// src/hooks/useDrawerAutocomplete.js (existing, no changes)
export const mapCustomerToDrawerFields = (customer) => ({
  drawerName: customer?.name || '',
  drawerAddress: customer?.address || '',
  accountNumber: customer?.account_number || '',
  agency: customer?.agency || '',
  city: customer?.city || '',
})
```

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Refactoring breaks existing tests | Medium | Run `npm test` after each step. Update selectors incrementally. Keep data-testid attributes stable. |
| Fullscreen conflicts with modal z-index | Low | Fullscreen uses `z-[100]`, modals use `z-50`. Reserve `z-[100]` exclusively for fullscreen. |
| Preview scale regression after padding/layout changes | Medium | Verify `ResponsivePreviewWrapper` output scale on multiple viewport sizes before and after. |
| Drag performance regression in canvas after hook extraction | Low | All drag/resize handlers wrapped in `useCallback`. `getDocumentPoint` remains memoized. |
| Autocomplete keyboard nav conflicts with form submit | Low | `handleKeyDown` calls `e.preventDefault()` on Enter when dropdown is open. |
| Large CSS refactoring breaks other pages | Medium | CSS changes are scoped to `.filling-layout`, `.designer-layout`, `.page-header`, and `.fullscreen-overlay` selectors. Verify Customers and History pages are unaffected. |

---

## 9. Dependency & Execution Order

```
Step 1 (Topbar)          ──┐
Step 2 (Layout)          ──┤──▶ Step 5 (FillingPage refactor) ──┐
Step 3 (Fullscreen hook) ──┘                                     │
Step 4 (Autocomplete KB) ──────────────────────────────────────▶│──▶ Step 7 (Tests & Polish)
                                   Step 6 (SettingsPage refactor)──┘
```

- Steps 1, 2, 3 can proceed in parallel (different files, no conflicts).
- Step 4 can proceed in parallel with Steps 1–3 (only touches `useDrawerAutocomplete.js`).
- Step 5 depends on Steps 2 + 3 (layout + fullscreen hook).
- Step 6 depends on Step 2 (layout changes).
- Step 7 depends on all previous steps.

---

## 10. Deliverables Summary

- [ ] Compact top-tabs app shell with reduced vertical footprint
- [ ] Preview-first layouts in Filling (~75%) and Settings (~75%) pages
- [ ] True fullscreen preview with solid dark overlay and Escape-to-close
- [ ] Keyboard-navigable autocomplete dropdown with ARIA attributes
- [ ] `FillingPage` refactored: `useLCForm` hook + `<FillingForm>` + `<PreviewPanel>` (≤ 150 L page)
- [ ] `SettingsPage` refactored: `useTemplateDesigner` hook + `<TemplateDesignerCanvas>` + `<TemplatePropertiesPanel>` (≤ 200 L page)
- [ ] Shared `useFullscreen` hook
- [ ] All tests passing, lint clean, no coverage regression
