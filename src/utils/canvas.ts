import type { LayoutImage } from '../types';

/** Background image fit options for cover-drawing onto canvas */
interface DrawDimensions {
  drawX: number;
  drawY: number;
  drawW: number;
  drawH: number;
}

/**
 * Calculates cover-fit dimensions for drawing a background image
 * onto a canvas, maintaining aspect ratio.
 */
export function calculateCoverFit(
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number
): DrawDimensions {
  const canvasRatio = canvasWidth / canvasHeight;
  const imgRatio = imgWidth / imgHeight;

  if (imgRatio > canvasRatio) {
    const drawH = canvasHeight;
    const drawW = imgWidth * (canvasHeight / imgHeight);
    return {
      drawX: (canvasWidth - drawW) / 2,
      drawY: 0,
      drawW,
      drawH,
    };
  } else {
    const drawW = canvasWidth;
    const drawH = imgHeight * (canvasWidth / imgWidth);
    return {
      drawX: 0,
      drawY: (canvasHeight - drawH) / 2,
      drawW,
      drawH,
    };
  }
}

/** Rendering config for drawCanvas */
interface DrawCanvasOptions {
  canvas: HTMLCanvasElement;
  canvasWidth: number;
  canvasHeight: number;
  bgColor: string;
  bgImage: HTMLImageElement | null;
  images: LayoutImage[];
}

/**
 * Draws the full panorama on a given canvas: bg color, bg image, then foreground images.
 */
export function drawCanvas({
  canvas,
  canvasWidth,
  canvasHeight,
  bgColor,
  bgImage,
  images,
}: DrawCanvasOptions): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background color
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Background image (cover fit)
  if (bgImage) {
    const { drawX, drawY, drawW, drawH } = calculateCoverFit(
      bgImage.width,
      bgImage.height,
      canvasWidth,
      canvasHeight
    );
    ctx.drawImage(bgImage, drawX, drawY, drawW, drawH);
  }

  // Foreground images
  for (const img of images) {
    ctx.drawImage(img.img, img.x, img.y, img.w, img.h);
  }
}

/** Maximum allowed file size in bytes (25 MB) */
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

/** PNG magic bytes: 89 50 4E 47 */
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];
/** JPEG magic bytes: FF D8 FF */
const JPEG_MAGIC = [0xff, 0xd8, 0xff];

/**
 * Validates that a file's magic bytes match PNG or JPEG format.
 * This is more reliable than checking MIME type alone, which can be spoofed.
 */
export async function validateImageMagicBytes(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const isPng = PNG_MAGIC.every((b, i) => bytes[i] === b);
  const isJpeg = JPEG_MAGIC.every((b, i) => bytes[i] === b);

  return isPng || isJpeg;
}

/**
 * Loads an image file into an HTMLImageElement via object URL.
 * Revokes the object URL after loading to prevent memory leaks.
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}

/**
 * Generates a short random ID string.
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2);
}

/**
 * Fisher-Yates shuffle (returns a new array).
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
