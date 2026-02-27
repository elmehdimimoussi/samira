import { z } from 'zod'

const optionalTrimmedString = z.string().trim().optional().default('')

export const customerSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est obligatoire'),
  address: optionalTrimmedString,
  account_number: optionalTrimmedString,
  agency: optionalTrimmedString,
  city: optionalTrimmedString,
  additional_info: optionalTrimmedString,
})

export function validateCustomerPayload(payload) {
  const result = customerSchema.safeParse(payload)

  if (!result.success) {
    const issue = result.error.issues[0]
    return {
      success: false,
      field: issue?.path?.[0] || 'name',
      message: issue?.message || 'Données client invalides',
    }
  }

  return {
    success: true,
    data: result.data,
  }
}
