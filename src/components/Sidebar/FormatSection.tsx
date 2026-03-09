import { memo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import type { AppState, AppActions, Orientation } from '../../types';
import { Section } from '../ui';
import styles from './FormatSection.module.css';

interface FormatSectionProps {
  state: AppState;
  actions: AppActions;
}

interface FormatOption {
  value: Orientation;
  label: string;
  icon: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  { value: 'portrait',  label: 'Portrait',  icon: 'crop_portrait' },
  { value: 'square',    label: 'Square',   icon: 'crop_square' },
  { value: 'landscape', label: 'Landscape', icon: 'crop_landscape' },
];

export const FormatSection = memo(function FormatSection({ state, actions }: FormatSectionProps): ReactNode {
  const { orientation } = state;
  const { setOrientation } = actions;

  return (
    <Section icon="aspect_ratio" title="Format" step={2}>
      <div className={styles.grid}>
        {FORMAT_OPTIONS.map((opt, i) => (
          <motion.button
            key={opt.value}
            className={styles.formatBtn}
            data-active={orientation === opt.value}
            onClick={() => setOrientation(opt.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <span className={`material-symbols-rounded ${styles.formatIcon}`}>{opt.icon}</span>
            {opt.label}
          </motion.button>
        ))}
      </div>
    </Section>
  );
});
