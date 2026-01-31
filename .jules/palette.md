# Palette's Journal

## 2024-10-26 - Initial Setup
**Learning:** Project uses standard Vite+React+Electron structure. `npm` is the package manager.
**Action:** Will look for standard React components to enhance.

## 2024-10-26 - Form Accessibility
**Learning:** Input components lack `htmlFor` and `id` association between label and input. This breaks `get_by_label` in tests and screen reader associations.
**Action:** Future enhancements should systematically fix label-input associations by adding `id` props and `htmlFor`.

## 2024-10-26 - Loading States
**Learning:** `Button` component was missing native loading state support.
**Action:** Successfully added `isLoading` prop using `lucide-react` icons. This pattern should be applied to other async buttons in the app.
