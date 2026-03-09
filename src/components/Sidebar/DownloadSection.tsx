import { useState, memo, type ReactNode } from 'react';
import type { AppState } from '../../types';
import { drawCanvas } from '../../utils/canvas';
import styles from './DownloadSection.module.css';

interface DownloadSectionProps {
  state: AppState;
}

export const DownloadSection = memo(function DownloadSection({ state }: DownloadSectionProps): ReactNode {
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleDownload = async (): Promise<void> => {
    setDownloading(true);

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

      // Small delay between downloads
      await new Promise<void>((r) => setTimeout(r, 300));
    }

    setDownloading(false);
  };

  return (
    <button
      className={styles.downloadBtn}
      onClick={handleDownload}
      disabled={downloading}
    >
      <span className="material-symbols-rounded">download</span>
      {downloading ? 'Exporting...' : 'Export Slides'}
    </button>
  );
});
