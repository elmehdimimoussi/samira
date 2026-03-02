import { describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDrawerAutocomplete } from '@/hooks/useDrawerAutocomplete'

const customers = [
  { id: 1, name: 'Atlas Corp', address: 'A', account_number: 'A1', agency: 'Agadir', city: 'Agadir' },
  { id: 2, name: 'Atelier Beta', address: 'B', account_number: 'B1', agency: 'Casa', city: 'Casa' },
]

describe('useDrawerAutocomplete', () => {
  it('filters customers by query', () => {
    const { result } = renderHook(() => useDrawerAutocomplete(customers))

    act(() => result.current.handleSearchChange('Atlas'))

    expect(result.current.showAutocomplete).toBe(true)
    expect(result.current.filteredCustomers).toHaveLength(1)
    expect(result.current.filteredCustomers[0].name).toBe('Atlas Corp')
  })

  it('supports keyboard navigation and selection', () => {
    const { result } = renderHook(() => useDrawerAutocomplete(customers))
    const onSelect = vi.fn()

    act(() => result.current.handleSearchChange('a'))
    act(() => result.current.handleSearchChange('at'))

    expect(result.current.activeIndex).toBe(0)

    act(() => {
      result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: vi.fn() }, onSelect)
    })

    expect(result.current.activeIndex).toBe(1)

    act(() => {
      result.current.handleKeyDown({ key: 'Enter', preventDefault: vi.fn() }, onSelect)
    })

    expect(onSelect).toHaveBeenCalled()
  })

  it('closes dropdown on Escape', () => {
    const { result } = renderHook(() => useDrawerAutocomplete(customers))
    const onSelect = vi.fn()
    act(() => result.current.handleSearchChange('Atlas'))

    act(() => {
      result.current.handleKeyDown({ key: 'Escape', preventDefault: vi.fn() }, onSelect)
    })

    expect(result.current.showAutocomplete).toBe(false)
    expect(result.current.activeIndex).toBe(-1)
  })
})
