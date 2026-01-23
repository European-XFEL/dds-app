import type { DetectorState } from '$lib/detector/state.svelte';
import type { SampleState } from '$lib/sample/state.svelte';
import type * as protoSim from '$lib/server/grpc/gen/simulation_pb';
import type { Pump, QRange, RealismFlags, XRayProbe } from '$lib/types';

export type SimulationDetails =
  & Omit<
    protoSim.SimulationRequest,
    '$typeName' | 'qRange' | 'pump' | 'sample'
  >
  & {
    qRange: QRange;
    pump: Pump;
    probe: XRayProbe;
    sample: SampleState;
    detector: DetectorState;
    realismFlags?: RealismFlags;
  };
