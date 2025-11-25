import { IsoLoader } from './IsoLoader'
import styles from './Toolbar.module.css'
import { usePcsxFullscreen } from '../hooks/usePcsxFullscreen'

export function Toolbar() {
  const { toggleFullscreen } = usePcsxFullscreen()

  return (
    <header className={styles.toolbar}>
      <h1 className={styles.title}>PCSX-wasm</h1>
      <div className={styles.actions}>
        <IsoLoader />
        <button className={styles.button} type="button" onClick={toggleFullscreen}>
          Fullscreen
        </button>
      </div>
    </header>
  )
}
