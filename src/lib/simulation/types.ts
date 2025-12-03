import type { Detector } from '../detector/types';
import type { XRayProbe } from '../probe/types';
import type { Pump } from '../pump/types';
import type { QRange } from '../q-range/types';
import type { RealismFlags } from '../realism/types';
import type { Sample } from '../sample/types';

import type * as protoSim from '$lib/server/grpc/gen/simulation_pb';

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
