# Data Model: LC Workspace and Workflow Modernization

## Entity: LC Draft

**Description**: Work-in-progress LC record edited in the filling workflow and rendered in preview.

**Fields**:
- `draftId` (string): Unique draft identifier.
- `applicant` (object): Applicant-related values required by LC form sections.
- `beneficiary` (object): Beneficiary-related values required by LC form sections.
- `drawerDetails` (object):
  - `drawerName` (string)
  - `drawerAddress` (string)
  - `accountNumber` (string)
  - `agency` (string)
  - `city` (string)
- `amountDetails` (object): Monetary values and related textual representation.
- `sectionCompletion` (object): Per-section completion status used for progress feedback.
- `lastSavedAt` (datetime): Timestamp of last successful save.

**Validation rules**:
- Required LC section fields must be present before final completion workflow.
- Drawer detail fields mapped from customer selection are replaced atomically in one action.
- Save operations must reject invalid payloads and preserve previously committed valid state.

**State transitions**:
- `editing` -> `previewing` (as values change and render updates)
- `editing` -> `saving` -> `saved` on successful save
- `saving` -> `save_failed` on failure with user-visible feedback
- `save_failed` -> `editing` after corrective input/retry

## Entity: Customer Profile

**Description**: Reusable customer record used for autocomplete and drawer field mapping.

**Fields**:
- `customerId` (string): Unique customer identifier.
- `name` (string, required)
- `address` (string, optional)
- `account_number` (string, optional)
- `agency` (string, optional)
- `city` (string, optional)
- `additional_info` (string, optional)

**Validation rules**:
- `name` must be non-empty after trimming.
- Optional text fields are stored as trimmed strings when present.
- Customer write operations (create/update) must pass existing customer validation policy.

**State transitions**:
- `active` (default usable state)
- `updated` (after successful edit)
- `removed` (after delete; no longer returned in autocomplete)

## Entity: Template Frame

**Description**: Placement definition for rendering specific LC values in preview/output.

**Fields**:
- `frameId` (string): Unique frame identifier.
- `frameType` (string): Mapped LC value type displayed by the frame.
- `position` (object): `x`, `y` coordinates.
- `size` (object): `width`, `height`.
- `appearance` (object): Display attributes such as visibility and style properties.
- `enabled` (boolean): Whether frame participates in rendering.

**Validation rules**:
- Frame identifier and type must be present.
- Position and size values must stay within canvas constraints.
- Persisted template configuration must remain structurally valid for reload.

**State transitions**:
- `selected` <-> `unselected`
- `editing` -> `saved` on successful persistence
- `editing` -> `reverted` when reset/discard is confirmed

## Entity: Preview Session

**Description**: Runtime rendering context for LC preview behavior.

**Fields**:
- `sessionId` (string): Unique preview session identifier.
- `mode` (enum): `standard` or `fullscreen`.
- `scaleState` (object): Computed scaling and viewport-fit context.
- `activeDraftId` (string): Linked LC draft currently rendered.

**Validation rules**:
- Fullscreen mode must support explicit close action and Escape exit.
- Entering/exiting fullscreen must preserve in-progress draft values.

**State transitions**:
- `standard` -> `fullscreen` on user expand action
- `fullscreen` -> `standard` on close control or Escape

## Relationships

- A `Preview Session` renders exactly one active `LC Draft` at a time.
- An `LC Draft` may reference zero or one selected `Customer Profile` for drawer mapping at any given interaction.
- `Template Frame` entities define how `LC Draft` values are projected into the `Preview Session`.
