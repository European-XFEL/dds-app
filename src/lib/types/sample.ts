export type SampleChangeDetail = {
	concentration: number;
	isNameValid: boolean;
	molecule: string;
	rawSampleName: string;
	sampleId: string;
	sampleName: string;
	solvent: string;
};

export type SampleUploadDetail = {
	sampleId: string;
};
