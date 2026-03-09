import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps {
  /** Material Symbols icon name shown before the title */
  icon: string;
  /** Section heading text */
  title: string;
  /** Section content */
  children: ReactNode;
}

/**
 * Reusable sidebar section card with an icon + title header.
 */
export function Section({ icon, title, children }: SectionProps): ReactNode {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <span className={`material-symbols-rounded ${styles.sectionIcon}`}>{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}
