# Contract: Customer Data and Drawer Autofill

## 1. Customer Record Contract

### Required business fields

- `name` (required)

### Optional business fields

- `address`
- `account_number`
- `agency`
- `city`
- `additional_info`

### Behavioral guarantees

- Create and update flows reject blank `name`.
- Existing records missing optional fields remain readable and editable.
- Successful create/update returns a customer record that includes all contract
  fields.

## 2. Drawer Selection Autofill Contract

### Trigger

- User explicitly selects a customer suggestion from drawer autocomplete.

### Atomic mapped outputs

- `drawerName` <- `customer.name`
- `drawerAddress` <- `customer.address`
- `accountNumber` <- `customer.account_number`
- `agency` <- `customer.agency`
- `city` <- `customer.city`

### Behavioral guarantees

- All mapped outputs update in the same state transition.
- Missing optional source values are applied as empty strings.
- If user only types text without selecting a suggestion, non-name drawer fields
  are not overwritten.

## 3. Error Feedback Contract

- Invalid customer payload submission presents corrective user feedback.
- Failed save/update/delete/load operations present failure feedback and do not
  silently fail.
- Successful save/update/delete operations present success feedback.
