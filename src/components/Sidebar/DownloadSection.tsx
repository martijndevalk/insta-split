import { useState, memo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { AppState } from '../../types';
import { drawCanvas } from '../../utils/canvas';
import styles from './DownloadSection.module.css';

interface DownloadSectionProps {
  state: AppState;
}

export const DownloadSection = memo(function DownloadSection({ state }: DownloadSectionProps): ReactNode {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleDownload = async (): Promise<void> => {
    setDownloading(true);
    setProgress(0);

    const { numSlices, SLICE_WIDTH, SLICE_HEIGHT, canvasWidth, canvasHeight, bgColor, bgImage, images } = state;

    // Draw full panorama on offscreen canvas
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = canvasWidth;
    fullCanvas.height = canvasHeight;

    drawCanvas({
      canvas: fullCanvas,
      canvasWidth,
      canvasHeight,
      bgColor,
      bgImage,
      images,
    });

    // Export individual slices
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = SLICE_WIDTH;
    exportCanvas.height = SLICE_HEIGHT;
    const exCtx = exportCanvas.getContext('2d');

    if (!exCtx) {
      setDownloading(false);
      return;
    }

    for (let i = 0; i < numSlices; i++) {
      exCtx.clearRect(0, 0, SLICE_WIDTH, SLICE_HEIGHT);
      exCtx.drawImage(
        fullCanvas,
        i * SLICE_WIDTH, 0, SLICE_WIDTH, SLICE_HEIGHT,
        0, 0, SLICE_WIDTH, SLICE_HEIGHT
      );

      const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.95);
      const a = document.createElement('a');
      a.download = `slide-${i + 1}.jpg`;
      a.href = dataUrl;
      a.click();

      setProgress(Math.round(((i + 1) / numSlices) * 100));

      // Small delay between downloads
      await new Promise<void>((r) => setTimeout(r, 300));
    }

    setDownloading(false);
    setProgress(0);
  };

  return (
    <div className={styles.wrapper}>
      <motion.button
        className={styles.downloadBtn}
        onClick={handleDownload}
        disabled={downloading}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="material-symbols-rounded">download</span>
        {downloading ? `Exporting... ${progress}%` : 'Export Slides'}
      </motion.button>

      {/* Progress bar */}
      <AnimatePresence>
        {downloading && (
          <motion.div
            className={styles.progressTrack}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 4 }}
            exit={{ opacity: 0, height: 0 }}
          >
            <motion.div
              className={styles.progressBar}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
