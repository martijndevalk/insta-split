import { useState, useCallback, useRef, type ReactNode } from 'react';
import type { LayoutImage } from '../../types';
import styles from './DragOverlay.module.css';

interface DragOverlayProps {
  images: LayoutImage[];
  scale: number;
  onSwap: (fromId: string, toId: string) => void;
}

interface Position {
  x: number;
  y: number;
}

export function DragOverlay({ images, scale, onSwap }: DragOverlayProps): ReactNode {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<Position>({ x: 0, y: 0 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });

  const findTargetImage = useCallback(
    (cursorX: number, cursorY: number, currentDragId: string): LayoutImage | null => {
      const dragImg = images.find((img) => img.id === currentDragId);
      if (!dragImg) return null;

      const centerX = cursorX + (dragImg.w * scale) / 2;
      const centerY = cursorY + (dragImg.h * scale) / 2;

      return (
        images.find((img) => {
          if (img.id === currentDragId) return false;
          const ix = img.x * scale;
          const iy = img.y * scale;
          const iw = img.w * scale;
          const ih = img.h * scale;
          return centerX >= ix && centerX <= ix + iw && centerY >= iy && centerY <= iy + ih;
        }) ?? null
      );
    },
    [images, scale]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, img: LayoutImage): void => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const scaledX = img.x * scale;
      const scaledY = img.y * scale;

      dragOffsetRef.current = {
        x: e.clientX - rect.left - scaledX,
        y: e.clientY - rect.top - scaledY,
      };

      setDragId(img.id);
      setDragPos({ x: scaledX, y: scaledY });
    },
    [scale]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent): void => {
      if (!dragId) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newX = e.clientX - rect.left - dragOffsetRef.current.x;
      const newY = e.clientY - rect.top - dragOffsetRef.current.y;
      setDragPos({ x: newX, y: newY });

      const target = findTargetImage(newX, newY, dragId);
      setHoverId(target?.id ?? null);
    },
    [dragId, findTargetImage]
  );

  const handlePointerUp = useCallback((): void => {
    if (dragId && hoverId) {
      onSwap(dragId, hoverId);
    }
    setDragId(null);
    setHoverId(null);
  }, [dragId, hoverId, onSwap]);

  return (
    <div
      ref={containerRef}
      className={styles.overlay}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {images.map((img) => {
        const isDragging = img.id === dragId;
        const isHoverTarget = img.id === hoverId;

        const x = isDragging ? dragPos.x : img.x * scale;
        const y = isDragging ? dragPos.y : img.y * scale;
        const w = img.w * scale;
        const h = img.h * scale;

        return (
          <div
            key={img.id}
            data-drag-item
            className={`${styles.dragItem} ${isDragging ? styles.dragging : ''} ${isHoverTarget ? styles.hoverTarget : ''}`}
            style={{ left: x, top: y, width: w, height: h }}
            onPointerDown={(e) => handlePointerDown(e, img)}
          >
            {isHoverTarget && (
              <div className={styles.swapIndicator}>
                <span className="material-symbols-rounded">swap_vert</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
