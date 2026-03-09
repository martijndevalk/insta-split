import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps {
  /** Material Symbols icon name shown before the title */
  icon: string;
  /** Section heading text */
  title: string;
  /** Optional step number shown as a badge */
  step?: number;
  /** Section content */
  children: ReactNode;
}

/**
 * Reusable sidebar section card with an icon + title header.
 */
export function Section({ icon, title, step, children }: SectionProps): ReactNode {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>
        {step != null && <span className={styles.stepBadge}>{step}</span>}
        <span className={`material-symbols-rounded ${styles.sectionIcon}`}>{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}
