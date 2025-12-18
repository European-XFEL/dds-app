import type * as protoSim from '$lib/server/grpc/gen/simulation_pb';
import type { Detector, Pump, QRange, RealismFlags, Sample, XRayProbe } from '$lib/types';

export type SimulationDetails = Omit<
  protoSim.SimulationRequest,
  '$typeName' | 'qRange' | 'pump' | 'sample'
> & {
  qRange: QRange;
  pump: Pump;
  probe: XRayProbe;
  sample: Sample;
  detector: Detector;
  realismFlags?: RealismFlags;
};
