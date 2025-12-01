/**
 * Coordinate transformation utilities for crystallography detector visualization.
 *
 * These functions handle the conversion between:
 * - Detector (x, y) coordinates
 * - Polar (r, φ) coordinates where r is distance from beam center and φ is azimuthal angle
 * - "Caked" (r, χ) coordinates for the transformed view
 */

type RangeTuple = readonly [number, number];

const DEG_PER_RAD = 180 / Math.PI;
const TAU = Math.PI * 2;
const EPSILON = Number.EPSILON;

function rangeSpan([min, max]: RangeTuple): number {
  return Math.max(max - min, EPSILON);
}

export interface Point {
  x: number;
  y: number;
}

export interface PolarPoint {
  r: number; // Radial distance from center
  phi: number; // Azimuthal angle in radians (-π to π), also called Chi (χ)
  twoTheta: number; // Scattering angle 2θ in degrees
}

export interface DetectorModule {
  id: string;
  x: number; // Top-left corner x
  y: number; // Top-left corner y
  width: number;
  height: number;
  color?: string; // Optional; UI can auto-assign colors when omitted
}

export interface TessellatedQuad {
  corners: PolarPoint[]; // 4 corners in order: TL, TR, BR, BL
}

export interface TransformedModuleTessellated {
  id: string;
  quads: TessellatedQuad[];
  color: string;
}

/**
 * Convert a radial distance on the detector plane to the scattering angle 2θ (degrees).
 */
export function radiusToTwoTheta(radius: number, detectorDistance: number): number {
  if (detectorDistance === 0) {
    return 0;
  }

  return Math.atan(radius / detectorDistance) * DEG_PER_RAD;
}

/**
 * Convert detector (x, y) coordinates to polar coordinates relative to beam center.
 */
export function detectorToPolar(point: Point, center: Point, detectorDistance: number): PolarPoint {
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  const r = Math.sqrt(dx * dx + dy * dy);
  const phi = Math.atan2(dy, dx);
  const twoTheta = radiusToTwoTheta(r, detectorDistance);

  return { r, phi, twoTheta };
}

/**
 * Tessellate a module into a grid of small quadrilaterals.
 * This allows per-quad handling of chi boundary wrapping.
 */
export function tessellateModule(
  module: DetectorModule,
  center: Point,
  detectorDistance: number,
  gridSize = 8,
): TessellatedQuad[] {
  const quads: TessellatedQuad[] = [];
  const { x, y, width, height } = module;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x0 = x + (col / gridSize) * width;
      const x1 = x + ((col + 1) / gridSize) * width;
      const y0 = y + (row / gridSize) * height;
      const y1 = y + ((row + 1) / gridSize) * height;

      const corners: PolarPoint[] = [
        detectorToPolar({ x: x0, y: y0 }, center, detectorDistance),
        detectorToPolar({ x: x1, y: y0 }, center, detectorDistance),
        detectorToPolar({ x: x1, y: y1 }, center, detectorDistance),
        detectorToPolar({ x: x0, y: y1 }, center, detectorDistance),
      ];

      quads.push({ corners });
    }
  }

  return quads;
}

/**
 * Transform a detector module using tessellation.
 */
export function transformModuleTessellated(
  module: DetectorModule,
  center: Point,
  detectorDistance: number,
  gridSize = 8,
): TransformedModuleTessellated {
  return {
    id: module.id,
    quads: tessellateModule(module, center, detectorDistance, gridSize),
    color: module.color ?? 'var(--color-slate-500)',
  };
}

/**
 * Check if a quad's chi values span across the ±π boundary.
 */
function quadWrapsChiBoundary(corners: PolarPoint[]): boolean {
  const phis = corners.map((c) => c.phi);
  const maxPhi = Math.max(...phis);
  const minPhi = Math.min(...phis);
  return maxPhi - minPhi > Math.PI;
}

/**
 * Convert a quad's corners to an SVG path string.
 */
function quadToSvgPath(
  corners: PolarPoint[],
  viewWidth: number,
  viewHeight: number,
  twoThetaRange: RangeTuple,
  chiRange: RangeTuple,
): string {
  const [twoThetaMin] = twoThetaRange;
  const [chiMin] = chiRange;
  const thetaSpan = rangeSpan(twoThetaRange);
  const chiSpan = rangeSpan(chiRange);

  const svgPoints = corners.map((c) => {
    const x = ((c.twoTheta - twoThetaMin) / thetaSpan) * viewWidth;
    const y = ((c.phi - chiMin) / chiSpan) * viewHeight;
    return { x, y };
  });

  return (
    svgPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ') + ' Z'
  );
}

