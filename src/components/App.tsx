import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar } from './Sidebar/Sidebar';
import { CanvasArea } from './CanvasArea/CanvasArea';
import { SplashScreen } from './SplashScreen';
import styles from './App.module.css';
import type { Orientation, ImageItem, AppState, AppActions } from '../types';
import { SLICE_HEIGHT_MAP, SLICE_WIDTH } from '../types';
import { loadImage, generateId, shuffleArray, validateImageMagicBytes, MAX_FILE_SIZE } from '../utils/canvas';

export function App(): ReactNode {
  const [showSplash, setShowSplash] = useState(true);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [numSlices, setNumSlices] = useState<number>(3);
  const [gap, setGap] = useState<number>(50);
  const [padding, setPadding] = useState<number>(100);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [zoom, setZoom] = useState<number>(20);
  const [swapFlash, setSwapFlash] = useState(false);

  const SLICE_HEIGHT = SLICE_HEIGHT_MAP[orientation];
  const canvasWidth = SLICE_WIDTH * numSlices;
  const canvasHeight = SLICE_HEIGHT;

  const layoutImages = useMemo(() => {
    if (images.length === 0) return [];

    const availableHeight = Math.max(10, canvasHeight - padding * 2);
    let currentX = padding;

    return images.map((item) => {
      const scale = availableHeight / item.img.height;
      const w = item.img.width * scale;
      const h = availableHeight;
      const x = currentX;
      const y = padding;

      currentX += w + gap;
      return { ...item, x, y, w, h };
    });
  }, [images, canvasHeight, gap, padding]);

  /* ── Actions ── */

  const handleShuffle = useCallback((): void => {
    setImages((prev) => shuffleArray(prev));
  }, []);

  const swapImages = useCallback((fromId: string, toId: string): void => {
    setImages((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((img) => img.id === fromId);
      const toIdx = next.findIndex((img) => img.id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
      return next;
    });
    // Flash effect on swap
    setSwapFlash(true);
    setTimeout(() => setSwapFlash(false), 300);
  }, []);

  const MAX_IMAGES = 20;
  const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

  const handleImagesUpload = useCallback(async (files: FileList): Promise<void> => {
    // Filter by MIME type, file size, and magic bytes
    const candidates = Array.from(files).filter(
      (f) => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE
    );
    if (candidates.length === 0) return;

    const filesToProcess = candidates.slice(0, MAX_IMAGES);
    const newImages: ImageItem[] = [];
    for (const file of filesToProcess) {
      try {
        const isValid = await validateImageMagicBytes(file);
        if (!isValid) continue;
        const img = await loadImage(file);
        newImages.push({ id: generateId(), img });
      } catch {
        // Skip files that fail to load (corrupt, etc.)
        console.warn(`Skipped invalid file: ${file.name}`);
      }
    }
    if (newImages.length === 0) return;
    setImages((prev) => {
      const allowed = MAX_IMAGES - prev.length;
      if (allowed <= 0) return prev;
      const updated = [...prev, ...newImages.slice(0, allowed)];
      // Auto-set slice count to match total number of images
      setNumSlices(Math.max(1, Math.min(20, updated.length)));
      return updated;
    });
  }, []);

  const handleBgUpload = useCallback(async (file: File): Promise<void> => {
    try {
      if (file.size > MAX_FILE_SIZE) return;
      if (!ALLOWED_TYPES.includes(file.type)) return;
      const isValid = await validateImageMagicBytes(file);
      if (!isValid) return;
      const img = await loadImage(file);
      setBgImage(img);
    } catch {
      console.warn(`Failed to load background image: ${file.name}`);
    }
  }, []);

  const resetBg = useCallback((): void => {
    setBgImage(null);
    setBgColor('#ffffff');
  }, []);

  const removeImage = useCallback((id: string): void => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      if (updated.length > 0) {
        setNumSlices(Math.max(1, Math.min(20, updated.length)));
      }
      return updated;
    });
  }, []);

  /* ── State & actions bundles ── */

  const state: AppState = useMemo(() => ({
    orientation,
    numSlices,
    gap,
    padding,
    bgColor,
    bgImage,
    images: layoutImages,
    zoom,
    canvasWidth,
    canvasHeight,
    SLICE_WIDTH,
    SLICE_HEIGHT,
  }), [orientation, numSlices, gap, padding, bgColor, bgImage, layoutImages, zoom, canvasWidth, canvasHeight]);

  const actions: AppActions = useMemo(() => ({
    setOrientation,
    setNumSlices,
    setGap,
    setPadding,
    setBgColor,
    handleShuffle,
    handleImagesUpload,
    handleBgUpload,
    resetBg,
    setZoom,
    swapImages,
    removeImage,
  }), [handleShuffle, handleImagesUpload, handleBgUpload, resetBg, swapImages, removeImage]);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      <motion.div
        className={styles.mainLayout}
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <Sidebar state={state} actions={actions} />
        <CanvasArea state={state} actions={actions} />
        {/* Swap flash overlay */}
        <AnimatePresence>
          {swapFlash && (
            <motion.div
              className={styles.swapFlash}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
