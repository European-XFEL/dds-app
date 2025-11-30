import { createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';

import { FileService } from './gen/files_pb';
import { SimulationService } from './gen/simulation_pb';

// Export the types for internal use
export { SimulationService, FileService, createClient, createGrpcTransport };
