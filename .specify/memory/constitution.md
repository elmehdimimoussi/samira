# samira Constitution

## Core Principles

### I. Spec-Driven Delivery (MUST)

Every feature MUST maintain alignment between `spec.md`, `plan.md`, and `tasks.md`.
Work MUST trace from requirements to executable tasks before implementation begins.

### II. Minimal Change Surface (MUST)

Changes MUST be limited to the smallest practical set of files and behaviors required by the feature.
New dependencies MUST NOT be introduced unless explicitly justified in `plan.md`.

### III. Regression Safety (MUST)

Existing user workflows impacted by a change MUST be protected by automated tests when feasible and by explicit manual validation steps.
For UI-heavy changes, quickstart regression checklists MUST include critical user paths.

### IV. Contract and Data Stability (MUST)

Features that do not require data or API changes MUST preserve existing contracts and persisted data behavior.
Any contract or persistence change MUST be explicitly documented in `plan.md` and `contracts/`.

### V. Accessibility and Usability Baseline (MUST)

Primary navigation and core interactions MUST remain keyboard-accessible.
UI refactors MUST preserve readability at supported desktop window sizes and MUST avoid introducing hidden interaction states.

## Additional Constraints

- Default stack for active features is React + Electron + Vite with local JSON persistence.
- No destructive data migrations are allowed without explicit rollback strategy.
- Windows desktop runtime behavior is first-class and MUST be validated before release.

## Workflow and Quality Gates

Before implementation:
1. `spec.md` is complete and testable.
2. `plan.md` passes constitution check.
3. `tasks.md` provides executable, file-scoped tasks by user story.

Before completion:
1. Relevant tests pass.
2. Quickstart validation checklist is executed.
3. Any deviations from spec are documented and approved.

## Governance

This constitution supersedes local planning conventions when conflicts occur.
Amendments require explicit documentation in this file and re-validation of active feature plans.

**Version**: 1.0.0 | **Ratified**: 2026-02-16 | **Last Amended**: 2026-02-16
