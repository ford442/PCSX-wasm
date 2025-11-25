import { useIsoLoader } from '../hooks/useIsoLoader'
import styles from './IsoLoader.module.css'

export function IsoLoader() {
  const { inputRef, onFileSelected, openPicker } = useIsoLoader()

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        className={styles.hiddenInput}
        type="file"
        accept="application/x-iso9660-image,.bin,.img,.cue"
        onChange={onFileSelected}
      />
      <button className={styles.button} type="button" onClick={openPicker}>
        Load ISO
      </button>
    </div>
  )
}

