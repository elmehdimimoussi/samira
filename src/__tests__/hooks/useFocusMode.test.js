import { describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFocusMode } from '@/hooks/useFocusMode'

describe('useFocusMode', () => {
  it('sets active field on focus and computes state', () => {
    const { result } = renderHook(() => useFocusMode())

    act(() => {
      result.current.handleFieldFocus('drawerName')
    })

    expect(result.current.activeFieldId).toBe('drawerName')
    expect(result.current.isFocusModeActive).toBe(true)
    expect(result.current.getFieldState('drawerName')).toEqual({
      isActive: true,
      shouldDim: false,
    })
    expect(result.current.getFieldState('beneficiaryName')).toEqual({
      isActive: false,
      shouldDim: true,
    })
  })

  it('clears active field when blur leaves container', () => {
    const { result } = renderHook(() => useFocusMode())

    act(() => {
      result.current.handleFieldFocus('amount')
    })

    act(() => {
      result.current.handleFieldBlur({
        currentTarget: { contains: () => false },
        relatedTarget: null,
      })
    })

    expect(result.current.activeFieldId).toBe(null)
    expect(result.current.isFocusModeActive).toBe(false)
  })

  it('keeps active field when blur moves inside same container', () => {
    const { result } = renderHook(() => useFocusMode())

    act(() => {
      result.current.handleFieldFocus('amount')
    })

    act(() => {
      result.current.handleFieldBlur({
        currentTarget: { contains: () => true },
        relatedTarget: {},
      })
    })

    expect(result.current.activeFieldId).toBe('amount')
  })
})
