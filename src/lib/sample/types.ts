import type * as protoSim from '$lib/server/grpc/gen/simulation_pb';

import type { SolventFile, StructureFile } from '../files/types';

export type Sample = Omit<
  protoSim.SimulationRequest_Sample,
  '$typeName' | 'ground' | 'excited' | 'solvent'
> & {
  ground: StructureFile;
  excited: StructureFile;
  solvent: SolventFile;
};
