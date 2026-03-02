# Research: LC Workspace and Workflow Modernization

## Decision 1: Refactor strategy for large page files

- **Decision**: Refactor incrementally by behavior boundaries first, extracting stateful logic into focused hooks before splitting view components.
- **Rationale**: This minimizes regression risk by stabilizing side effects (fullscreen state, keyboard interactions, preview updates) behind testable boundaries and avoids carrying complex logic across multiple new components.
- **Alternatives considered**:
  - Split by JSX sections first (faster mechanically, but keeps coupled logic and fragile tests).
  - Big-bang rewrite (cleaner reset, but highest rollback and regression risk).

## Decision 2: Fullscreen interaction model

- **Decision**: Use a shared fullscreen interaction contract with explicit enter/exit controls, Escape-to-close, visual focus lock, and background scroll lock.
- **Rationale**: A single behavior model enforces UX consistency across pages and satisfies constitution accessibility/consistency requirements while simplifying test design.
- **Alternatives considered**:
  - Page-specific fullscreen logic (inconsistent behavior and duplicated maintenance).
  - Partial overlay without focus/scroll control (higher risk of usability and state-loss defects).

## Decision 3: Keyboard autocomplete behavior

- **Decision**: Keep input focus in the text field and use `aria-activedescendant` style behavior semantics: arrows move active option, Enter commits active option, Escape closes suggestion mode without changing current committed values.
- **Rationale**: This model is predictable for data-entry users, accessible for keyboard and assistive technology users, and prevents accidental commits during navigation.
- **Alternatives considered**:
  - Move focus into list options (weaker typing flow and more complex state transitions).
  - Auto-commit highlighted option on navigation/blur (higher accidental overwrite risk).

## Decision 4: Customer overwrite policy on selection

- **Decision**: Selecting a customer always overwrites all mapped drawer fields.
- **Rationale**: This aligns with clarified scope and ensures deterministic field mapping behavior for acceptance tests.
- **Alternatives considered**:
  - Fill only empty fields (can produce mixed, hard-to-audit record states).
  - Prompt on each selection (adds workflow friction and additional UX branching).

## Decision 5: Performance and scale expectation for lookup

- **Decision**: Define usability target for customer lookup at up to 10,000 records with measurable completion outcomes.
- **Rationale**: The explicit scale target prevents under-scoped design and supports objective validation of search/filter interactions.
- **Alternatives considered**:
  - No explicit scale target (ambiguous performance expectations).
  - 1,000 or 100,000 record assumptions (too low for growth or too high for current scope).

## Decision 6: Save reliability and regression quality gates

- **Decision**: Set minimum save success reliability at >=99% for normal usage and require regression tests around LC drafting, template management, and customer CRUD preservation.
- **Rationale**: The threshold is explicitly clarified in the spec and provides a practical release-quality signal without introducing implementation-specific telemetry dependencies.
- **Alternatives considered**:
  - No explicit save reliability target (weak release readiness signal).
  - Stricter target (e.g., 99.9%+) at this stage (may over-constrain planning without baseline evidence).
