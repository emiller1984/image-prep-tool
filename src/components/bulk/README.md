# src/components/bulk/

Batch image processing: multiple images × multiple presets → single ZIP download.

## 3-Step Workflow
1. **Upload** (`BulkUploadStep.jsx`) — Select images + select presets. Shows combination count.
2. **Review** (`BulkReviewStep.jsx`) — Table grid: images as rows, presets as columns. Click any cell to edit.
3. **Export** (`BulkExportStep.jsx`) — Renders all combinations, packages into ZIP, shows progress.

## State Management
`BulkApp.jsx` uses `useReducer` for complex state. Actions:
- `ADD_IMAGES`, `IMAGE_LOADED`, `IMAGE_LOAD_ERROR`, `REMOVE_IMAGE`
- `TOGGLE_PRESET`, `SELECT_ALL_PRESETS`, `DESELECT_ALL_PRESETS`
- `INIT_COMBINATIONS` — creates transform matrix for all image×preset pairs
- `UPDATE_TRANSFORMS` — edit individual cell after modal editing
- `RESET` — clears all data + revokes object URLs

### State Shape
```js
{
  images: [{ id, file, image, info, loading, error }],
  selectedPresetIds: [],
  transforms: { "imageId::presetId": { scale, rotation, offsetX, offsetY, flipH, flipV } },
  editedCells: ["imageId::presetId", ...]  // tracks user-modified cells
}
```

**Key:** Transform lookup key format is `${imageId}::${presetId}`.
**Default scale:** `fillScale` (fills entire frame, may crop) — differs from single mode's `fitScale`.

## Components
| File | Role |
|------|------|
| `BulkApp.jsx` | Orchestrator — useReducer state, step routing, preset fetching |
| `BulkUploadStep.jsx` | Two-column layout: images + presets. Continue when both selected |
| `MultiImageUploader.jsx` | Multi-file drag-and-drop with per-image loading states |
| `PresetMultiSelector.jsx` | Checkbox grid of presets with select/deselect all |
| `BulkReviewStep.jsx` | Scrollable table with sticky image column |
| `CombinationThumbnail.jsx` | Mini canvas preview for each image×preset cell |
| `BulkEditorModal.jsx` | Modal wrapping Editor component for inline editing |
| `BulkExportStep.jsx` | Progress bar + download button for ZIP |
| `BulkStepIndicator.jsx` | 3-step progress bar (Upload → Review → Export) |

## Export Pipeline
`useBulkExport` hook (in `src/hooks/`) manages the async export:
1. Iterates all image×preset combinations
2. Calls `exportImage()` for each → data URL
3. Packages all into ZIP via JSZip
4. Filenames: `{baseName}_{presetSlug}_{WxH}.{ext}` (via `generateFilename()`)
5. ZIP filename: `bulk-export-{YYYY-MM-DD}.zip`

Phases: `idle` → `rendering` → `zipping` → `done` | `error`. Supports abort.

## Dependencies
- `src/hooks/useBulkExport.js`, `src/hooks/usePresets.js`
- `src/utils/exportImage.js`, `src/utils/calculateTransforms.js`, `src/utils/generateFilename.js`
- `src/utils/resolvePresetDimensions.js`
- `jszip` (npm package)
