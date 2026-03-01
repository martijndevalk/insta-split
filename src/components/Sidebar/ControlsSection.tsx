import styles from './ControlsSection.module.css';

export function ControlsSection({ state, actions }: { state: any; actions: any }) {
  const { numSlices, gap, padding } = state;
  const { setNumSlices, setGap, setPadding, handleShuffle } = actions;

  return (
    <section className={styles.container}>
      <h3 className={styles.sectionTitle}>2. Layout Instellingen</h3>

      <div className={styles.content}>
        <div className={styles.controlGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Aantal Slices (Max 20)</label>
            <span className={styles.valueRed}>{numSlices}</span>
          </div>
          <input
            type="range"
            value={numSlices}
            min="1" max="20"
            onChange={(e) => setNumSlices(Number(e.target.value))}
            className={styles.rangeInput}
          />
        </div>

        <div className={styles.controlGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Tussenruimte (Gap)</label>
            <span className={styles.valuePink}>{gap}</span>
          </div>
          <input
            type="range"
            value={gap}
            min="0" max="300"
            onChange={(e) => setGap(Number(e.target.value))}
            className={styles.rangeInput}
          />
        </div>

        <div className={styles.controlGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Zij-marge (Padding)</label>
            <span className={styles.valuePink}>{padding}</span>
          </div>
          <input
            type="range"
            value={padding}
            min="0" max="800"
            onChange={(e) => setPadding(Number(e.target.value))}
            className={styles.rangeInput}
          />
        </div>

        <button onClick={handleShuffle} className={styles.magicBtn}>
          Hussel Volgorde
        </button>
      </div>
    </section>
  );
}
