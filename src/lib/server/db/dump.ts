import { PGlite } from '@electric-sql/pglite';
import { pgDump } from '@electric-sql/pglite-tools';
import { drizzle } from 'drizzle-orm/pglite';
import { env } from 'process';

import * as schema from './schema';

const pg = await PGlite.create({ dataDir: env.DATABASE_URL });

console.log(env.DATABASE_URL);

const db = drizzle({ client: pg, schema });

export async function exportDbAsJson() {
  const dump = await pgDump({ pg });
  const dumpContent = await dump.text();
  return dumpContent;
}

exportDbAsJson().then((d) => console.log('Exported', d));
