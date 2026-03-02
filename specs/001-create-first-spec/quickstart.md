# Quickstart: LC Workspace and Workflow Modernization

## Prerequisites

- Node.js >= 18
- Project dependencies installed (`npm install`)
- Active branch: `001-create-first-spec`

## Validate Baseline

1. Run lint and tests:

```bash
npm run lint
npm test
```

2. Confirm existing workflows before changes:
- LC drafting flow opens and preview updates.
- Customer lookup supports mouse selection.
- Template frame edit/save flow works.

## Implement by User Story Priority

1. **P1**: Preview-first workspace and fullscreen behavior.
2. **P2**: Keyboard autocomplete with deterministic drawer mapping overwrite.
3. **P3**: Template management workspace refactor and preservation checks.

## Validation Checklist

- Fullscreen opens/closes via close control and Escape.
- Exiting fullscreen preserves in-progress draft data.
- Customer selection (keyboard and mouse) overwrites mapped drawer fields.
- No-match and optional-field autocomplete edge cases behave as specified.
- Save operations for drafts/templates show visible success/failure feedback.
- Save success remains >=99% under normal usage validation set.

## Final Verification

```bash
npm run lint
npm test
```

Manual smoke checks:
- Desktop and tablet-size layouts remain usable.
- Preserved workflows: LC drafting, template management, customer CRUD.
- No regression in print/export and existing template persistence behavior.

## Validation Log

- 2026-03-02: `npm test` passed (all suites green).
- 2026-03-02: `npm run lint` passed (0 errors).
- Contracts reviewed against implemented behavior: fullscreen entry/exit and autocomplete keyboard mapping remain aligned.
