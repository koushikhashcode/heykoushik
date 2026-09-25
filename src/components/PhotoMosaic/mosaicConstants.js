/* =========================================================================
   PHOTO MOSAIC CONSTANTS
   ========================================================================= */
export const MOSAIC_CONFIG = {
  columns: 4,
  rows: 6,
  totalTiles: 24,
  
  hoverLiftFirstY: -3,
  hoverLiftPeakY: -8,
  hoverSettleY: -5,
  hoverScale: 1.05,
  hoverRotateOffset: 1.0,
  hoverZIndex: 50,
  
  baseShadow: 'drop-shadow(1px 4px 8px rgba(0,0,0,0.85))',
  hoverShadow: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.98))',
  
  facePaperBendScale: 6,
  faceDisplacementBaseFreq: 0.014,
  faceTiltMaxDeg: 5.0,
  faceTiltDuration: 0.35,
};

/* =========================================================================
   24 HAND-TUNED TILE PRESETS (Col 0..3, Row 0..5)
   ========================================================================= */
export const TILE_PRESETS = [
  // Row 0: Top Hair & Background Tiles (No face)
  { id: 0,  row: 0, col: 0, rotate: -1.8, dx: -1, dy: -1, zIndex: 2, extraHoverRotate: -1.2, containsFace: false },
  { id: 1,  row: 0, col: 1, rotate:  1.2, dx:  1, dy: -2, zIndex: 1, extraHoverRotate:  1.4, containsFace: false },
  { id: 2,  row: 0, col: 2, rotate: -0.9, dx: -1, dy: -1, zIndex: 3, extraHoverRotate: -1.0, containsFace: false },
  { id: 3,  row: 0, col: 3, rotate:  2.1, dx:  2, dy: -1, zIndex: 1, extraHoverRotate:  1.5, containsFace: false },

  // Row 1: Upper Forehead & Hairline (Face)
  { id: 4,  row: 1, col: 0, rotate:  1.5, dx:  1, dy:  1, zIndex: 1, extraHoverRotate:  1.2, containsFace: true },
  { id: 5,  row: 1, col: 1, rotate: -2.1, dx: -1, dy:  1, zIndex: 4, extraHoverRotate: -1.6, containsFace: true },
  { id: 6,  row: 1, col: 2, rotate:  1.0, dx:  1, dy: -1, zIndex: 2, extraHoverRotate:  1.1, containsFace: true },
  { id: 7,  row: 1, col: 3, rotate: -1.6, dx: -1, dy:  1, zIndex: 1, extraHoverRotate: -1.3, containsFace: true },

  // Row 2: Eyes, Brows & Temples (Face)
  { id: 8,  row: 2, col: 0, rotate: -2.4, dx: -2, dy:  0, zIndex: 3, extraHoverRotate: -1.7, containsFace: true },
  { id: 9,  row: 2, col: 1, rotate:  0.8, dx:  1, dy:  1, zIndex: 1, extraHoverRotate:  1.0, containsFace: true },
  { id: 10, row: 2, col: 2, rotate: -1.4, dx: -1, dy: -1, zIndex: 2, extraHoverRotate: -1.2, containsFace: true },
  { id: 11, row: 2, col: 3, rotate:  2.2, dx:  1, dy:  1, zIndex: 3, extraHoverRotate:  1.6, containsFace: true },

  // Row 3: Cheeks, Nose & Mustache (Face)
  { id: 12, row: 3, col: 0, rotate:  1.9, dx:  1, dy: -1, zIndex: 1, extraHoverRotate:  1.4, containsFace: true },
  { id: 13, row: 3, col: 1, rotate: -1.1, dx: -1, dy:  1, zIndex: 2, extraHoverRotate: -1.1, containsFace: true },
  { id: 14, row: 3, col: 2, rotate:  2.4, dx:  2, dy: -1, zIndex: 4, extraHoverRotate:  1.7, containsFace: true },
  { id: 15, row: 3, col: 3, rotate: -1.7, dx: -1, dy:  1, zIndex: 2, extraHoverRotate: -1.3, containsFace: true },

  // Row 4: Mustache, Mouth, Chin & Jaw (Face)
  { id: 16, row: 4, col: 0, rotate: -1.3, dx: -1, dy:  1, zIndex: 2, extraHoverRotate: -1.1, containsFace: true },
  { id: 17, row: 4, col: 1, rotate:  1.7, dx:  1, dy: -1, zIndex: 3, extraHoverRotate:  1.5, containsFace: true },
  { id: 18, row: 4, col: 2, rotate: -2.3, dx: -2, dy:  1, zIndex: 1, extraHoverRotate: -1.6, containsFace: true },
  { id: 19, row: 4, col: 3, rotate:  1.1, dx:  1, dy: -1, zIndex: 2, extraHoverRotate:  1.2, containsFace: true },

  // Row 5: Neck, Shoulders & T-shirt (No face)
  { id: 20, row: 5, col: 0, rotate:  2.3, dx:  2, dy:  1, zIndex: 1, extraHoverRotate:  1.6, containsFace: false },
  { id: 21, row: 5, col: 1, rotate: -1.5, dx: -1, dy: -1, zIndex: 2, extraHoverRotate: -1.3, containsFace: false },
  { id: 22, row: 5, col: 2, rotate:  1.4, dx:  1, dy:  1, zIndex: 3, extraHoverRotate:  1.2, containsFace: false },
  { id: 23, row: 5, col: 3, rotate: -2.0, dx: -1, dy:  1, zIndex: 1, extraHoverRotate: -1.5, containsFace: false },
];
