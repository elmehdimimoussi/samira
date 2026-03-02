import { describe, expect, it } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useLCForm } from '@/hooks/useLCForm'

describe('useLCForm', () => {
  it('loads initial data and exposes defaults', async () => {
    const { result } = renderHook(() => useLCForm())

    await waitFor(() => {
      expect(window.electronAPI.customers.getAll).toHaveBeenCalled()
      expect(window.electronAPI.frames.getAll).toHaveBeenCalled()
    })

    expect(result.current.formData.creationPlace).toBe('Agadir')
  })

  it('updates amount and derived amountText', async () => {
    const { result } = renderHook(() => useLCForm())

    act(() => {
      result.current.handleAmountChange({ target: { value: '1250' } })
    })

    await waitFor(() => {
      expect(result.current.formData.amountText).not.toBe('')
    })
  })

  it('resets form after confirmation', () => {
    const { result } = renderHook(() => useLCForm())

    act(() => {
      result.current.setFormData((prev) => ({ ...prev, tireurName: 'Changed' }))
      result.current.confirmReset()
    })

    expect(result.current.formData.tireurName).toBe('')
    expect(result.current.activeSection).toBe('general')
  })
})
