import { defineRelations } from 'drizzle-orm';

import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  molecules: {
    intensities: r.many.intensities(),
  },
  intensities: {
    molecule: r.one.molecules({
      from: r.intensities.moleculeId,
      to: r.molecules.id,
    }),
  },
}));
