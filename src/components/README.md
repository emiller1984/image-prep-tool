# src/components/

UI layer for the app's 3 routes. All components are functional with hooks.

## Route Mapping
| Route | Entry Component | Description |
|-------|----------------|-------------|
| `/` | `MainApp.jsx` | Single-image 3-step workflow |
| `/admin` | `admin/AdminPage.jsx` | Preset management (see `admin/README.md`) |
| `/bulk` | `bulk/BulkApp.jsx` | Batch processing (see `bulk/README.md`) |

## Single-Image Workflow Components

**`MainApp.jsx`** — Orchestrator. Owns step state (URL search params), selectedPreset, image, exportTransforms. Validates step prerequisites and auto-corrects URL. Resolves widthOnly presets via `resolvePresetDimensions()`.

**Step 1 — Select Size:**
- `PresetSelector.jsx` — Card grid of presets with aspect-ratio thumbnails. Calls `onSelect(preset)`.
- `ImageUploader.jsx` — Drag-and-drop + file picker. Validates image type. Calls `onImageSelect(file)`.

**Step 2 — Edit:**
- `Editor.jsx` — Manages `transforms` state. Keyboard shortcuts: arrows (pan), +/- (zoom), R (rotate), Esc (reset). Passes transforms to EditorCanvas and EditorControls.
- `EditorCanvas.jsx` — Canvas rendering with pointer-event pan and scroll zoom. Applies displayScale for on-screen preview. Uses `downsample()` for quality.
- `EditorControls.jsx` — Scale slider (% relative to fitScale), rotation buttons (90° increments), flip toggles, reset button.

**Step 3 — Export:**
- `ExportResult.jsx` — Shows final preview, original vs. exported comparison, file size, download button.

**`StepIndicator.jsx`** — Visual 3-step progress bar. Used by MainApp.

## Data Flow
```
MainApp (state owner)
  ├── PresetSelector → onSelect(preset)
  ├── ImageUploader → onImageSelect(file) → useImageLoader
  ├── Editor (transforms state)
  │   ├── EditorCanvas (renders preview)
  │   └── EditorControls (modifies transforms)
  └── ExportResult (receives image + transforms + preset)
```

## Dependencies
- `src/hooks/` — useImageLoader, usePresets
- `src/utils/` — calculateTransforms, resolvePresetDimensions, exportImage, downsample
- `src/services/presetService.js` — used by admin components
