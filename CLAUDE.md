# Email Image Resizer

## Project Context
Internal tool for content managers to resize images for marketing email templates.
All image processing is client-side using the Canvas API — no backend.
Deployed to evanart.com/image-prep-tool via GitHub Actions + FTP on every push to `main`.

## Tech Stack
- React 18 with Vite 6 (dev: `npm run dev`, build: `npm run build`)
- Tailwind CSS 3.4 for styling (custom theme in tailwind.config.js)
- No external image processing libraries — use native Canvas API
- Node 20 in CI

## Architecture

### 3-Step Workflow
The app is a linear 3-step flow managed by `App.jsx`:
1. **Select Size** — pick a preset + upload an image
2. **Edit** — pan, zoom, rotate, flip the image within the target frame
3. **Export** — preview the result, download as JPEG

### File Structure
```
src/
├── App.jsx                     # Root component, step routing, global state
├── main.jsx                    # React entry point
├── config/
│   └── presets.js              # 8 email size presets (single source of truth)
├── components/
│   ├── StepIndicator.jsx       # 3-step progress bar
│   ├── PresetSelector.jsx      # Preset card grid with aspect-ratio thumbnails
│   ├── ImageUploader.jsx       # Drag-and-drop + file picker with validation
│   ├── Editor.jsx              # Main editor: manages transforms state + keyboard shortcuts
│   ├── EditorCanvas.jsx        # Canvas rendering + pointer pan/scroll zoom
│   ├── EditorControls.jsx      # Scale slider, rotation buttons, flip, reset
│   └── ExportResult.jsx        # Preview, original-vs-exported comparison, download
├── hooks/
│   ├── useImageLoader.js       # File → HTMLImageElement, returns {image, imageInfo, error, loading, loadImage, clearImage}
│   └── useCanvasRenderer.js    # Canvas draw helper (currently used indirectly)
├── utils/
│   ├── calculateTransforms.js  # calculateFitScale(), calculateFillScale()
│   ├── downsample.js           # Stepped 50% downsampling for high-quality scaling
│   ├── exportImage.js          # exportImage() → JPEG data URL, dataUrlToBlob()
│   └── formatFileSize.js       # bytes → human-readable string
└── styles/
    └── index.css               # Tailwind directives + checkerboard pattern + range input styling
```

### Transform Data Model
All image positioning is represented as a single transforms object, passed through the editor and into export:
```js
{
  scale: Number,      // Absolute scale factor (1.0 ≠ 100% — it's relative to image natural size)
  rotation: Number,   // Degrees, constrained to 90° increments (-180, -90, 0, 90, 180)
  offsetX: Number,    // Horizontal pan offset in target-resolution pixels
  offsetY: Number,    // Vertical pan offset in target-resolution pixels
  flipH: Boolean,     // Horizontal mirror
  flipV: Boolean      // Vertical mirror
}
```

### Canvas Rendering Pipeline
Both the editor preview and export use the same transform order (this must stay consistent):
1. `translate(centerX + offsetX, centerY + offsetY)`
2. `rotate(rotation)`
3. `scale(flipH, flipV)`
4. `drawImage()` centered at origin

The editor preview scales everything by a `displayScale` factor to fit on screen, while export renders at the exact target pixel dimensions.

### Image Quality Strategy
Direct Canvas downscaling uses bilinear interpolation, which produces jagged results on large scale reductions. To get Photoshop-like quality:
- `downsample.js` pre-scales the image in repeated 50% steps before the final draw
- `imageSmoothingQuality` is set to `'high'` on all canvas contexts
- This applies to both the editor preview AND the export pipeline

## Key Design Decisions
- **Presets** are defined in `src/config/presets.js` — this is the single source of truth for all target sizes. Each preset has: `id`, `label`, `width`, `height`, `useCase`.
- **Rotation** is restricted to 90° increments only (no free-form rotation slider).
- **Export** is always JPEG at 92% quality with white (#FFFFFF) background fill.
- **Scale percentage** displayed in the UI is relative to the "fit" scale (100% = image fits perfectly within the target frame).
- **Keyboard shortcuts** in the editor: Arrow keys ±1px (Shift for ±10px), +/- zoom, R rotate 90°, Esc reset.
- **Vite base path** is set to `/image-prep-tool/` for subdirectory hosting.

## Code Conventions
- Functional components with hooks only — no class components
- Custom hooks in `src/hooks/` for reusable stateful logic
- Utility functions in `src/utils/` — pure functions, no React dependencies
- Use pointer events (not mouse events) for cross-device compatibility
- Tailwind for all styling — no inline style objects except for dynamic canvas dimensions

## Deployment
- **Trigger:** push to `main`
- **Pipeline:** `.github/workflows/deploy.yml` → checkout → Node 20 → `npm ci` → `npm run build` → FTP deploy
- **FTP target:** `image-prep-tool/` (relative to FTP home, which is already `public_html/`)
- **Secrets required:** `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (configured in GitHub repo settings)
- **Live URL:** evanart.com/image-prep-tool

## Testing Priorities
- Verify exported image dimensions exactly match the selected preset
- Test with various input formats: JPG, PNG (with transparency), WebP, SVG, GIF
- Test with extreme aspect ratios (very wide, very tall, square)
- Test rotation at 90° and 270° (swaps effective width/height in fit/fill calculations)
- Verify white background with no transparency in exported JPGs
- Test stepped downsampling quality with logos and fine-detail images scaled down significantly
- Verify pan, zoom, and flip all carry through correctly from editor to export

## Common Tasks

### Adding a new preset
Add an entry to the array in `src/config/presets.js`. No other changes needed — the grid and all logic read from this file.

### Changing export quality or format
Edit the `canvas.toDataURL()` call in `src/utils/exportImage.js`. Currently `('image/jpeg', 0.92)`.

### Changing the transform pipeline
Update BOTH `src/components/EditorCanvas.jsx` (preview) and `src/utils/exportImage.js` (export) — they must stay in sync. The transform order is: translate → rotate → flip → draw.
