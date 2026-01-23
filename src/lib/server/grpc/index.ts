import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-node';

import { FileService } from './gen/files_pb.ts';
import { SimulationService } from './gen/simulation_pb.ts';

// Export the types for internal use
export { SimulationService, FileService, createClient, createConnectTransport };
