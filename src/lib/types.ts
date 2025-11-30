import * as protoFiles from '$lib/server/grpc/gen/files_pb';
import * as protoSim from '$lib/server/grpc/gen/simulation_pb';

export type QRange = Omit<protoSim.SimulationRequest_QRange, '$typeName'>;

export type Pump = Omit<protoSim.SimulationRequest_Pump, '$typeName'>;

export type FileNoContent = Omit<protoFiles.File, 'contents' | '$typeName'>;

export type StructureFile = Omit<FileNoContent, 'type'>;

export type SolventFile = Omit<FileNoContent, 'type'>;

export type Sample = Omit<
  protoSim.SimulationRequest_Sample,
  '$typeName' | 'ground' | 'excited' | 'solvent'
> & {
  ground: StructureFile;
  excited: StructureFile;
  solvent: SolventFile;
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

export type SimulationDetails = Omit<
  protoSim.SimulationRequest,
  '$typeName' | 'qRange' | 'pump' | 'sample'
> & {
  qRange: QRange;
  pump: Pump;
  sample: Sample;
  detector: Detector;
  refinement_flags?: RefinementFlags;
};
