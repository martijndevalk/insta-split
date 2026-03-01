import styles from './CanvasArea.module.css';
import { useRef, useEffect } from 'react';

export function CanvasArea({ state, actions }: { state: any; actions: any }) {
  const { zoom, canvasWidth, canvasHeight, SLICE_WIDTH, numSlices, bgColor, bgImage, images } = state;
  const { setZoom } = actions;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Background image
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

    // Foreground images
    images.forEach((imgState: any) => {
      ctx.drawImage(imgState.img, imgState.x, imgState.y, imgState.w, imgState.h);
    });
  }, [canvasWidth, canvasHeight, bgColor, bgImage, images]);

  const scale = zoom / 100;
  const scaledWidth = canvasWidth * scale;
  const scaledHeight = canvasHeight * scale;

  return (
    <main className={styles.container}>
      {/* Toolbar inside Canvas Area */}
      <div className={styles.toolbar}>
        <div className={styles.zoomControl}>
          <span className={styles.toolbarLabel}>Zoom</span>
          <input
            type="range"
            value={zoom}
            min="2"
            max="100"
            onChange={(e) => setZoom(Number(e.target.value))}
            className={styles.zoomInput}
          />
          <span className={styles.zoomText}>{zoom}%</span>
        </div>
        <div className={styles.resInfo}>
          {canvasWidth} x {canvasHeight} PX
        </div>
      </div>

      {/* Scrollable Canvas Region */}
      <div className={styles.scrollArea}>
        <div
          className={styles.canvasWrapper}
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={styles.mainCanvas}
            style={{ width: scaledWidth, height: scaledHeight }}
          />
          {/* Guides Overlay */}
          <div className={styles.guideContainer}>
            {Array.from({ length: numSlices - 1 }).map((_, i) => (
              <div
                key={i}
                className={styles.guideLine}
                style={{
                  left: (i + 1) * SLICE_WIDTH * scale,
                  height: scaledHeight
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
