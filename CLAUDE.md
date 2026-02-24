# Email Image Resizer

## Project Context
Internal tool for content managers to resize images for marketing email templates.
All image processing is client-side using the Canvas API — no backend.

## Tech Stack
- React 18+ with Vite
- Tailwind CSS for styling
- No external image processing libraries — use native Canvas API

## Key Design Decisions
- Presets are defined in src/config/presets.js — this is the single source of truth
- All canvas rendering uses a consistent transform order: translate → rotate → flip → draw
- Export is always JPEG at 82% quality with white (#FFFFFF) background
- The editor preview scales the canvas to fit the viewport; the export renders at full target resolution

## Code Conventions
- Functional components with hooks only
- Custom hooks in src/hooks/ for reusable logic
- Utility functions in src/utils/ (pure functions, no React dependencies)
- Use pointer events (not mouse events) for cross-device compatibility

## Testing Priorities
- Verify exported image dimensions exactly match the selected preset
- Test with various input formats: JPG, PNG (with transparency), WebP, SVG, GIF
- Test with extreme aspect ratios (very wide, very tall, square)
- Test rotation + fill calculation (90° and 270° swap effective dimensions)
- Verify white background with no transparency in exported JPGs
