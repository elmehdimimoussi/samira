import { useCallback, useState } from 'react'

const MIN_QUERY_LENGTH = 2

const normalize = (value) => (value || '').toString().trim().toLowerCase()

export const mapCustomerToDrawerFields = (customer) => ({
  drawerName: customer?.name || '',
  drawerAddress: customer?.address || '',
  accountNumber: customer?.account_number || '',
  agency: customer?.agency || '',
  city: customer?.city || '',
})

export function useDrawerAutocomplete(customers) {
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [filteredCustomers, setFilteredCustomers] = useState([])

  const filterByName = useCallback(
    (query) => {
      const normalizedQuery = normalize(query)
      return customers.filter((customer) => normalize(customer.name).includes(normalizedQuery))
    },
    [customers],
  )

  const handleSearchChange = useCallback(
    (query) => {
      if (normalize(query).length < MIN_QUERY_LENGTH) {
        setFilteredCustomers([])
        setShowAutocomplete(false)
        return
      }

      const filtered = filterByName(query)
      setFilteredCustomers(filtered)
      setShowAutocomplete(filtered.length > 0)
    },
    [filterByName],
  )

  const handleFocus = useCallback(
    (query) => {
      if (normalize(query).length < MIN_QUERY_LENGTH) return

      const filtered = filterByName(query)
      setFilteredCustomers(filtered)
      setShowAutocomplete(filtered.length > 0)
    },
    [filterByName],
  )

  const handleBlur = useCallback(() => {
    setTimeout(() => setShowAutocomplete(false), 200)
  }, [])

  const selectCustomer = useCallback((customer, applyFields) => {
    applyFields(mapCustomerToDrawerFields(customer))
    setShowAutocomplete(false)
  }, [])

  return {
    showAutocomplete,
    filteredCustomers,
    handleSearchChange,
    handleFocus,
    handleBlur,
    selectCustomer,
  }
}
