# Phase 0 Research: Customer Data Alignment and Drawer Autofill

## Decision 1: Validation boundary for customer writes

- Decision: Validate customer create/update payloads in renderer before invoking
  persistence calls, and keep name as required while other drawer fields remain
  optional.
- Rationale: This enforces consistent data quality at the user interaction layer,
  provides immediate feedback, and preserves compatibility with existing records.
- Alternatives considered:
  - Validate only in main process: rejected for delayed UX feedback.
  - Make all drawer fields mandatory: rejected due to migration friction with
    partial historical records.

## Decision 2: Legacy data compatibility strategy

- Decision: Treat `account_number`, `agency`, and `city` as optional-at-rest and
  show blanks for missing values in existing records.
- Rationale: Existing local datasets must remain readable/editable after schema
  expansion without requiring backfill scripts.
- Alternatives considered:
  - Force one-time migration with defaults: rejected because synthetic values can
    mislead operators.
  - Hide legacy records until completed: rejected due to operational disruption.

## Decision 3: Drawer autocomplete population behavior

- Decision: Customer selection atomically populates drawer name, address, account
  number, agency, and city in one confirmed action.
- Rationale: Atomic update eliminates field drift and reduces manual entry errors
  during LC preparation.
- Alternatives considered:
  - Partial autofill (name/address only): rejected as insufficient to meet LC
    drawer requirements.
  - Field-by-field confirmation prompts: rejected for slower workflow.

## Decision 4: Search behavior for customer lookup

- Decision: Customer list search includes name, address, account number, agency,
  and city; drawer autocomplete remains name-driven with minimum input threshold.
- Rationale: Operational list search benefits from broader matching while drawer
  selection keeps a fast, predictable interaction model.
- Alternatives considered:
  - Global fuzzy search across all fields in autocomplete: rejected to avoid noisy
    results in a primary input flow.
  - Exact-match-only search: rejected due to poor usability.

## Decision 5: Failure handling and user messaging

- Decision: All customer write/delete operations and initial customer loading
  continue to use guarded calls with user-friendly error/success toasts.
- Rationale: Maintains constitution requirement for graceful IPC handling and
  supports reliable user feedback in offline desktop operation.
- Alternatives considered:
  - Silent failure logging only: rejected due to poor operator visibility.
  - Blocking dialogs for all errors: rejected as disruptive for common retries.
