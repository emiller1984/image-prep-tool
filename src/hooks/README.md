# src/hooks/

Custom React hooks for reusable stateful logic.

## Hooks

### useImageLoader()
Loads a File into an HTMLImageElement with metadata extraction.
```js
const { image, imageInfo, error, loading, loadImage, clearImage } = useImageLoader()
// imageInfo: { name, naturalWidth, naturalHeight, fileSize, type }
// loadImage(file) — validates image type, creates object URL, loads into <img>
// clearImage() — revokes object URL, resets state
```
**Used by:** MainApp.jsx, BulkApp.jsx (via MultiImageUploader)

### useCanvasRenderer()
Returns a `render()` function for the editor preview canvas.
```js
const { render } = useCanvasRenderer()
// render(ctx, image, targetW, targetH, transforms, displayScale)
// Pipeline: clear → white bg → translate → rotate → flip → drawImage
```
**Used by:** EditorCanvas.jsx, CombinationThumbnail.jsx

### usePresets()
Fetches presets from the PHP backend on mount; falls back to default presets on error.
```js
const { presets, loading, error } = usePresets()
// Calls presetService.fetchPresets() → returns array of preset objects
// Cleanup: cancellation flag prevents state updates after unmount
```
**Used by:** MainApp.jsx, BulkApp.jsx

### useBulkExport()
Manages async bulk export of multiple image×preset combinations into a ZIP file.
```js
const { progress, result, error, startExport, abort, reset } = useBulkExport()
// progress: { current: Number, total: Number, phase: 'idle'|'rendering'|'zipping'|'done'|'error' }
// startExport(images, presets, transforms) — begins async render + ZIP pipeline
// abort() — cancels mid-export
// result: Blob (ZIP file) when phase === 'done'
```
**Used by:** BulkExportStep.jsx

## Dependencies
- `src/services/presetService.js` (usePresets)
- `src/utils/exportImage.js` (useBulkExport)
- `src/utils/generateFilename.js` (useBulkExport)
- `jszip` (useBulkExport)
