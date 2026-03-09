import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SplashScreen({ onComplete }: SplashScreenProps): ReactNode {
  const [phase, setPhase] = useState<'logo' | 'split' | 'done'>('logo');

  useEffect(() => {
    // Phase 1: Show logo + text for a moment
    const t1 = setTimeout(() => setPhase('split'), 1600);
    // Phase 2: Split and fade out
    const t2 = setTimeout(() => setPhase('done'), 2800);
    // Phase 3: Callback
    const t3 = setTimeout(() => onComplete(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className={styles.splash}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          {/* Background glow */}
          <motion.div
            className={styles.glow}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1.2, ease }}
          />

          <div className={styles.logoContainer}>
            {/* Left half of logo */}
            <motion.div
              className={styles.logoHalf}
              initial={{ x: 0, opacity: 0, scale: 0.8 }}
              animate={
                phase === 'split'
                  ? { x: -60, opacity: 0.3, scale: 0.8, rotate: -8 }
                  : { x: 0, opacity: 1, scale: 1, rotate: 0 }
              }
              transition={{
                duration: phase === 'split' ? 0.8 : 0.5,
                ease,
                delay: phase === 'logo' ? 0.2 : 0,
              }}
            >
              <svg viewBox="0 0 256 512" width="128" height="256" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="igLeft" x1="15%" y1="100%" x2="85%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                {/* Left half of background */}
                <clipPath id="leftClip">
                  <rect x="0" y="0" width="256" height="512" />
                </clipPath>
                <g clipPath="url(#leftClip)">
                  <rect x="32" y="32" width="448" height="448" rx="100" fill="url(#igLeft)" />
                  <path d="M240 112 L168 112 C128.235 112 96 144.235 96 184 L96 328 C96 367.765 128.235 400 168 400 L240 400" fill="none" stroke="white" strokeWidth="36" />
                  <path d="M240 192 A 64 64 0 0 0 240 320" fill="none" stroke="white" strokeWidth="36" />
                </g>
              </svg>
            </motion.div>

            {/* Dashed split line */}
            <motion.div
              className={styles.splitLine}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={
                phase === 'split'
                  ? { scaleY: 1, opacity: 1 }
                  : { scaleY: 0, opacity: 0 }
              }
              transition={{ duration: 0.4, ease }}
            />

            {/* Right half of logo */}
            <motion.div
              className={styles.logoHalf}
              initial={{ x: 0, opacity: 0, scale: 0.8 }}
              animate={
                phase === 'split'
                  ? { x: 60, opacity: 0.3, scale: 0.8, rotate: 8 }
                  : { x: 0, opacity: 1, scale: 1, rotate: 0 }
              }
              transition={{
                duration: phase === 'split' ? 0.8 : 0.5,
                ease,
                delay: phase === 'logo' ? 0.2 : 0,
              }}
            >
              <svg viewBox="256 0 256 512" width="128" height="256" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="igRight" x1="15%" y1="100%" x2="85%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <clipPath id="rightClip">
                  <rect x="256" y="0" width="256" height="512" />
                </clipPath>
                <g clipPath="url(#rightClip)">
                  <rect x="32" y="32" width="448" height="448" rx="100" fill="url(#igRight)" />
                  <path d="M272 112 L344 112 C383.765 112 416 144.235 416 184 L416 328 C416 367.765 383.765 400 344 400 L272 400" fill="none" stroke="white" strokeWidth="36" />
                  <path d="M272 192 A 64 64 0 0 1 272 320" fill="none" stroke="white" strokeWidth="36" />
                  <circle cx="344" cy="168" r="20" fill="white" />
                </g>
              </svg>
            </motion.div>
          </div>

          {/* Title text */}
          <motion.div
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase === 'split' ? 0 : 1, y: phase === 'split' ? -10 : 0 }}
            transition={{ duration: 0.5, ease, delay: phase === 'logo' ? 0.4 : 0 }}
          >
            <span className={styles.titleInsta}>Insta</span>
            <span className={styles.titleSplit}>Split</span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'split' ? 0 : 0.6 }}
            transition={{ duration: 0.5, ease, delay: phase === 'logo' ? 0.6 : 0 }}
          >
            Extended Layout Editor
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
