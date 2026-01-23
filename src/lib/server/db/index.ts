import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { env } from '$env/dynamic/private';

import { relations } from './relations.ts';
import * as schema from './schema.ts';

export type DB = PostgresJsDatabase<typeof schema, typeof relations>;

let _db: DB | undefined = undefined;

function getDb(): DB {
  console.log('Initializing DB connection...');

  const DB_USER = env['DB_USER'];
  const DB_PASSWORD = env['DB_PASSWORD'];
  const DB_HOST = env['DB_HOST'];
  const DB_NAME = env['DB_NAME'];

  if (!DB_USER || !DB_PASSWORD) {
    throw new Error(
      'Missing DB credentials: set DB_USER and DB_PASSWORD environment variables',
    );
  }

  if (!DB_HOST || !DB_NAME) {
    throw new Error(
      'Missing DB host info: set DB_HOST and DB_NAME environment variables',
    );
  }

  const DATABASE_URL =
    `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

  console.log('Connecting to db with', { DB_USER, DB_HOST, DB_NAME });

  const _db = drizzle(DATABASE_URL, { schema, relations }) as unknown as DB;

  return _db;
}

export const db: DB = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    if (!_db) {
      _db = getDb();
    }
    const real = _db;
    const value = Reflect.get(real, prop, receiver);
    // Bind methods so `this` works properly if Drizzle uses it internally
    return typeof value === 'function' ? value.bind(real) : value;
  },
});

export { schema };
