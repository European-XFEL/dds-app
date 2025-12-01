import type * as protoSim from '$lib/server/grpc/gen/simulation_pb';

export type Pump = Omit<protoSim.SimulationRequest_Pump, '$typeName'>;
