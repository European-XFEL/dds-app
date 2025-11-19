export type SampleDetails = {
	/** Molecule identifier. */
	molecule_ground: string;
	molecule_excited: string;
	/** Solvent identifier. */
	solvent: string;
	/** Concentration percentage. */
	concentration: number;
};

export type ProbeDetails = {
	LaserEnergy: number;
	ExcitedFrac: number;
	ExcitedPotential: number;
};

export type QVals = {
	min: number;
	max: number;
	step: number;
};

export type Detector = {
	name: string;
};

export type SimulationDetails = {
	sample: SampleDetails;
	molecules: string[];
	solvents: string[];
	sample_ground: string;
	sample_excited: string;
	q_vals: QVals;
	detector: Detector;
};
