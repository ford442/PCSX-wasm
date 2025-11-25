import { useCallback, useRef } from 'react'
import { useEmulator } from '../context/EmulatorContext'

export function useIsoLoader() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { selectIso, setStatus } = useEmulator()

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const onFileSelected = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      selectIso(file)
      setStatus('ISO ready')
    },
    [selectIso, setStatus],
  )

  return {
    inputRef,
    openPicker,
    onFileSelected,
  }
}

