import type { ReactNode } from 'react';
import styles from './Slider.module.css';

interface SliderProps {
  /** Label text */
  label: string;
  /** Material Symbols icon name */
  icon: string;
  /** Current value */
  value: number;
  /** Range minimum */
  min: number;
  /** Range maximum */
  max: number;
  /** Called when the slider value changes */
  onChange: (value: number) => void;
  /** Optional suffix shown after the value (e.g. '%') */
  suffix?: string;
}

/**
 * Labeled range slider with icon, label and current-value badge.
 */
export function Slider({
  label,
  icon,
  value,
  min,
  max,
  onChange,
  suffix = '',
}: SliderProps): ReactNode {
  return (
    <div className={styles.controlGroup}>
      <div className={styles.labelRow}>
        <label className={styles.label}>
          <span className={`material-symbols-rounded ${styles.labelIcon}`}>
            {icon}
          </span>
          {label}
        </label>
        <span className={styles.value}>
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.rangeInput}
      />
    </div>
  );
}
