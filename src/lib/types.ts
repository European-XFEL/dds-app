import * as schema from '$lib/server/db/schema';

export type SampleDetails = {
	groundMolecule: typeof schema.moleculeTable.$inferSelect;
	excitedMolecule: typeof schema.moleculeTable.$inferSelect;
	solvent: typeof schema.solventTable.$inferSelect;
	concentration: number;
};

export type PPDetails = {
	laserEnergy?: number;
	excitedFrac?: number;
	excitedPotential?: number;
};

export type QVals = {
	min?: number;
	max?: number;
	step?: number;
};

export type Detector = {
	name?: string;
};

export type SimulationDetails = {
	sample: SampleDetails;
	qVals: QVals;
	detector: Detector;
};
