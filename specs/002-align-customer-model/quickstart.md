# Quickstart: Customer Data Alignment and Drawer Autofill

## Goal

Verify that Step 1 behavior works end-to-end:
- customer fields are complete,
- customer validation blocks malformed writes,
- drawer selection autofills all required drawer fields.

## Prerequisites

- Dependencies installed.
- Application can run in Electron dev mode.

## Run

```bash
npm run electron:dev
```

## Validation Steps

1. Open **Clients** page and add a customer with:
   - name,
   - address,
   - account number,
   - agency,
   - city,
   - additional info.
2. Confirm the customer list displays the new values.
3. Edit the same customer and update account number and agency.
4. Confirm updates are reflected in the list.
5. Attempt to save a customer with empty name.
6. Confirm save is blocked and a clear error message appears.
7. Open **Remplissage** page.
8. Type in the drawer field and select the created customer from suggestions.
9. Confirm the form updates all drawer fields in one action:
   - drawer name,
   - drawer address,
   - account number,
   - agency,
   - city.
10. Confirm existing drawer values are not overwritten unless a suggestion is
    selected.
11. With around 500 local customers, confirm suggestion display remains responsive
    and appears within the target interaction window.

## Test Command

```bash
npm test
```

Focus on:
- `src/__tests__/pages/CustomersPage.test.jsx`
- `src/__tests__/pages/FillingPage.test.jsx`
