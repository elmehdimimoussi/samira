import { describe, expect, it } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useTemplateDesigner } from '@/hooks/useTemplateDesigner'

describe('useTemplateDesigner', () => {
  it('loads frames on mount', async () => {
    const { result } = renderHook(() => useTemplateDesigner())

    await waitFor(() => {
      expect(window.electronAPI.frames.getAll).toHaveBeenCalled()
    })

    expect(result.current.frames.length).toBeGreaterThan(0)
  })

  it('adds and updates a frame', () => {
    const { result } = renderHook(() => useTemplateDesigner())
    const initial = result.current.frames.length

    act(() => {
      result.current.addFrame()
    })

    expect(result.current.frames.length).toBe(initial + 1)

    const frameId = result.current.selectedFrame.id
    act(() => {
      result.current.updateFrame(frameId, { label: 'Updated' })
    })

    expect(result.current.frames.find((frame) => frame.id === frameId).label).toBe('Updated')
  })
})
