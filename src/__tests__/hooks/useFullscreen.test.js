import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useFullscreen } from '@/hooks/useFullscreen'

describe('useFullscreen', () => {
  it('toggles fullscreen state with open and close', () => {
    const { result } = renderHook(() => useFullscreen())

    expect(result.current.isFullscreen).toBe(false)
    act(() => result.current.openFullscreen())
    expect(result.current.isFullscreen).toBe(true)
    act(() => result.current.closeFullscreen())
    expect(result.current.isFullscreen).toBe(false)
  })

  it('closes on Escape key', () => {
    const { result } = renderHook(() => useFullscreen())
    act(() => result.current.openFullscreen())

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })

    expect(result.current.isFullscreen).toBe(false)
  })

  it('locks body scroll while fullscreen', () => {
    const { result } = renderHook(() => useFullscreen())
    const initial = document.body.style.overflow

    act(() => result.current.openFullscreen())
    expect(document.body.style.overflow).toBe('hidden')

    act(() => result.current.closeFullscreen())
    expect(document.body.style.overflow).toBe(initial)
  })
})
