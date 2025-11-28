import * as schema from '$lib/server/db/schema';

export type Molecule = Omit<typeof schema.moleculeTable.$inferSelect, 'content'>;

export type Solvent = Omit<typeof schema.solventTable.$inferSelect, 'content'>;

export type SampleDetails = {
  ground: Molecule;
  excited: Molecule;
  solvent: Solvent;
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
  quadrant_positions: [number, number][];
};

export type RefinementFlags = {
  apply_geometry_mask: boolean;
  apply_bad_pixel_mask: boolean;
  apply_noise: boolean;
  solid_angle_correction: boolean;
  polarization_correction: boolean;
  detector_efficiency_correction: boolean;
  background_subtraction: boolean;
};

export type SimulationDetails = {
  sample: SampleDetails;
  q_vals: QVals;
  detector: Detector;
  pump: Pump;
  refinement_flags?: RefinementFlags;
};
