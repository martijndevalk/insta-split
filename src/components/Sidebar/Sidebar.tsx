import styles from './Sidebar.module.css';
import { FormatSection } from './FormatSection';
import { ControlsSection } from './ControlsSection';
import { MediaSection } from './MediaSection';
import { DownloadSection } from './DownloadSection';

export function Sidebar({ state, actions }: { state: any; actions: any }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>InstaSplit Pro</h1>
        <p className={styles.subtitle}>Extended Layout Editor</p>
      </div>

      <div className={styles.scrollArea}>
        <FormatSection {...{ state, actions }} />
        <ControlsSection {...{ state, actions }} />
        <MediaSection {...{ state, actions }} />
      </div>

      <div className={styles.footer}>
        <DownloadSection {...{ state, actions }} />
      </div>
    </aside>
  );
}
