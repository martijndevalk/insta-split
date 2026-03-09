# InstaSplit Pro

A refined layout editor for designing and splitting seamless Instagram carousels — entirely in your browser.

## ✨ Features

- **Multi-image Layout**: Upload up to 20 photos (PNG/JPG) and arrange them across a configurable number of slices.
- **Drag & Drop Reorder**: Drag images to swap their positions on the canvas.
- **Real-time Controls**: Adjust format (portrait / square / landscape), slice count, spacing, and padding with instant preview.
- **Background Customization**: Set a solid background color or upload a background image (cover-fit).
- **Zoom & Pan**: Scroll-wheel zoom and drag-to-scroll across the canvas.
- **High-Quality Export**: Download individual slides as JPEG files directly from the browser.
- **PWA Support**: Installable as a Progressive Web App with offline capabilities.
- **Privacy-first**: All processing happens client-side — no data leaves your browser.

## � Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Astro 5](https://astro.build) |
| UI | [React 19](https://react.dev) |
| Styling | CSS Modules + vanilla CSS with custom Design Tokens |
| Language | TypeScript |
| Deployment | GitHub Pages via GitHub Actions |

## 🚀 Getting Started

### 1. Install

```bash
npm install
```

### 2. Develop

```bash
npm run dev
```

The editor is available at `http://localhost:4321/insta-split`.

### 3. Build & Preview

```bash
npm run build
npm run preview
```

Output is written to the `dist/` folder.

## 📁 Project Structure

```
src/
├── components/
│   ├── App.tsx                  # Root component — state management & layout
│   ├── CanvasArea/
│   │   ├── CanvasArea.tsx       # Canvas rendering, zoom, drag-to-scroll
│   │   └── DragOverlay.tsx      # Drag & drop image reordering
│   ├── Sidebar/
│   │   ├── Sidebar.tsx          # Sidebar shell
│   │   ├── FormatSection.tsx    # Portrait / Square / Landscape selector
│   │   ├── ControlsSection.tsx  # Slice count, spacing, padding sliders
│   │   ├── MediaSection.tsx     # Photo & background upload controls
│   │   └── DownloadSection.tsx  # Export button
│   └── ui/                     # Reusable UI primitives
│       ├── Section.tsx          # Collapsible section card
│       ├── Slider.tsx           # Labeled range input
│       └── IconButton.tsx       # Icon-only button
├── layouts/
│   └── Layout.astro             # HTML shell, fonts, PWA, theme init
├── pages/
│   └── index.astro              # Single-page entry point
├── styles/
│   └── global.css               # Design tokens & global reset
├── utils/
│   └── canvas.ts                # Canvas drawing, image loading, validation
└── types.ts                     # Shared TypeScript type definitions
```

## 📜 License

Private project.
