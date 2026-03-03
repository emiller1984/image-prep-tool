# src/utils/

Pure utility functions with no React dependencies. All are importable by any component or hook.

## Utilities

### calculateTransforms.js
```js
calculateFitScale(imageW, imageH, targetW, targetH, rotationDeg)   // → Number (min ratio, fits within frame)
calculateFillScale(imageW, imageH, targetW, targetH, rotationDeg)  // → Number (max ratio, fills frame)
```
Both account for rotation's effect on the effective bounding box. Internal helper: `getEffectiveDimensions()`.

### downsample.js
```js
downsample(image, targetDrawWidth, targetDrawHeight)  // → OffscreenCanvas | null
```
Stepped 50% pre-scaling for Photoshop-like quality. Returns null if upscaling or no scaling needed. Halves dimensions repeatedly until within 2× of target, then final exact scale. Sets `imageSmoothingQuality = 'high'`.

### exportImage.js
```js
exportImage(image, targetWidth, targetHeight, transforms, fileType = 'jpeg', compression = 0.92)  // → dataUrl
dataUrlToBlob(dataUrl)  // → Blob
```
Renders final image at exact target dimensions using same transform pipeline as EditorCanvas. White background for JPEG/WebP; transparent for PNG.
**Also exports:** `EXTENSIONS`, `FORMAT_LABELS`, `MIME_TYPES` (format constant maps).

### formatFileSize.js
```js
formatFileSize(bytes)  // → "1.2 MB"
```

### generateFilename.js
```js
generateFilename(originalName, preset, usedNames)  // → "photo_large-offer_600x400.jpg"
```
Creates unique filenames for bulk export. Format: `{baseName}_{presetSlug}_{WxH}.{ext}`. Appends counter suffix on collision. `usedNames` is a Set for dedup tracking.

### resolvePresetDimensions.js
```js
resolvePresetDimensions(preset, image)  // → { targetWidth, targetHeight }
```
Resolves `widthOnly` presets by calculating height from image's natural aspect ratio. Fixed presets pass through unchanged.
