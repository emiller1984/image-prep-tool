/**
 * Email template definitions for Visual Mode.
 * Each template defines the layout sections and image slots
 * that content managers need to fill.
 *
 * Dimensions: renderWidth/renderHeight are the visual size in the template preview.
 * exportWidth/exportHeight are 2x for retina email rendering.
 */

export const dedicatedTemplate = {
  id: 'dedicated',
  name: 'Dedicated',
  slots: [
    { id: 'hero-placement', label: 'Hero Placement', renderWidth: 580, renderHeight: 340, exportWidth: 1160, exportHeight: 680 },
    { id: 'dedicated-hero', label: 'Dedicated Hero', renderWidth: 225, renderHeight: 225, exportWidth: 450, exportHeight: 450 },
    { id: 'secondary-hero', label: 'Secondary Hero', renderWidth: 580, renderHeight: 340, exportWidth: 1160, exportHeight: 680 },
    { id: 'duo-1', label: 'Duo Placement 1', renderWidth: 250, renderHeight: 250, exportWidth: 500, exportHeight: 500 },
    { id: 'duo-2', label: 'Duo Placement 2', renderWidth: 250, renderHeight: 250, exportWidth: 500, exportHeight: 500 },
    { id: 'trio-1', label: 'Trio Placement 1', renderWidth: 153, renderHeight: 153, exportWidth: 306, exportHeight: 306 },
    { id: 'trio-2', label: 'Trio Placement 2', renderWidth: 153, renderHeight: 153, exportWidth: 306, exportHeight: 306 },
    { id: 'trio-3', label: 'Trio Placement 3', renderWidth: 153, renderHeight: 153, exportWidth: 306, exportHeight: 306 },
    { id: 'merchant-1', label: 'Merchant Card 1', renderWidth: 125, renderHeight: 125, exportWidth: 250, exportHeight: 250 },
    { id: 'merchant-2', label: 'Merchant Card 2', renderWidth: 125, renderHeight: 125, exportWidth: 250, exportHeight: 250 },
    { id: 'merchant-3', label: 'Merchant Card 3', renderWidth: 125, renderHeight: 125, exportWidth: 250, exportHeight: 250 },
    { id: 'side-by-side-1', label: 'Side-by-Side 1', renderWidth: 225, renderHeight: 225, exportWidth: 450, exportHeight: 450 },
    { id: 'side-by-side-2', label: 'Side-by-Side 2', renderWidth: 225, renderHeight: 225, exportWidth: 450, exportHeight: 450 },
    { id: 'stacked-placement', label: 'Stacked Placement', renderWidth: 330, renderHeight: 200, exportWidth: 660, exportHeight: 400 },
  ],
}
