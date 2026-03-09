import { memo, type ReactNode } from 'react';
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
    <Section icon="aspect_ratio" title="Format">
      <div className={styles.grid}>
        {FORMAT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={styles.formatBtn}
            data-active={orientation === opt.value}
            onClick={() => setOrientation(opt.value)}
          >
            <span className={`material-symbols-rounded ${styles.formatIcon}`}>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </Section>
  );
});