/**
 * Generate SVG paths for all quads in a tessellated module.
 * Quads that wrap around the chi boundary are rendered twice.
 */
export function tessellatedModuleToSvgPaths(
  module: TransformedModuleTessellated,
  viewWidth: number,
  viewHeight: number,
  twoThetaRange: RangeTuple = [0, 90],
  chiRange: RangeTuple = [-Math.PI, Math.PI],
): string[] {
  const paths: string[] = [];

  for (const quad of module.quads) {
    if (quadWrapsChiBoundary(quad.corners)) {
      const highCorners = quad.corners.filter((c) => c.phi > 0);
      const lowCorners = quad.corners.filter((c) => c.phi <= 0);

      if (highCorners.length > 0 && lowCorners.length > 0) {
        const cornersShiftedUp = quad.corners.map((c) => ({
          ...c,
          phi: c.phi < 0 ? c.phi + TAU : c.phi,
        }));
        paths.push(quadToSvgPath(cornersShiftedUp, viewWidth, viewHeight, twoThetaRange, chiRange));

        const cornersShiftedDown = quad.corners.map((c) => ({
          ...c,
          phi: c.phi > 0 ? c.phi - TAU : c.phi,
        }));
        paths.push(
          quadToSvgPath(cornersShiftedDown, viewWidth, viewHeight, twoThetaRange, chiRange),
        );
      }
    } else {
      paths.push(quadToSvgPath(quad.corners, viewWidth, viewHeight, twoThetaRange, chiRange));
    }
  }

  return paths;
}

/**
 * Generate grid lines for the caked view.
 */
export function generateCakedGridLines(
  viewWidth: number,
  viewHeight: number,
  twoThetaRange: RangeTuple = [0, 90],
  chiRange: RangeTuple = [-Math.PI, Math.PI],
  twoThetaStepDegrees = 5,
  chiStepDegrees = 45,
): { twoThetaLines: number[]; chiLines: number[] } {
  const [twoThetaMin, twoThetaMax] = twoThetaRange;
  const [chiMin, chiMax] = chiRange;

  const thetaSpan = rangeSpan(twoThetaRange);
  const twoThetaLines: number[] = [];
  if (twoThetaStepDegrees > 0) {
    const start = Math.ceil(twoThetaMin / twoThetaStepDegrees) * twoThetaStepDegrees;
    for (let theta = start; theta <= twoThetaMax + 1e-6; theta += twoThetaStepDegrees) {
      const x = ((theta - twoThetaMin) / thetaSpan) * viewWidth;
      twoThetaLines.push(x);
    }
  }

  const chiStepRad = (chiStepDegrees * Math.PI) / 180;
  const chiLines: number[] = [];
  const chiSpan = rangeSpan(chiRange);
  for (let chi = Math.ceil(chiMin / chiStepRad) * chiStepRad; chi <= chiMax; chi += chiStepRad) {
    const y = ((chi - chiMin) / chiSpan) * viewHeight;
    chiLines.push(y);
  }

  return { twoThetaLines, chiLines };
}

/**
 * Default detector modules arranged in a 2x2 grid with gaps.
 */
export function getDefaultModules(): DetectorModule[] {
  const moduleWidth = 120;
  const moduleHeight = 100;
  const gap = 20;
  const offsetX = 100;
  const offsetY = 80;

  return [
    {
      id: 'module-1',
      x: offsetX,
      y: offsetY,
      width: moduleWidth,
      height: moduleHeight,
    },
    {
      id: 'module-2',
      x: offsetX + moduleWidth + gap,
      y: offsetY,
      width: moduleWidth,
      height: moduleHeight,
    },
    {
      id: 'module-3',
      x: offsetX,
      y: offsetY + moduleHeight + gap,
      width: moduleWidth,
      height: moduleHeight,
    },
    {
      id: 'module-4',
      x: offsetX + moduleWidth + gap,
      y: offsetY + moduleHeight + gap,
      width: moduleWidth,
      height: moduleHeight,
    },
  ];
}
