# Contract: Customer Autocomplete and Drawer Mapping

## Purpose

Define expected behavior for customer lookup, keyboard navigation, and drawer field population during LC drafting.

## Preconditions

- Customer records are available locally.
- User is in the LC drafting workflow with customer lookup input available.

## Interaction Contract

1. Typing partial input returns matching customer suggestions.
2. Keyboard interaction behavior:
   - Arrow Down/Up moves active suggestion.
   - Enter commits active suggestion.
   - Escape closes suggestion list without committing a new selection.
3. Mouse selection remains supported.

## Mapping Contract

On customer selection, the system maps and overwrites all drawer-related fields in one action:

- `name` -> `drawerName`
- `address` -> `drawerAddress`
- `account_number` -> `accountNumber`
- `agency` -> `agency`
- `city` -> `city`

If optional customer values are absent, mapped fields are set to blank values.

## Scale and Reliability Contract

- Lookup remains usable for datasets up to 10,000 customer records.
- At least 95% of users can find and select the intended customer within 5 seconds.
- At least 95% of selections populate mapped fields correctly in one interaction.

## Accessibility Contract

- Active suggestion state is clearly indicated.
- Keyboard-only completion path is fully supported for lookup and selection.
