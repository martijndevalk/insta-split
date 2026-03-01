import styles from './MediaSection.module.css';
import { useRef } from 'react';

export function MediaSection({ state, actions }: { state: any; actions: any }) {
  const { bgColor, bgImage } = state;
  const { setBgColor, handleImagesUpload, handleBgUpload, resetBg } = actions;

  const imgInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const onImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImagesUpload(e.target.files);
    }
  };

  const onBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleBgUpload(e.target.files[0]);
    }
  };

  return (
    <section>
      <h3 className={styles.sectionTitle}>3. Media</h3>
      <div className={styles.container}>
        <button
          onClick={() => imgInputRef.current?.click()}
          className={styles.uploadBtn}
        >
          <span className={styles.uploadText}>Foto's toevoegen</span>
        </button>

        <div className={styles.bgGroup}>
          <label className={styles.bgLabel}>Achtergrond</label>
          <div className={styles.bgControls}>
            <div className={styles.colorPickerWrapper}>
              <span className={styles.colorText}>Kleur</span>
              <input
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                className={styles.colorInput}
              />
            </div>
            <button
              onClick={() => bgInputRef.current?.click()}
              className={styles.iconBtn}
              title="Afbeelding uploaden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={resetBg}
              className={styles.iconBtnDanger}
              title="Achtergrond resetten"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <input type="file" ref={imgInputRef} className={styles.hidden} multiple accept="image/*" onChange={onImagesChange} />
      <input type="file" ref={bgInputRef} className={styles.hidden} accept="image/*" onChange={onBgChange} />
    </section>
  );
}
