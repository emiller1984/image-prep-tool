# Architecture Decision Log

Lightweight record of key design decisions. Add new entries at the bottom.

---

### ADR-001: Client-Side Only Image Processing
**Decision:** All image processing uses the browser Canvas API. No server-side image manipulation.
**Context:** Tool is for internal use by non-designers. Avoids backend infrastructure costs, deployment complexity, and upload latency. Images stay on the user's machine.
**Trade-off:** Limited to Canvas API capabilities; no advanced filters or AI-based processing.

### ADR-002: Hash Router for SPA Routing
**Decision:** Use `HashRouter` (react-router-dom) instead of `BrowserRouter`.
**Context:** App is deployed to a subdirectory on a shared PHP host (evanart.com/image-prep-tool/). Hash routing avoids server-side URL rewrite configuration. Routes: `/`, `/admin`, `/bulk`.

### ADR-003: Stepped Downsampling for Image Quality
**Decision:** Pre-scale images in repeated 50% steps before final Canvas draw (`src/utils/downsample.js`).
**Context:** Direct Canvas downscaling uses bilinear interpolation which produces jagged artifacts on large reductions. Stepping mimics Photoshop's bicubic approach. Applied in both editor preview and export.

### ADR-004: 90-Degree Rotation Increments Only
**Decision:** Rotation restricted to -180°, -90°, 0°, 90°, 180°. No free-form rotation.
**Context:** Email images don't need arbitrary rotation. Simplifies transform math, avoids anti-aliasing edge artifacts, and keeps the UI simple for non-designers.

### ADR-005: URL-Driven Step State
**Decision:** Single-image workflow step is stored in URL search params (`?step=1|2|3`).
**Context:** Enables browser back/forward navigation between steps. MainApp.jsx validates prerequisites and auto-corrects the URL if a step's requirements aren't met.

### ADR-006: useReducer for Bulk State Management
**Decision:** BulkApp.jsx uses `useReducer` instead of multiple `useState` calls.
**Context:** Bulk mode manages a matrix of images × presets with complex interdependent state updates (add/remove images, toggle presets, initialize/update transforms). A reducer centralizes the logic and makes state transitions explicit.

### ADR-007: Fill Scale Default for Bulk, Fit Scale for Single
**Decision:** Bulk mode initializes transforms at `fillScale` (fills frame, may crop). Single mode uses `fitScale` (fits within frame, may show whitespace).
**Context:** Bulk processes many images automatically — fill scale produces better default results without manual adjustment. Single mode gives the user a clear starting point to see the full image and adjust.

### ADR-008: JSZip for Client-Side ZIP Bundling
**Decision:** Bulk export packages all rendered images into a single ZIP using JSZip (client-side).
**Context:** Avoids server roundtrip for bundling. ZIP is generated in-browser from data URLs. Supports abort and progress tracking.

### ADR-009: PHP Backend Only for Preset Persistence
**Decision:** Minimal PHP endpoint (`public/api/presets.php`) reads/writes `presets.json`. No other backend.
**Context:** Presets need to persist across sessions and be shared among users. A single PHP file was the simplest option given the existing shared hosting. Default presets in `src/config/presets.js` serve as fallback if the API is unavailable.

### ADR-010: Pointer Events Over Mouse Events
**Decision:** All interactive Canvas interactions use pointer events (pointerdown, pointermove, pointerup).
**Context:** Pointer events provide unified handling for mouse, touch, and pen input. Important for content managers who may use tablets or touchscreens.

### ADR-011: Configurable Export Format Per Preset
**Decision:** Each preset specifies its own `fileType` (jpeg/png/webp) and `compression` (0-1).
**Context:** Different email templates have different requirements — logos need PNG transparency, photos need JPEG compression, modern clients can use WebP. Default fallback: JPEG at 92%.

### ADR-012: No Test Framework
**Decision:** No automated testing setup. Testing follows manual priorities documented in CLAUDE.md.
**Context:** Small internal tool with a single developer. The visual/canvas nature of the app makes automated testing complex. Manual testing priorities focus on dimension accuracy, format handling, and transform consistency.
