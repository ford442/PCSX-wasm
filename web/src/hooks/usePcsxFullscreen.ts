import { useCallback } from 'react'

export function usePcsxFullscreen() {
  const toggleFullscreen = useCallback(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas')
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    if (document.fullscreenElement) {
      void document.exitFullscreen()
      return
    }

    void parent.requestFullscreen()
  }, [])

  return { toggleFullscreen }
}

