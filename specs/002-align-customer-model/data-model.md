# Data Model: Customer Data Alignment and Drawer Autofill

## Entity: Customer

- Description: Reusable business party profile used to populate LC drawer fields.

### Fields

- `id`: unique identifier, immutable once created.
- `name`: required non-empty string.
- `address`: optional string.
- `account_number`: optional string.
- `agency`: optional string.
- `city`: optional string.
- `additional_info`: optional string.
- `created_at`: record creation timestamp.
- `updated_at`: last modification timestamp.

### Validation Rules

- `name` MUST be present and not blank after trimming.
- Optional string fields accept empty values.
- Payloads failing validation MUST NOT be persisted.

### State Transitions

- `draft` -> `valid`: user enters valid minimum payload (`name`).
- `valid` -> `persisted`: record is saved successfully.
- `persisted` -> `persisted`: update operation succeeds with revised values.
- Any state -> `error`: persistence attempt fails; record remains unchanged.

## Entity: LC Drawer Form Segment

- Description: The drawer-specific subset of LC form state populated manually or
  via customer selection.

### Fields

- `drawerName`
- `drawerAddress`
- `accountNumber`
- `agency`
- `city`

### Population Rules

- Manual typing may update `drawerName` without changing other fields.
- Confirmed customer selection MUST atomically update all five fields using
  selected customer values.
- Missing optional customer fields map to empty values in the form segment.

## Entity: Drawer Autocomplete Candidate

- Description: Search result record shown to user for drawer selection.

### Fields

- `id`
- `name`
- `address`
- `account_number`
- `agency`
- `city`

### Relationship Notes

- One selected autocomplete candidate maps to one full `LC Drawer Form Segment`
  update.
- Candidate data is sourced from persisted `Customer` records.
