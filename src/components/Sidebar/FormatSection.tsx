import styles from './FormatSection.module.css';
import type { Orientation } from '../App';

export function FormatSection({ state, actions }: { state: any; actions: any }) {
  const { orientation } = state;
  const { setOrientation } = actions;

  return (
    <section>
      <h3 className={styles.sectionTitle}>1. Formaat</h3>
      <div className={styles.grid}>
        <button
          className={styles.portraitBtn}
          data-active={orientation === 'portrait'}
          onClick={() => setOrientation('portrait')}
        >
          PORTRAIT
        </button>
        <button
          className={styles.landscapeBtn}
          data-active={orientation === 'landscape'}
          onClick={() => setOrientation('landscape')}
        >
          LANDSCAPE
        </button>
      </div>
    </section>
  );
}
