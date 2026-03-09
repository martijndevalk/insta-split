import type { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Material Symbols icon name */
  icon: string;
  /** Visual variant — 'default' or 'danger' */
  variant?: 'default' | 'danger';
}

/**
 * Small icon-only button — used for toolbar-style actions.
 */
export function IconButton({
  icon,
  variant = 'default',
  className,
  ...rest
}: IconButtonProps): ReactNode {
  return (
    <button
      className={`${styles.iconBtn} ${className ?? ''}`}
      data-variant={variant}
      {...rest}
    >
      <span className="material-symbols-rounded">{icon}</span>
    </button>
  );
}
