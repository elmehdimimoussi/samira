import { useState } from 'react'

export const EMPTY_CUSTOMER_FORM = {
  name: '',
  address: '',
  account_number: '',
  agency: '',
  city: '',
  additional_info: '',
}

export const mapCustomerToForm = (customer = {}) => ({
  name: customer.name || '',
  address: customer.address || '',
  account_number: customer.account_number || '',
  agency: customer.agency || '',
  city: customer.city || '',
  additional_info: customer.additional_info || '',
})

export function useCustomerForm(initialValues = EMPTY_CUSTOMER_FORM) {
  const [formData, setFormData] = useState(initialValues)
  const [formErrors, setFormErrors] = useState({})

  const setFieldValue = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const resetForm = (values = EMPTY_CUSTOMER_FORM) => {
    setFormData(values)
    setFormErrors({})
  }

  return {
    formData,
    formErrors,
    setFieldValue,
    setFormData,
    setFormErrors,
    resetForm,
  }
}
