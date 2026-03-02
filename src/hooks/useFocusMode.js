import { useCallback, useMemo, useState } from 'react'

export function useFocusMode() {
  const [activeFieldId, setActiveFieldId] = useState(null)

  const handleFieldFocus = useCallback((fieldId) => {
    setActiveFieldId(fieldId)
  }, [])

  const handleFieldBlur = useCallback((event) => {
    if (event?.currentTarget?.contains(event?.relatedTarget)) {
      return
    }
    setActiveFieldId(null)
  }, [])

  const isFocusModeActive = activeFieldId !== null

  const getFieldState = useCallback(
    (fieldId) => {
      if (!isFocusModeActive) {
        return {
          isActive: false,
          shouldDim: false,
        }
      }

      return {
        isActive: activeFieldId === fieldId,
        shouldDim: activeFieldId !== fieldId,
      }
    },
    [activeFieldId, isFocusModeActive],
  )

  return useMemo(
    () => ({
      activeFieldId,
      isFocusModeActive,
      handleFieldFocus,
      handleFieldBlur,
      getFieldState,
    }),
    [activeFieldId, isFocusModeActive, handleFieldFocus, handleFieldBlur, getFieldState],
  )
}
