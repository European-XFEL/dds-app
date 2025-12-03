import { drizzle } from 'drizzle-orm/pglite';

import { env } from '$env/dynamic/private';

import * as schema from './schema';

export async function setup_db() {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

  const db = drizzle(env.DATABASE_URL, { schema });

  return db;
}

export const db = await setup_db();

export { schema };
