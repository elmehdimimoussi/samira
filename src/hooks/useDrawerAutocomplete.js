import { useCallback, useEffect, useRef, useState } from 'react'

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
  const [activeIndex, setActiveIndex] = useState(-1)
  const optionRefs = useRef([])
  const listId = 'drawer-autocomplete-listbox'

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
        setActiveIndex(-1)
        return
      }

      const filtered = filterByName(query)
      setFilteredCustomers(filtered)
      setShowAutocomplete(filtered.length > 0)
      setActiveIndex(filtered.length > 0 ? 0 : -1)
    },
    [filterByName],
  )

  const handleFocus = useCallback(
    (query) => {
      if (normalize(query).length < MIN_QUERY_LENGTH) return

      const filtered = filterByName(query)
      setFilteredCustomers(filtered)
      setShowAutocomplete(filtered.length > 0)
      setActiveIndex(filtered.length > 0 ? 0 : -1)
    },
    [filterByName],
  )

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setShowAutocomplete(false)
      setActiveIndex(-1)
    }, 200)
  }, [])

  const selectCustomer = useCallback((customer, applyFields) => {
    applyFields(mapCustomerToDrawerFields(customer))
    setShowAutocomplete(false)
    setActiveIndex(-1)
  }, [])

  useEffect(() => {
    if (activeIndex < 0) return
    const node = optionRefs.current[activeIndex]
    node?.scrollIntoView?.({ block: 'nearest' })
  }, [activeIndex])

  const setOptionRef = useCallback((index, node) => {
    optionRefs.current[index] = node
  }, [])

  const handleKeyDown = useCallback(
    (event, onSelect) => {
      if (!showAutocomplete || filteredCustomers.length === 0) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, filteredCustomers.length - 1))
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, 0))
        return
      }

      if (event.key === 'Enter') {
        if (activeIndex >= 0 && filteredCustomers[activeIndex]) {
          event.preventDefault()
          onSelect(filteredCustomers[activeIndex])
        }
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        setShowAutocomplete(false)
        setActiveIndex(-1)
      }
    },
    [activeIndex, filteredCustomers, showAutocomplete],
  )

  const getOptionId = useCallback((index) => `drawer-autocomplete-option-${index}`, [])

  return {
    showAutocomplete,
    filteredCustomers,
    activeIndex,
    listId,
    getOptionId,
    handleSearchChange,
    handleFocus,
    handleBlur,
    handleKeyDown,
    setOptionRef,
    selectCustomer,
  }
}
