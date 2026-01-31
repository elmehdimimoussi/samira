## 2024-05-23 - Electron Routing & ESLint Strictness
**Learning:** This Electron app uses `HashRouter`. Playwright scripts must use `#` in URLs (e.g., `http://localhost:xxxx/#/route`) or navigation fails silently to root.
**Action:** Always check `main.jsx` for router type before writing verification scripts.

**Learning:** The ESLint configuration flags `setState` calls inside `useEffect` even if wrapped in async functions, which can lead to false positives or require specific patterns (like defining the function inside the effect) to satisfy the linter without suppressing rules.
**Action:** Prefer defining effect-specific logic inside the `useEffect` hook to avoid hoisting/scope issues and satisfy strict linters.
