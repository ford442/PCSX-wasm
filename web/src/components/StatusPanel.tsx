import { useEmulator } from '../context/EmulatorContext'
import styles from './StatusPanel.module.css'

export function StatusPanel() {
  const { isoName, statusMessage, isRunning } = useEmulator()

  return (
    <section className={styles.panel} aria-live="polite">
      <div className={styles.row}>
        <span className={styles.label}>ISO:</span>
        <span className={styles.value}>{isoName ?? 'None selected'}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Status:</span>
        <span className={styles.value}>{statusMessage}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Emulator:</span>
        <span className={styles.value}>{isRunning ? 'Running' : 'Idle'}</span>
      </div>
    </section>
  )
}

