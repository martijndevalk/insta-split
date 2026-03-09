/** Shared type definitions for Insta-Split */

/** Supported image orientations / aspect ratios */
export type Orientation = 'portrait' | 'square' | 'landscape';

/** A raw uploaded image with a unique ID */
export interface ImageItem {
  id: string;
  img: HTMLImageElement;
}

/** An image positioned on the canvas layout */
export interface LayoutImage extends ImageItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Read-only application state passed to child components */
export interface AppState {
  orientation: Orientation;
  numSlices: number;
  gap: number;
  padding: number;
  bgColor: string;
  bgImage: HTMLImageElement | null;
  images: LayoutImage[];
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  SLICE_WIDTH: number;
  SLICE_HEIGHT: number;
}

/** Action callbacks exposed by App to child components */
export interface AppActions {
  setOrientation: (orientation: Orientation) => void;
  setNumSlices: (n: number) => void;
  setGap: (gap: number) => void;
  setPadding: (padding: number) => void;
  setBgColor: (color: string) => void;
  handleShuffle: () => void;
  handleImagesUpload: (files: FileList) => Promise<void>;
  handleBgUpload: (file: File) => Promise<void>;
  resetBg: () => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  swapImages: (fromId: string, toId: string) => void;
}

/** Height in pixels for each orientation */
export const SLICE_HEIGHT_MAP: Record<Orientation, number> = {
  portrait: 1350,   // 4:5 ratio
  square: 1080,     // 1:1 ratio
  landscape: 566,   // 1.91:1 ratio
};

/** Standard Instagram post width */
export const SLICE_WIDTH = 1080;
