export type Shape = [ny: number, nx: number];
export type PixelSize = number;
export type BeamCenter = [cy: number, cx: number];

export interface QParams {
	min: number;
	max: number;
	step: number;
}

/**
 * Compute approximate q_min, q_max, q_step from detector geometry.
 *
 * All length-like quantities (pixel size, distance, wavelength) must be
 * in the same units (e.g. metres). q will then be in 1 / that unit.
 */
export function detectorQParams(
	shape: Shape,
	pixelSize: PixelSize,
	distance: number,
	wavelength: number,
	beamCenter?: BeamCenter
): QParams {
	const [ny, nx] = shape;

	// Beam centre (row, col)
	let cy: number;
	let cx: number;
	if (beamCenter == null) {
		cy = (ny - 1) / 2.0;
		cx = (nx - 1) / 2.0;
	} else {
		[cy, cx] = beamCenter;
	}

	const qFromR = (r: number): number => {
		const twoTheta = Math.atan2(r, distance);
		const theta = 0.5 * twoTheta;
		return ((4.0 * Math.PI) / wavelength) * Math.sin(theta);
	};

	// --- q_min: nearest pixel to beam centre ---
	let i0 = Math.round(cy);
	let j0 = Math.round(cx);

	// clamp to detector bounds
	i0 = Math.min(Math.max(i0, 0), ny - 1);
	j0 = Math.min(Math.max(j0, 0), nx - 1);

	const dyMin = (i0 - cy) * pixelSize;
	const dxMin = (j0 - cx) * pixelSize;
	const rMin = Math.sqrt(dxMin * dxMin + dyMin * dyMin);
	const qMin = qFromR(rMin);

	// --- q_max: farthest corner from beam centre ---
	const corners: Array<[number, number]> = [
		[0, 0],
		[0, nx - 1],
		[ny - 1, 0],
		[ny - 1, nx - 1]
	];

	let rMax = 0.0;
	for (const [iy, ix] of corners) {
		const dy = (iy - cy) * pixelSize;
		const dx = (ix - cx) * pixelSize;
		const r = Math.sqrt(dx * dx + dy * dy);
		if (r > rMax) rMax = r;
	}

	const qMax = qFromR(rMax);

	// --- q_step: q-change for one pixel radially (use smaller pixel size) ---
	const dr = pixelSize;
	const qStep = qFromR(rMin + dr) - qMin;

	return { min: qMin, max: qMax, step: qStep };
}
