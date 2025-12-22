/**
 * Coordinate transformation utilities for crystallography detector visualization.
 *
 * These functions handle the conversion between:
 * - Detector (x, y) coordinates
 * - Polar (r, φ) coordinates where r is distance from beam center and φ is azimuthal angle
 * - "Caked" (r, χ) coordinates for the transformed view
 */
import type { CartesianPoint, DetectorModule, Shape } from '$lib/types';

const DEG_PER_RAD = 180 / Math.PI;
const TAU = Math.PI * 2;
const EPSILON = Number.EPSILON;

type RangeTuple = readonly [number, number];

interface PolarPoint {
  readonly r: number;
  readonly phi: number;
  readonly twoTheta: number;
}

interface TessellatedQuad {
  readonly corners: readonly PolarPoint[];
}

export interface TessellatedModule {
  readonly id: string;
  readonly quads: readonly TessellatedQuad[];
  readonly color: string;
}

function rangeSpan([min, max]: RangeTuple): number {
  return Math.max(max - min, EPSILON);
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
export function detectorToPolar(
  point: CartesianPoint,
  center: CartesianPoint,
  detectorDistance: number,
): PolarPoint {
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
  center: CartesianPoint,
  detectorDistance: number,
  gridSize = 8,
): TessellatedQuad[] {
  const quads: TessellatedQuad[] = [];
  const {
    position: { x, y },
    shape: { width, height },
  } = module;

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
  center: CartesianPoint,
  detectorDistance: number,
  gridSize = 8,
): TessellatedModule {
  return {
    id: module.id,
    quads: tessellateModule(module, center, detectorDistance, gridSize),
    color: module.color ?? 'var(--color-slate-500)',
  };
}

/**
 * Check if a quad's chi values span across the ±π boundary.
 */
function quadWrapsChiBoundary(corners: readonly PolarPoint[]): boolean {
  const phis = corners.map((c) => c.phi);
  const maxPhi = Math.max(...phis);
  const minPhi = Math.min(...phis);
  return maxPhi - minPhi > Math.PI;
}

/**
 * Convert a quad's corners to an SVG path string.
 */
function quadToSvgPath(
  corners: readonly PolarPoint[],
  viewShape: Shape,
  twoThetaRange: RangeTuple,
  chiRange: RangeTuple,
): string {
  const [twoThetaMin] = twoThetaRange;
  const [chiMin] = chiRange;
  const thetaSpan = rangeSpan(twoThetaRange);
  const chiSpan = rangeSpan(chiRange);

  const svgPoints = corners.map((c) => {
    const x = ((c.twoTheta - twoThetaMin) / thetaSpan) * viewShape.width;
    const y = ((c.phi - chiMin) / chiSpan) * viewShape.height;
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
  module: TessellatedModule,
  viewShape: Shape,
  twoThetaRange: RangeTuple = [0, 180],
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
        paths.push(quadToSvgPath(cornersShiftedUp, viewShape, twoThetaRange, chiRange));

        const cornersShiftedDown = quad.corners.map((c) => ({
          ...c,
          phi: c.phi > 0 ? c.phi - TAU : c.phi,
        }));
        paths.push(quadToSvgPath(cornersShiftedDown, viewShape, twoThetaRange, chiRange));
      }
    } else {
      paths.push(quadToSvgPath(quad.corners, viewShape, twoThetaRange, chiRange));
    }
  }

  return paths;
}

/**
 * Generate grid lines for the caked view.
 */
export function generateCakedGridLines(
  viewShape: Shape,
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
      const x = ((theta - twoThetaMin) / thetaSpan) * viewShape.width;
      twoThetaLines.push(x);
    }
  }

  const chiStepRad = (chiStepDegrees * Math.PI) / 180;
  const chiLines: number[] = [];
  const chiSpan = rangeSpan(chiRange);
  for (let chi = Math.ceil(chiMin / chiStepRad) * chiStepRad; chi <= chiMax; chi += chiStepRad) {
    const y = ((chi - chiMin) / chiSpan) * viewShape.height;
    chiLines.push(y);
  }

  return { twoThetaLines, chiLines };
}

const tailwind_gradient_tokens = [
  '--color-red-500',
  '--color-amber-500',
  '--color-lime-500',
  '--color-emerald-500',
  '--color-sky-500',
  '--color-indigo-500',
  '--color-fuchsia-500',
  '--color-rose-600',
] as const;

export function resolveModuleColour(index: number, explicit?: string): string {
  if (explicit) return explicit;
  const token = tailwind_gradient_tokens[index % tailwind_gradient_tokens.length];
  return `var(${token})`;
}
