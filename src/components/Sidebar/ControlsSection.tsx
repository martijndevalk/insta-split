import { memo, useMemo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import type { AppState, AppActions } from '../../types';
import { Section, Slider } from '../ui';
import styles from './ControlsSection.module.css';

interface ControlsSectionProps {
  state: AppState;
  actions: AppActions;
}

interface SliderConfig {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  icon: string;
}

export const ControlsSection = memo(function ControlsSection({ state, actions }: ControlsSectionProps): ReactNode {
  const { numSlices, gap, padding } = state;
  const { setNumSlices, setGap, setPadding, handleShuffle } = actions;

  const sliders: SliderConfig[] = useMemo(() => [
    {
      label: 'Slice Count',
      value: numSlices,
      min: 1,
      max: 20,
      onChange: setNumSlices,
      icon: 'grid_view',
    },
    {
      label: 'Spacing',
      value: gap,
      min: 0,
      max: 300,
      onChange: setGap,
      icon: 'space_bar',
    },
    {
      label: 'Padding',
      value: padding,
      min: 0,
      max: 800,
      onChange: setPadding,
      icon: 'padding',
    },
  ], [numSlices, gap, padding, setNumSlices, setGap, setPadding]);

  return (
    <Section icon="tune" title="Layout" step={3}>
      <div className={styles.content}>
        {sliders.map((slider) => (
          <Slider
            key={slider.label}
            label={slider.label}
            icon={slider.icon}
            value={slider.value}
            min={slider.min}
            max={slider.max}
            onChange={slider.onChange}
          />
        ))}

        <motion.button
          onClick={handleShuffle}
          className={styles.shuffleBtn}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="material-symbols-rounded">shuffle</span>
          Shuffle Order
        </motion.button>
      </div>
    </Section>
  );
});
