import { useCallback, useEffect, useRef, useState } from 'react'
import { useEmulator } from '../context/EmulatorContext'

export type WorkerStatus = 'idle' | 'loading' | 'ready' | 'error'

export function usePcsxWorker(canvas: HTMLCanvasElement | null) {
  const workerRef = useRef<Worker | null>(null)
  const [status, setStatus] = useState<WorkerStatus>('idle')
  const { setStatus: setUiStatus, setRunning, isoFile } = useEmulator()

  const initWorker = useCallback(async () => {
    if (!canvas || workerRef.current) return
    setStatus('loading')
    try {
      const worker = new Worker('/pcsx_worker.js')
      workerRef.current = worker
      worker.onmessage = (event) => {
        const data = event.data
        if (data.cmd === 'setStatus') {
          setUiStatus(data.txt)
        }
        if (data.cmd === 'print') {
          console.log('[PCSX]', data.txt)
        }
        if (data.cmd === 'render') {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            const imageData = ctx.createImageData(data.dx, data.dy)
            imageData.data.set(data.vram)
            ctx.putImageData(imageData, 0, 0)
          }
        }
      }
      setStatus('ready')
      setUiStatus('Worker ready')
    } catch (error) {
      console.error(error)
      setStatus('error')
      setUiStatus('Worker failed to initialize')
    }
  }, [canvas, setUiStatus])

  useEffect(() => {
    initWorker()
    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [initWorker])

  const loadIso = useCallback(() => {
    const worker = workerRef.current
    if (!worker || !isoFile) return
    setRunning(true)
    worker.postMessage({ cmd: 'loadfile', file: isoFile })
  }, [isoFile, setRunning])

  return { status, loadIso }
}
