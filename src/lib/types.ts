import type * as protoFiles from '$lib/server/grpc/gen/files_pb';
import type * as protoSim from '$lib/server/grpc/gen/simulation_pb';

export * from './detector/types';
export * from './probe/types';
export * from './pump/types';
export * from './sample/types';
export * from './simulation/types';

export type RealismFlags = {
  applyGeometryMask: boolean;
  applyBadPixelMask: boolean;
  applyNoise: boolean;
  solidAngleCorrection: boolean;
  polarizationCorrection: boolean;
  detectorEfficiencyCorrection: boolean;
  backgroundSubtraction: boolean;
};

export type FileNoContent = Omit<protoFiles.File, 'contents' | '$typeName'>;

export type StructureFile = Omit<FileNoContent, 'type'>;

export type SolventFile = Omit<FileNoContent, 'type'>;

export type QRange = Omit<protoSim.QRange, '$typeName'>;
