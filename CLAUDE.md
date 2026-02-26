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
│   └── presets.js              # Default email size presets (fallback when API unavailable)
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
│   ├── calculateTransforms.js      # calculateFitScale(), calculateFillScale()
│   ├── downsample.js               # Stepped 50% downsampling for high-quality scaling
│   ├── exportImage.js              # exportImage() → JPEG data URL, dataUrlToBlob()
│   ├── formatFileSize.js           # bytes → human-readable string
│   └── resolvePresetDimensions.js  # Resolves effective target dimensions (handles widthOnly mode)
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
- **Presets** are managed via the admin page (`/#/admin`) and persisted to a PHP backend (`/api/data/presets.json`). Default presets in `src/config/presets.js` are used as fallback. Each preset has: `id`, `name`, `width`, `height` (optional for widthOnly), `sizeMode`, `description`, `fileType`, `compression`.
- **Sizing modes:** Presets support two modes via the `sizeMode` field:
  - `'fixed'` (default) — both width and height are set; the user crops/positions within the fixed aspect ratio frame.
  - `'widthOnly'` — only width is set; the exported height is determined by the source image's natural aspect ratio. The effective dimensions are resolved in `MainApp.jsx` via `resolvePresetDimensions()`, so all downstream components (Editor, EditorCanvas, exportImage) receive concrete numbers and need no special handling.
- **Rotation** is restricted to 90° increments only (no free-form rotation slider).
- **Export** format and compression are configurable per preset (JPEG/PNG/WebP). Default is JPEG at 92% quality with white (#FFFFFF) background fill.
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
- Test width-only presets: verify exported width matches the preset and height matches the source image's aspect ratio
- Test switching between fixed and width-only modes in the admin form

## Common Tasks

### Adding a new preset
Use the admin page (`/#/admin`) to add presets via the UI, then click Publish. Default presets can also be edited in `src/config/presets.js` as a fallback.

### Changing export quality or format
Export format and compression are now configurable per preset via the admin page. The default fallback is JPEG at 92% quality (`src/utils/exportImage.js`).

### Changing the transform pipeline
Update BOTH `src/components/EditorCanvas.jsx` (preview) and `src/utils/exportImage.js` (export) — they must stay in sync. The transform order is: translate → rotate → flip → draw.
