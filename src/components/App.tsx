import { useState, useMemo, useRef } from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { CanvasArea } from './CanvasArea/CanvasArea';
import styles from './App.module.css';

export type Orientation = 'portrait' | 'landscape';

export type ImageItem = {
  id: string;
  img: HTMLImageElement;
};

export type LayoutImage = ImageItem & {
  x: number;
  y: number;
  w: number;
  h: number;
};

export function App() {
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [numSlices, setNumSlices] = useState(3);
  const [gap, setGap] = useState(50);
  const [padding, setPadding] = useState(100);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [zoom, setZoom] = useState(20);

  const SLICE_WIDTH = 1080;
  const SLICE_HEIGHT = orientation === 'portrait' ? 1350 : 1080;
  const canvasWidth = SLICE_WIDTH * numSlices;
  const canvasHeight = SLICE_HEIGHT;

  const layoutImages = useMemo(() => {
    if (images.length === 0) return [];

    const totalGapsWidth = (images.length - 1) * gap;
    const availableWidth = canvasWidth - (padding * 2) - totalGapsWidth;
    const safeAvailableWidth = Math.max(10, availableWidth);

    const sumOriginalWidths = images.reduce((sum, item) => {
      const baseScale = (SLICE_HEIGHT * 0.8) / item.img.height;
      return sum + (item.img.width * baseScale);
    }, 0);

    const finalScale = sumOriginalWidths > 0 ? safeAvailableWidth / sumOriginalWidths : 1;

    let currentX = padding;
    return images.map((item) => {
      const baseScale = (SLICE_HEIGHT * 0.8) / item.img.height;
      const w = item.img.width * baseScale * finalScale;
      const h = item.img.height * baseScale * finalScale;
      const x = currentX;
      const y = (canvasHeight - h) / 2;

      currentX += w + gap;

      return { ...item, x, y, w, h };
    });
  }, [images, canvasWidth, canvasHeight, gap, padding, SLICE_HEIGHT]);

  const handleShuffle = () => {
    setImages((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  const handleImagesUpload = async (files: FileList) => {
    const newImages: ImageItem[] = [];
    for (const file of Array.from(files)) {
      const img = await new Promise<HTMLImageElement>((resolve) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.src = URL.createObjectURL(file);
      });
      newImages.push({ id: Math.random().toString(36).slice(2), img });
    }
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleBgUpload = async (file: File) => {
    const img = await new Promise<HTMLImageElement>((resolve) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.src = URL.createObjectURL(file);
    });
    setBgImage(img);
  };

  const resetBg = () => {
    setBgImage(null);
    setBgColor('#ffffff');
  };

  // The actual state block passed around
  const state = {
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
    SLICE_HEIGHT
  };

  const actions = {
    setOrientation,
    setNumSlices,
    setGap,
    setPadding,
    setBgColor,
    handleShuffle,
    handleImagesUpload,
    handleBgUpload,
    resetBg,
    setZoom
  };

  return (
    <div className={styles.mainLayout}>
      <Sidebar {...{ state, actions }} />
      <CanvasArea {...{ state, actions }} />
    </div>
  );
}
