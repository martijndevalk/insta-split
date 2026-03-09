import type { ReactNode } from 'react';
import type { AppState, AppActions } from '../../types';
import { FormatSection } from './FormatSection';
import { ControlsSection } from './ControlsSection';
import { MediaSection } from './MediaSection';
import { DownloadSection } from './DownloadSection';
import styles from './Sidebar.module.css';

interface SidebarProps {
  state: AppState;
  actions: AppActions;
}

export function Sidebar({ state, actions }: SidebarProps): ReactNode {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>InstaSplit</h1>
        <p className={styles.subtitle}>Extended Layout Editor</p>
      </div>

      <div className={styles.scrollArea}>
        <FormatSection state={state} actions={actions} />
        <ControlsSection state={state} actions={actions} />
        <MediaSection state={state} actions={actions} />
      </div>

      <div className={styles.footer}>
        <DownloadSection state={state} />
      </div>
    </aside>
  );
}
