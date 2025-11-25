import { useRef, useEffect } from 'react'
import styles from './CanvasView.module.css'
import { usePcsxWorker } from '../hooks/usePcsxWorker'

export function CanvasView() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { status } = usePcsxWorker(canvasRef.current)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fff'
    ctx.font = '16px sans-serif'
    ctx.fillText(`PCSX worker status: ${status}`, 20, 40)
  }, [status])

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} width={640} height={480} className={styles.canvas} />
    </div>
  )
}
