import { all, create } from 'mathjs';

import type { BeamCenter, DetectorModule, PixelSize, QParams } from '$lib/types';

const math = create(all, {});

/**
 * Compute q-range and a reasonable q-step from detector geometry by using
 * min/max radii (in pixels) from beam centre to the union of module pixels.
 *
 * Geometry assumption: flat detector perpendicular to the beam;
 * tan(2θ) = r / D, θ = 0.5 * atan(r/D), q = (4π/λ) * sin(θ)
 */
export function computeQRangeFromModules(params: {
  distance: number;
  pixelSize: PixelSize;
  beamCenter: BeamCenter;
  wavelength: number;
  modules: DetectorModule[];
}): QParams & { rMinPx: number; rMaxPx: number } {
  const { distance: Dmm, pixelSize, beamCenter: bc, wavelength: lambdaA, modules } = params;

  if (!(Dmm > 0)) throw new Error('sampleDetectorDistanceMm must be > 0');
  if (!(pixelSize > 0)) throw new Error('pixelSizeMm must be > 0');
  if (!(lambdaA > 0)) throw new Error('wavelengthAngstrom must be > 0');
  if (!modules?.length) throw new Error('modules must be a non-empty list');

  const qFromRadiusPx = (rPx: number): number => {
    const rMm = rPx * pixelSize;
    const twoTheta = math.atan(rMm / Dmm) as number; // radians
    const theta = 0.5 * twoTheta;
    const q = ((4 * math.pi) / lambdaA) * (math.sin(theta) as number);
    return q as number;
  };

  // Distance from point (cx,cy) to axis-aligned rectangle [x0,x1]×[y0,y1]
  // where x1 = x0 + width, y1 = y0 + height (pixel coordinates).
  const distancePointToRectPx = (
    cx: number,
    cy: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
  ): number => {
    const dx = math.max(x0 - cx, 0, cx - x1) as number;
    const dy = math.max(y0 - cy, 0, cy - y1) as number;
    return math.sqrt(dx * dx + dy * dy) as number;
  };

  const distancePointToPointPx = (cx: number, cy: number, x: number, y: number): number => {
    const dx = x - cx;
    const dy = y - cy;
    return math.sqrt(dx * dx + dy * dy) as number;
  };

  let rMinPx = Number.POSITIVE_INFINITY;
  let rMaxPx = 0;

  for (const m of modules) {
    if (!(m.width > 0) || !(m.height > 0)) {
      throw new Error(`Invalid module size: width/height must be > 0 (got ${m.width}×${m.height})`);
    }

    const x0 = m.x;
    const y0 = m.y;
    const x1 = m.x + m.width;
    const y1 = m.y + m.height;

    // Minimum radius to any pixel in the module region (0 if beam centre lies inside)
    const rMinThis = distancePointToRectPx(bc.x, bc.y, x0, y0, x1, y1);
    rMinPx = Math.min(rMinPx, rMinThis);

    // Maximum radius occurs at one of the rectangle corners
    const corners: Array<[number, number]> = [
      [x0, y0],
      [x1, y0],
      [x0, y1],
      [x1, y1],
    ];
    for (const [cx, cy] of corners) {
      const r = distancePointToPointPx(bc.x, bc.y, cx, cy);
      if (r > rMaxPx) rMaxPx = r;
    }
  }

  if (!Number.isFinite(rMinPx)) rMinPx = 0;

  const min = qFromRadiusPx(rMinPx);
  const max = qFromRadiusPx(rMaxPx);

  // Suggested q step: q increment corresponding to ~1 pixel at the largest radius
  // (conservative: smallest dq tends to be at larger radii for this geometry).
  const rForStep = Math.max(0, rMaxPx);
  const qAtR = qFromRadiusPx(rForStep);
  const qAtRminus1 = qFromRadiusPx(Math.max(0, rForStep - 1));
  let step = qAtR - qAtRminus1;

  // Fallbacks / sanity
  if (!(step > 0) || !Number.isFinite(step)) {
    // If rMaxPx < 1 or something degenerate, pick a small fraction of range
    step = (max - min) / 1000;
  }
  if (!(step > 0)) step = 1e-4;

  return { min, max, step, rMinPx, rMaxPx };
}
