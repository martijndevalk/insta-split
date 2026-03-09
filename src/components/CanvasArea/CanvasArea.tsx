import { useRef, useEffect, useCallback, type ReactNode } from 'react';
import { DragOverlay } from './DragOverlay';
import { drawCanvas } from '../../utils/canvas';
import type { AppState, AppActions } from '../../types';
import styles from './CanvasArea.module.css';

interface CanvasAreaProps {
  state: AppState;
  actions: AppActions;
}

export function CanvasArea({ state, actions }: CanvasAreaProps): ReactNode {
  const { zoom, canvasWidth, canvasHeight, SLICE_WIDTH, numSlices, bgColor, bgImage, images } = state;
  const { setZoom, swapImages, removeImage } = actions;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingScroll = useRef<boolean>(false);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  /* ── Drag-to-scroll handlers ── */

  const handleScrollPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      // Don't start drag-scroll on interactive elements
      if (target.closest('[data-drag-item]')) return;

      isDraggingScroll.current = true;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: scrollEl.scrollLeft,
        scrollTop: scrollEl.scrollTop,
      };
      scrollEl.style.cursor = 'grabbing';
      scrollEl.setPointerCapture(e.pointerId);
    },
    []
  );

  const handleScrollPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingScroll.current) return;
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      scrollEl.scrollLeft = dragStart.current.scrollLeft - dx;
      scrollEl.scrollTop = dragStart.current.scrollTop - dy;
    },
    []
  );

  const handleScrollPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingScroll.current) return;
      isDraggingScroll.current = false;
      const scrollEl = scrollRef.current;
      if (scrollEl) {
        scrollEl.style.cursor = '';
        scrollEl.releasePointerCapture(e.pointerId);
      }
    },
    []
  );

  /* ── Scroll-wheel zoom ── */

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    let ticking = false;
    const handleWheel = (e: WheelEvent): void => {
      e.preventDefault();
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const delta = e.deltaY > 0 ? -2 : 2;
        setZoom((prev: number) => Math.min(100, Math.max(2, prev + delta)));
        ticking = false;
      });
    };

    scrollEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollEl.removeEventListener('wheel', handleWheel);
  }, [setZoom]);

  /* ── Canvas rendering (rAF-throttled) ── */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const frameId = requestAnimationFrame(() => {
      drawCanvas({ canvas, canvasWidth, canvasHeight, bgColor, bgImage, images });
    });
    return () => cancelAnimationFrame(frameId);
  }, [canvasWidth, canvasHeight, bgColor, bgImage, images]);

  /* ── Computed layout ── */

  const scale = zoom / 100;
  const scaledWidth = canvasWidth * scale;
  const scaledHeight = canvasHeight * scale;

  return (
    <main className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.zoomControl}>
          <span className={`material-symbols-rounded ${styles.toolbarIcon}`}>search</span>
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
          <span className={`material-symbols-rounded ${styles.resIcon}`}>aspect_ratio</span>
          {canvasWidth} × {canvasHeight}
        </div>
      </div>

      {/* Scrollable Canvas Region */}
      <div
        ref={scrollRef}
        className={styles.scrollArea}
        onPointerDown={handleScrollPointerDown}
        onPointerMove={handleScrollPointerMove}
        onPointerUp={handleScrollPointerUp}
        onPointerCancel={handleScrollPointerUp}
      >
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
          {/* Slice Guides */}
          <div className={styles.guideContainer}>
            {Array.from({ length: numSlices - 1 }).map((_, i) => (
              <div
                key={i}
                className={styles.guideLine}
                style={{
                  left: (i + 1) * SLICE_WIDTH * scale,
                  height: scaledHeight,
                }}
              />
            ))}
          </div>
          {/* Drag Overlay */}
          <DragOverlay images={images} scale={scale} onSwap={swapImages} onRemove={removeImage} />
        </div>
      </div>
    </main>
  );
}
