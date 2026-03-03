# src/components/admin/

CRUD interface for managing image size presets. Accessed via `/#/admin`.

## Components
| File | Role |
|------|------|
| `AdminPage.jsx` | Page container. Fetches presets on mount (fallback to defaults). Tracks `hasChanges` flag. Publish button calls `publishPresets()` API. |
| `PresetForm.jsx` | Add/edit form. Fields: name, width, height, sizeMode (fixed/widthOnly), description, fileType (JPEG/PNG/WebP), compression. Validates inputs. |
| `PresetList.jsx` | Sortable list of presets with edit/delete actions. |

## Data Flow
```
AdminPage (presets state, hasChanges flag)
  ├── PresetForm → onSave(preset) / onCancel()
  └── PresetList → onEdit(preset) / onDelete(id)
  └── Publish button → publishPresets(presets) via presetService.js
```

## Preset Schema
```js
{ id, name, width, height?, sizeMode: 'fixed'|'widthOnly', description, fileType: 'jpeg'|'png'|'webp', compression: 0-1 }
```
`height` is optional when `sizeMode === 'widthOnly'`.

## Dependencies
- `src/services/presetService.js` — `fetchPresets()`, `publishPresets()`
- `src/config/presets.js` — default fallback presets
