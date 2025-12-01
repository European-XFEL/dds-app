import type * as protoSim from '$lib/server/grpc/gen/simulation_pb';

import type { Detector } from './detector.svelte';
import type { XRayProbe } from './probe';
import type { Pump } from './pump';
import type { QRange } from './q_range';
import type { RealismFlags } from './realism_flags';
import type { Sample } from './sample';

export type SimulationDetails = Omit<
  protoSim.SimulationRequest,
  '$typeName' | 'qRange' | 'pump' | 'sample'
> & {
  qRange: QRange;
  pump: Pump;
  probe: XRayProbe;
  sample: Sample;
  detector: Detector;
  realism_flags?: RealismFlags;
};
