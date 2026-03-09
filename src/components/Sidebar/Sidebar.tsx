import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Sidebar({ state, actions }: SidebarProps): ReactNode {
  const hasPhotos = state.images.length > 0;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>InstaSplit</h1>
        <p className={styles.subtitle}>Extended Layout Editor</p>
      </div>

      <div className={styles.scrollArea}>
        {/* Step 1: Upload photos — always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          <MediaSection state={state} actions={actions} />
        </motion.div>

        {/* Step 2 & 3: Only appear after photos are uploaded */}
        <AnimatePresence>
          {hasPhotos && (
            <>
              <motion.div
                key="format-section"
                initial={{ opacity: 0, y: 30, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.5, ease: easeOut }}
              >
                <FormatSection state={state} actions={actions} />
              </motion.div>

              <motion.div
                key="controls-section"
                initial={{ opacity: 0, y: 30, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
              >
                <ControlsSection state={state} actions={actions} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Export — only visible when photos are loaded */}
      <AnimatePresence>
        {hasPhotos && (
          <motion.div
            className={styles.footer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
          >
            <DownloadSection state={state} />
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
