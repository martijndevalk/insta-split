import { useState } from 'react';
import styles from './DownloadSection.module.css';

export function DownloadSection({ state }: { state: any }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    const { numSlices, SLICE_WIDTH, SLICE_HEIGHT, canvasWidth, canvasHeight, bgColor, bgImage, images } = state;

    // We can directly draw a pristine version by creating an offscreen canvas
    // First, draw the entire panorama
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = canvasWidth;
    fullCanvas.height = canvasHeight;
    const ctx = fullCanvas.getContext('2d');

    if (!ctx) return;

    // Draw background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw background image if any
    if (bgImage) {
      const canvasRatio = canvasWidth / canvasHeight;
      const imgRatio = bgImage.width / bgImage.height;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > canvasRatio) {
        drawH = canvasHeight;
        drawW = bgImage.width * (canvasHeight / bgImage.height);
        drawX = (canvasWidth - drawW) / 2;
        drawY = 0;
      } else {
        drawW = canvasWidth;
        drawH = bgImage.height * (canvasWidth / bgImage.width);
        drawX = 0;
        drawY = (canvasHeight - drawH) / 2;
      }
      ctx.drawImage(bgImage, drawX, drawY, drawW, drawH);
    }

    // Draw slices
    images.forEach((imgState: any) => {
      ctx.drawImage(imgState.img, imgState.x, imgState.y, imgState.w, imgState.h);
    });

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = SLICE_WIDTH;
    exportCanvas.height = SLICE_HEIGHT;
    const exCtx = exportCanvas.getContext('2d');

    if (!exCtx) return;

    for (let i = 0; i < numSlices; i++) {
        exCtx.clearRect(0, 0, SLICE_WIDTH, SLICE_HEIGHT);
        // Source image, source x, source y, source w, source h, dest x, dest y, dest w, dest h
        exCtx.drawImage(fullCanvas, i * SLICE_WIDTH, 0, SLICE_WIDTH, SLICE_HEIGHT, 0, 0, SLICE_WIDTH, SLICE_HEIGHT);

        const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.95);
        const a = document.createElement('a');
        a.download = `slide-${i + 1}.jpg`;
        a.href = dataUrl;
        a.click();

        await new Promise(r => setTimeout(r, 300)); // Small delay to let browser process downloads
    }

    setDownloading(false);
  };

  return (
    <button
      className={styles.downloadBtn}
      onClick={handleDownload}
      disabled={downloading}
    >
      {downloading ? "Bezig..." : "Export Slides"}
    </button>
  );
}
