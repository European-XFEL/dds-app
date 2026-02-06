import type * as protoFiles from './server/grpc/gen/files_pb.ts';
import type * as protoSim from './server/grpc/gen/simulation_pb.ts';

export * from './detector/types.ts';
export * from './molecule/types.ts';
export * from './probe/types.ts';
export * from './pump/types.ts';
export * from './sample/types.ts';
export * from './simulation/types.ts';

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
