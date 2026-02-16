# Contracts

This feature does not add new business APIs. Existing Electron IPC contracts remain unchanged.

## Existing contracts in scope (unchanged)

- `customers:*`
- `operations:*`
- `frames:*`
- `settings:get`
- `settings:set`
- `backup:*`

## Behavioral contract changes

- Preview surfaces must reject all user-driven zoom changes.
- Primary navigation must be exposed via compact top bar instead of sidebar.
- Existing route destinations remain unchanged.
