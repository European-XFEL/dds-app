import { create } from '@bufbuild/protobuf';
import { ConnectError } from '@connectrpc/connect';

import type { Actions } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

import { db } from '$lib/server/db';
import { SimulationService, createClient, createGrpcTransport } from '$lib/server/grpc';
import * as protoFiles from '$lib/server/grpc/gen/files_pb';
import * as protoSim from '$lib/server/grpc/gen/simulation_pb';

const BACKEND_URL = env.BACKEND_URL ?? 'http://localhost:50051';

export const actions: Actions = {
  run_simulation: async ({ request, fetch }) => {
    const transport = createGrpcTransport({
      baseUrl: `${BACKEND_URL}`,
    });

    const simulation_client = createClient(SimulationService, transport);

    const formData = await request.formData();

    const state_json = formData.get('state');

    if (typeof state_json !== 'string') {
      console.log('No state provided');
      return { results: null };
    }

    const state = JSON.parse(state_json);

    const ground = await db.query.moleculeTable.findFirst({
      with: { fileTable: true },
      where: (table, { eq }) => eq(table.id, state.sample.ground.id),
    });

    const excited = await db.query.moleculeTable.findFirst({
      with: { fileTable: true },
      where: (table, { eq }) => eq(table.id, state.sample.excited.id),
    });

    const solvent = await db.query.solventTable.findFirst({
      with: { fileTable: true },
      where: (table, { eq }) => eq(table.id, state.sample.solvent.id),
    });

    if (!ground || !excited || !solvent) {
      console.log('Could not find all sample files in database');
      return { results: null };
    }

    // Encode contents as UInt8Array
    const encoder = new TextEncoder();
    const ground_contents = encoder.encode(ground.fileTable.contents);
    const excited_contents = encoder.encode(excited.fileTable.contents);
    const solvent_contents = encoder.encode(solvent.fileTable.contents);

    const sample = {
      concentrationSoluteMolar: state.sample.concentrationSoluteMolar,
      ground: {
        filetype: protoFiles.FileTypes.STRUCTURE_FILE,
        ...ground,
        contents: ground_contents,
      },
      excited: {
        filetype: protoFiles.FileTypes.STRUCTURE_FILE,
        ...excited,
        contents: excited_contents,
      },
      solvent: {
        filetype: protoFiles.FileTypes.SOLVENT_FILE,
        ...solvent,
        contents: solvent_contents,
      },
    };

    const sample_dump = {
      ...sample,
      qRange: state.qRange,
      pump: state.pump,
      ground: { ...sample.ground, contents: `<${sample.ground.contents.length} bytes>` },
      excited: { ...sample.excited, contents: `<${sample.excited.contents.length} bytes>` },
      solvent: { ...sample.solvent, contents: `<${sample.solvent.contents.length} bytes>` },
    };
    console.log('Sample dump:', sample_dump);

    try {
      const results = await simulation_client.runSimulation(
        create(protoSim.SimulationRequestSchema, {
          qRange: state.qRange,
          pump: state.pump,
          sample: sample,
        }),
      );

      // Log results summary, replacing large arrays with their lengths
      const results_dump = {
        ...results,
        q: `<${results?.q?.length} values>`,
        deltaS: `<${results?.deltaS?.length} values>`,
        deltaSSoluteExFrac: `<${results?.deltaSSoluteExFrac?.length} values>`,
        deltaSSolvent: `<${results?.deltaSSolvent?.length} values>`,
      };

      console.log('Simulation results dump:', results_dump);

      return {
        results,
      };
    } catch (err) {
      if (err instanceof ConnectError) {
        err.code;
        err.message;
      }
      const connectErr = ConnectError.from(err);
      connectErr.code;
      connectErr.message;
      console.error('Simulation gRPC error:', connectErr);
      return { results: null };
    }
  },
};
