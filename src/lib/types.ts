import * as schema from '$lib/server/db/schema';

export type SampleDetails = {
	ground: typeof schema.moleculeTable.$inferSelect;
	excited: typeof schema.moleculeTable.$inferSelect;
	solvent: typeof schema.solventTable.$inferSelect;
	concentration: number;
};

export type Pump = {
	energy: number;
	excitedFrac: number;
	excitedPotential: number;
};

export type QVals = {
	min: number;
	max: number;
	step: number;
};

export type Detector = {
	name: string;
	pixel_size: number;
	distance: number;
	wavelength: number;
	shape: [number, number];
	beam_center: [number, number];
};

export type RefinementFlags = {
	apply_geometry_mask: boolean;
	apply_bad_pixel_mask: boolean;
	apply_noise: boolean;
};

export type SimulationDetails = {
	sample: SampleDetails;
	q_vals: QVals;
	detector: Detector;
	pump: Pump;
	refinement_flags?: RefinementFlags;
};
