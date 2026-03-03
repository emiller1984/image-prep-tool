# Image Prep Tool

## What This Is
Internal tool for non-designers to prep images for marketing emails without Photoshop.
Client-side Canvas API processing — no backend image ops. Secondary goal: eliminate human-error image issues.
**Live:** evanart.com/image-prep-tool | **Admin:** `/#/admin` | **Bulk:** `/#/bulk`

## Tech Stack
- React 18 + Vite 6 + Tailwind CSS 3.4 + react-router-dom 7 (HashRouter)
- Canvas API for all image processing (no external image libs)
- JSZip for bulk export bundling
- PHP backend only for preset CRUD (`public/api/presets.php` → `/api/data/presets.json`)
- Node 20 in CI | `npm run dev` | `npm run build` | `npm run preview`

## Architecture

### Routes (defined in `src/App.jsx` via HashRouter)
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `MainApp.jsx` | Single-image 3-step workflow: Select Size → Edit → Export |
| `/admin` | `admin/AdminPage.jsx` | Preset CRUD + publish to backend |
| `/bulk` | `bulk/BulkApp.jsx` | Batch process: multiple images × multiple presets → ZIP |

### File Structure
```
src/
├── App.jsx                        # HashRouter with 3 routes
├── main.jsx                       # React entry point
├── components/                    # See src/components/README.md
│   ├── MainApp.jsx                # Single-image workflow orchestrator
│   ├── Editor.jsx                 # Transform state + keyboard shortcuts
│   ├── EditorCanvas.jsx           # Canvas preview + pointer pan/zoom
│   ├── EditorControls.jsx         # Scale slider, rotation, flip, reset
│   ├── ExportResult.jsx           # Preview + download
│   ├── ImageUploader.jsx          # Drag-and-drop file picker
│   ├── PresetSelector.jsx         # Preset card grid
│   ├── StepIndicator.jsx          # 3-step progress bar
│   ├── admin/                     # See src/components/admin/README.md
│   │   ├── AdminPage.jsx, PresetForm.jsx, PresetList.jsx
│   └── bulk/                      # See src/components/bulk/README.md
│       ├── BulkApp.jsx            # Bulk workflow orchestrator (useReducer)
│       ├── BulkEditorModal.jsx, BulkExportStep.jsx, BulkReviewStep.jsx
│       ├── BulkStepIndicator.jsx, BulkUploadStep.jsx
│       ├── CombinationThumbnail.jsx, MultiImageUploader.jsx, PresetMultiSelector.jsx
├── hooks/                         # See src/hooks/README.md
│   ├── useImageLoader.js          # File → HTMLImageElement + metadata
│   ├── useCanvasRenderer.js       # Editor preview render function
│   ├── usePresets.js              # Fetch presets, fallback to defaults
│   └── useBulkExport.js           # Async bulk export → ZIP with progress/abort
├── services/
│   └── presetService.js           # fetchPresets(), publishPresets() → PHP API
├── utils/                         # See src/utils/README.md
│   ├── calculateTransforms.js     # calculateFitScale(), calculateFillScale()
│   ├── downsample.js              # Stepped 50% downsampling for quality
│   ├── exportImage.js             # exportImage() → data URL + format constants
│   ├── formatFileSize.js          # bytes → human-readable string
│   ├── generateFilename.js        # Bulk export filename generation + dedup
│   └── resolvePresetDimensions.js # Resolves widthOnly presets to concrete dims
├── config/
│   └── presets.js                 # Default preset definitions (fallback)
└── styles/
    └── index.css                  # Tailwind directives + custom range input styles
```

## Transform Data Model
All image positioning uses this object (shared by single + bulk modes):
```js
{ scale, rotation, offsetX, offsetY, flipH, flipV }
```
- `scale`: absolute factor relative to natural image size (not percentage)
- `rotation`: 90° increments only (-180, -90, 0, 90, 180)
- `offsetX/Y`: pan in target-resolution pixels
- UI shows scale as % relative to fit scale (100% = fits within frame)

## Canvas Pipeline — MUST STAY IN SYNC
`EditorCanvas.jsx` (preview) and `exportImage.js` (export) use identical transform order:
1. `translate(centerX + offsetX, centerY + offsetY)` → 2. `rotate()` → 3. `scale(flip)` → 4. `drawImage()` centered
- Preview applies `displayScale` to fit on screen; export renders at exact target pixels
- Both use `downsample.js` for stepped 50% pre-scaling (Photoshop-like quality)

## Key Design Decisions
See `docs/decisions.md` for full rationale. Summary:
- **Presets**: managed via admin UI, persisted to PHP backend, fallback to `src/config/presets.js`
- **Sizing modes**: `fixed` (crop to frame) or `widthOnly` (height from image aspect ratio, resolved in MainApp.jsx)
- **Export format**: configurable per preset (JPEG/PNG/WebP). Default: JPEG 92% + white background
- **Bulk state**: `useReducer` in BulkApp.jsx; transform keys: `${imageId}::${presetId}`
- **Bulk default**: `fillScale` (fills frame); single default: `fitScale` (fits within frame)
- **Step state**: URL search params (`?step=1|2|3`) — enables browser back/forward

## Code Conventions
- Functional components + hooks only — no class components
- Hooks in `src/hooks/`, utils in `src/utils/` — utils are pure functions, no React
- Pointer events (not mouse) for cross-device compatibility
- Tailwind for all styling — no inline styles except dynamic canvas dimensions
- Preset schema: `{ id, name, width, height?, sizeMode, description, fileType, compression }`

## Deployment
- Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) → `npm ci && npm run build` → FTP deploy
- **Secrets:** `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
- **Base path:** `/image-prep-tool/` (set in `vite.config.js`)
- **Live URL:** evanart.com/image-prep-tool

## Directory READMEs
For detailed component APIs and patterns, see per-directory docs:
- `src/components/README.md` — component roles and data flow
- `src/components/admin/README.md` — preset management UI
- `src/components/bulk/README.md` — bulk processing architecture
- `src/hooks/README.md` — hook return signatures and usage
- `src/utils/README.md` — utility exports and descriptions

## Testing Priorities
- Exported dimensions must exactly match preset (both fixed and widthOnly modes)
- Test formats: JPG, PNG (transparency), WebP, SVG, GIF
- Test extreme aspect ratios + rotation at 90°/270° (swaps effective dimensions)
- White background in JPEG exports, no transparency leaks
- Pan/zoom/flip must match between editor preview and export
- Bulk: verify ZIP contents, filenames, individual image quality
- Admin: preset add/edit/delete/publish round-trip

## Common Tasks
- **Add preset:** Admin page (`/#/admin`) → Add → Publish. Fallback: edit `src/config/presets.js`
- **Change export format/quality:** Edit preset via admin. Default fallback in `src/utils/exportImage.js`
- **Change transform pipeline:** Update BOTH `EditorCanvas.jsx` AND `exportImage.js` — must stay in sync

## Session Handoff
**Last updated:** 2026-03-02
**Current state:** Documentation audit — creating per-directory READMEs and decisions log.
**No active bugs or in-progress features.** Codebase is stable on `main`.
**Recent work:** Bulk image processing feature (PR #8), admin preset management, widthOnly sizing mode.
